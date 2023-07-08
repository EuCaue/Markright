import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export interface IMarkdownValues {
	[key: string]: string;
}

const defaultValue: IMarkdownValues = { text: '', html: '' };
const initialValue = browser
	? JSON.parse(window.localStorage.getItem('md')) ?? defaultValue
	: defaultValue;

console.log(initialValue);

const md = writable<IMarkdownValues>(initialValue);

md.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('md', JSON.stringify(value));
	}
});

export default md;
