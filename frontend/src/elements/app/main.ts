import { AuthService } from "../../service/auth.js";
import { BaseElement } from "../base.js";
import { AppNav } from "./nav.js";

interface Refs {
    navbar: AppNav;
}

export class AppMain extends BaseElement<Refs> {
    async init() {
        await this.useTemplate("app-main");
        this.findRefs("navbar");
    }

    update() {
        this.refs.navbar.style.display = AuthService.valid() ? "" : "none";
    }
}
