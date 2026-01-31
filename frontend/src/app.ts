import { AppMain } from "./elements/app/main.js";
import { AppNav } from "./elements/app/nav.js";
import { AppLink } from "./elements/app/link.js";
import { AppBanner } from "./elements/app/banner.js";

import { PageLogin } from "./elements/page/login.js";
import { PageLanding } from "./elements/page/landing.js";

import { BaseElement, BaseElementConstructor, InjectedDeps } from "./elements/base.js";
import { Handler, Router } from "./router.js";

import { AuthService } from "./service/auth.js";

// Setup custom elements
const defines = {
    "app-main": AppMain,
    "app-nav": AppNav,
    "app-link": AppLink,
    "app-banner": AppBanner,

    "page-landing": PageLanding,
    "page-login": PageLogin,
};

for (const key in defines) {
    window.customElements.define(key, defines[key]);
}

let app = document.querySelector("app-main") as AppMain;
if (!app) {
    app = new AppMain();
    document.body.append(app);
}
app.sync().then(() => {
    startRouter();
});

function startRouter() {
    // Setup frontend routing
    const router = new Router({ inject: app.querySelector("#router-entry"), root: "/", useHash: true });

    router.on("/", authHandler(), renderHandler(PageLanding));
    router.on("/login", renderHandler(PageLogin));

    app.injectDeps({ router });
    router.navigate(router.currentPath(), "replace");

    function authHandler(): Handler<[boolean, BaseElement], 0> {
        return async (flow) => {
            if (AuthService.valid()) return true;
            await flow.redirect("/login");
        };
    }

    function renderHandler(page: BaseElementConstructor): Handler<[boolean, BaseElement], 1> {
        return async (flow) => {
            await flow.sync();
            const element = new page({ router });
            flow.render(element);
            return element;
        };
    }
}
