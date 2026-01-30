import { BaseElement } from "../base.js";

export class AppMain extends BaseElement {
    async init() {
        await this.useTemplate("app-main");
    }
}
