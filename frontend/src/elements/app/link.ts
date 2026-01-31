import { BaseElement } from "../base.js";

export class AppLink extends BaseElement {
    async init(): Promise<void> {
        this.click = this.click.bind(this);
        this.addEventListener("click", this.click);
    }

    public click() {
        const href = this.getAttribute("data-href");
        if (!href) return;

        this.router?.navigate(href);
    }
}
