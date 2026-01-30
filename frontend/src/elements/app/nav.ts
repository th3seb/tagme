import { BaseElement } from "../base.js";

interface RefTypes {
    me: HTMLButtonElement;
    discover: HTMLButtonElement;
    chats: HTMLButtonElement;
}

export class AppNav extends BaseElement<RefTypes> {
    async init() {
        await this.useTemplate("app-nav");
        this.findRefs("chats", "discover", "me");

        this.refs.me.addEventListener("click", () => {
            console.log("OKOK");
        });
    }
}
