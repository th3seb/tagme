import { Template } from "../service/template.js";
import { Router } from "../router.js";

export interface InjectedDeps {
    router?: Router;
}

export const DependencyStorage: InjectedDeps = {};

export type BaseElementConstructor<Refs = any> = { new (): BaseElement<Refs> };

export abstract class BaseElement<Refs = any> extends HTMLElement {
    private deps: InjectedDeps;

    protected refs: Refs = {} as any;
    protected router?: Router;

    private initialized: Promise<void>;

    constructor() {
        super();

        this.deps = DependencyStorage;
        this.router = this.deps.router;

        this.initialized = this.init();
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

    protected async useTemplate(key: string, clone: boolean = false, shadowDom: boolean = false) {
        const temp = await Template.fromFile(key);
        if (!temp) throw new Error("Can't load template");

        const content = clone ? temp.content.cloneNode(true) : temp.content;
        if (!shadowDom) this.append(content);
        else {
            this.attachShadow({ mode: "open" });
            this.shadowRoot.append(content);
        }
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
