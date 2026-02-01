import { AuthService } from "../../service/auth.js";
import { BaseElement } from "../base.js";

interface Refs {
    btnLogout: HTMLButtonElement;
}

export class PageLanding extends BaseElement<Refs> {
    async init(): Promise<void> {
        await this.useTemplate("page-landing");
        this.findRefs("btnLogout");

        if (!AuthService.valid()) this.refs.btnLogout.disabled = true;

        this.refs.btnLogout.addEventListener("click", () => {
            AuthService.reset();

            this.router?.navigate("/landing", "replace");
        });

        // show different contents depending if user is logged in
        this.append(this.router?.currentParams().toString());
    }
}
