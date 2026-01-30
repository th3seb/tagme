import { Template } from "../service/template.js";
import { Router } from "../router.js";

interface InjectedParams {
    router?: Router;
}

export abstract class BaseElement<Refs = any> extends HTMLElement {
    protected refs: Refs = {} as any;
    protected router?: Router;

    constructor(params?: InjectedParams) {
        super();

        this.router = params?.router;

        this.init();
    }

    protected async init() {}

    protected async useTemplate(key: string, clone: boolean = false) {
        const temp = await Template.fromFile(key);
        if (!temp) throw new Error("Can't load template");

        const content = clone ? temp.content.cloneNode(true) : temp.content;
        this.append(content);
    }

    protected findRefs(...refs: (keyof Refs)[]) {
        for (const ref of refs) {
            const e = this.querySelector(`[data-ref="${ref as string}"]`);
            if (e) this.refs[ref as string] = e;
            else console.warn(`Couldn't find data-ref: `, ref);
        }
    }
}
