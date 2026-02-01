import { BaseElement } from "../base.js";

export class PageChat extends BaseElement {
    async init(): Promise<void> {
        await this.useTemplate("page-chat");
    }
}
