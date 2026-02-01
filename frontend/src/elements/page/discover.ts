import { BaseElement } from "../base.js";

export class PageDiscover extends BaseElement {
    async init(): Promise<void> {
        await this.useTemplate("page-discover");
    }
}
