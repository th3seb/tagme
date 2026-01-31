import { Template } from "../service/template.js";
import { Router } from "../router.js";

export interface InjectedDeps {
    router?: Router;
}

export type BaseElementConstructor<Refs = any> = { new (params?: InjectedDeps): BaseElement<Refs> };

export abstract class BaseElement<Refs = any> extends HTMLElement {
    private deps: InjectedDeps;

    protected refs: Refs = {} as any;
    protected router?: Router;

    private initialized: Promise<void>;

    constructor(deps?: InjectedDeps) {
        super();

        this.deps = deps;
        this.injectDeps(this.deps);

        this.initialized = this.init().then(() => {
            this.injectDeps(this.deps);
        });
    }

    public injectDeps(deps?: InjectedDeps) {
        this.deps = deps;
        this.router = deps?.router;
    }

    protected async init() {}
    public async sync() {
        return this.initialized;
    }

    protected traverse(action: (e: BaseElement) => void) {
        for (const child of this.children) {
            const tag = child.tagName;
            if (!tag.includes("-")) continue;
            if (!window.customElements.get(tag.toLowerCase())) continue;

            const found = child as BaseElement;
            action(found);
            found.traverse(action);
        }
    }

    protected async useTemplate(key: string, clone: boolean = false) {
        const temp = await Template.fromFile(key);
        if (!temp) throw new Error("Can't load template");

        const content = clone ? temp.content.cloneNode(true) : temp.content;
        this.append(content);
        this.traverse((e) => e.injectDeps(this.deps));
    }

    protected findRefs(...refs: (keyof Refs)[]) {
        for (const ref of refs) {
            const e = this.querySelector(`[data-ref="${ref as string}"]`);
            if (e) this.refs[ref as string] = e;
            else console.warn(`Couldn't find data-ref: `, ref);
        }
    }
}

/* 
// BASE EXAMPLE

import { BaseElement } from "../base.js";


interface Refs {}

export class Test extends BaseElement<Refs> {
    async init(): Promise<void> {
        this.useTemplate("test-test");
        this.findRefs( ... );
    }
}

*/
