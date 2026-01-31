import { BaseElement } from "../base.js";

interface Refs {
    title: HTMLSpanElement;
    message: HTMLSpanElement;
}

export class AppBanner extends BaseElement<Refs> {
    async init(): Promise<void> {
        await this.useTemplate("app-banner");
        this.findRefs("message", "title");
    }

    public set title(v: string) {
        this.refs.title.textContent = v;
    }

    public get title(): string {
        return this.refs.title.textContent;
    }

    public set message(v: string) {
        this.refs.message.textContent = v;
    }

    public get message(): string {
        return this.refs.message.textContent;
    }
}
