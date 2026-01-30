export class Template {
    private static entry: HTMLElement = document.querySelector("#templates") || document.body;
    private static templateDir: string = "templates/";

    public static async fromFile(key: string) {
        const temp = this.entry.querySelector(`#${key}`) as HTMLTemplateElement;
        if (temp) return temp;

        const res = await fetch(`${this.templateDir}${key.replace("-", "/")}.html`);
        if (!res.ok) return null;
        const content = await res.text();
        return this.fromContent(key, content);
    }

    public static fromContent(key: string, content: string): HTMLTemplateElement {
        let temp = this.entry.querySelector(`#${key}`) as HTMLTemplateElement;
        if (temp) return temp;

        temp = document.createElement("template");
        temp.innerHTML = content;
        this.entry.append(temp);
        return temp;
    }
}
