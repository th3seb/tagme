import { BaseElement } from "../base.js";

interface RefTypes {}

export class AppNav extends BaseElement<RefTypes> {
    async init() {
        await this.useTemplate("app-nav");
    }
}
