export class AuthError extends Error {
    public readonly status: number;
    public readonly label: string;

    constructor(status: number, label: string) {
        super(`${status}: ${label}`);

        this.status = status;
        this.label = label;
    }
}

export class AuthService {
    public static valid(): boolean {
        const jwt = window.sessionStorage.getItem("jwt");
        // check claims
        return !!jwt;
    }

    public static reset(): void {
        window.sessionStorage.removeItem("jwt");
    }

    public static async login(nameOrEmail: string, password: string): Promise<void> {
        await wait(500);
        if (nameOrEmail == "sebu" && password == "pass") {
            sessionStorage.setItem("jwt", nameOrEmail);
            return;
        }
        throw new AuthError(404, "user-or-password-wrong");
    }
}

function wait(ms: number) {
    return new Promise((res, rej) => setTimeout(res, ms));
}
