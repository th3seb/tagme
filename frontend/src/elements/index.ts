import { AppMain } from "./app/main.js";
import { AppNav } from "./app/nav.js";

const defines = {
    "app-main": AppMain,
    "app-nav": AppNav,
};

export function defineCustomElements() {
    for (const key in defines) {
        window.customElements.define(key, defines[key]);
    }
}
