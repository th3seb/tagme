// optional hash # in url -> for static page serving
// inject to a single html element
// has base path

/*
const router = new Router("<app-main>", "/", useHash);

router.on("/", middleware..., PageDiscover);
router.on("/login", PageLogin);

*/
interface RouterConfig {
    root: string;
    inject: HTMLElement;
    useHash?: boolean;
}

type Redirect = (path: string, replace?: boolean) => Promise<RoutingInfo>;
type Sync<T> = () => Promise<T>;
type Render = (element: HTMLElement) => boolean;
export type HandlerFlow<T = any> = { redirect: Redirect; sync: Sync<T>; render: Render };
export type Handler<T extends any[] = any, E extends keyof T = any> = (flow: HandlerFlow<T>) => Promise<T[E]>;

interface RoutingInfo {
    previous: string;
    requested: string;
    current: string;
}

export class Router {
    private root: string;
    private inject: HTMLElement;
    private useHash: boolean;

    private routes: { [path: string]: Handler[] } = {};

    constructor(config: RouterConfig) {
        this.root = config.root;
        this.inject = config.inject;
        this.useHash = !!config.useHash;

        window.addEventListener("popstate", (ev) => {
            this.navigate(this.currentPath(), "silent");
        });
    }

    public on(path: string, ...handlers: Handler[]) {
        if (this.routes[path]) {
            console.warn("Path already defined! skipping define");
            return;
        }
        this.routes[path] = handlers;
    }

    public currentPath(excludeParams: boolean = false) {
        let path = window.location.pathname;
        if (this.useHash) path = window.location.hash.replace("#", "");
        if (!excludeParams && window.location.search) path += "?" + window.location.search;
        return path;
    }

    public currentParams(): URLSearchParams {
        return new URLSearchParams(window.location.search);
    }

    private render(element: HTMLElement) {
        console.debug("Rendering: ", element);
        this.inject.innerHTML = "";
        this.inject.append(element);
        return true;
    }

    public back() {
        window.history.back();
    }

    public navigate(to: string, history: "push" | "silent" | "replace" = "push"): Promise<RoutingInfo> {
        if (!to) to = this.root;

        console.debug("Routing to " + to);
        const [route, params] = to.split("?");
        // ignore params for now - soft reload in future?

        if (!this.routes[route]) throw new Error(`Route "${route}" doesn't exist!`);

        const previous = this.currentPath();

        const url = this.useHash ? `#${to}` : to;
        if (history === "push") {
            window.history.pushState({}, "", url);
            console.debug("Added to history");
        } else if (history === "replace") {
            window.history.replaceState({}, "", url);
            console.debug("Replaced in history");
        }

        const handlers = this.routes[route];
        const promises = [];
        let interrupted = false;
        for (let i = 0; i < handlers.length; i++) {
            const previousHandler = [...promises];

            promises.push(
                handlers[i]({
                    render: (el) => !interrupted && this.render(el),
                    redirect: (path, replace) => {
                        if (interrupted) return;
                        interrupted = true;
                        if (replace === undefined) replace = true;

                        console.debug(`${replace ? "Redirecting" : "Navigating"} ${to} ${path}`);
                        return this.navigate(path, replace ? "replace" : "push");
                    },
                    sync: async () => {
                        if (interrupted) return;

                        if (!previousHandler.length) return undefined;

                        console.debug(`Waiting for previous handlers`);
                        return Promise.all(previousHandler);
                    },
                })
            );
        }
        return Promise.allSettled(promises).then(() => {
            const info: RoutingInfo = { previous, current: this.currentPath(), requested: to };
            console.debug("Done routing! Info: ", info);
            return info;
        });
    }
}
