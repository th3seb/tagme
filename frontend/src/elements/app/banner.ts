import { BaseElement } from "../base.js";

interface Refs {
    title: HTMLSlotElement;
    message: HTMLSlotElement;
    banner: HTMLDivElement;
}

export class AppBanner extends BaseElement<Refs> {
    private static observedAttributes: string[] = ["data-type"];

    async init(): Promise<void> {
        await this.useTemplate("app-banner", true, true);

        if (!this.hasAttribute("data-type")) {
            this.setAttribute("data-type", "error");
        }

        this.refs = {
            title: this.shadowRoot.querySelector('slot[name="title"]'),
            message: this.shadowRoot.querySelector('slot[name="message"]'),
            banner: this.shadowRoot.querySelector("div.banner"),
        };

        console.log(this.previousAttributes);

        for (const attr in this.previousAttributes) {
            this.refs.banner.setAttribute(attr, this.previousAttributes[attr]);
        }
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

    private previousAttributes: any = {};
    private attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (this.shadowRoot) this.shadowRoot.querySelector("div.banner").setAttribute(name, newValue);
        else this.previousAttributes[name] = newValue;
    }
}
