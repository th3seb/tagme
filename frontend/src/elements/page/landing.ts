import { BaseElement } from "../base.js";

export class PageLanding extends BaseElement {
    async init(): Promise<void> {
        await this.useTemplate("page-landing");

        // show different contents depending if user is logged in
        this.append(this.router?.currentParams().toString());
    }
}
