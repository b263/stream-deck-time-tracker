declare class Utils {
    /**
     * Returns the value from a form using the form controls name property
     * @param {Element | string} form
     * @returns
     */
    static getFormValue(form: Element | string): {};
    /**
     * Sets the value of form controls using their name attribute and the jsn object key
     * @param {*} jsn
     * @param {Element | string} form
     */
    static setFormValue(jsn: any, form: Element | string): void;
    /**
     * This provides a slight delay before processing rapid events
     * @param {number} wait - delay before processing function (recommended time 150ms)
     * @param {function} fn
     * @returns
     */
    static debounce(wait: number, fn: Function): (...args: any[]) => void;
    static delay(wait: any): Promise<any>;
}
