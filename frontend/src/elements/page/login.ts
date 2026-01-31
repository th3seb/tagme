import { AuthError, AuthService } from "../../service/auth.js";
import { AppBanner } from "../app/banner.js";
import { BaseElement } from "../base.js";

interface Refs {
    nameOrEmail: HTMLInputElement;
    password: HTMLInputElement;

    frmLogin: HTMLFormElement;
}

export class PageLogin extends BaseElement<Refs> {
    async init(): Promise<void> {
        await this.useTemplate("page-login");
        this.findRefs("frmLogin");

        this.submit = this.submit.bind(this);
        this.refs.frmLogin.addEventListener("submit", this.submit);
    }

    async submit(ev: SubmitEvent) {
        ev.preventDefault();

        AuthService.reset();

        const { nameOrEmail, password } = this.refs.frmLogin.elements as any as Refs;

        try {
            await AuthService.login(nameOrEmail.value, password.value);
        } catch (e: any) {
            const error = e as AuthError;
            // show error
            const banner = new AppBanner({ router: this.router });
            await banner.sync();
            banner.title = "Auth Error";
            banner.message = error.label;

            this.append(banner);
        } finally {
            if (AuthService.valid()) this.router?.navigate("/discover");
        }
    }
}
