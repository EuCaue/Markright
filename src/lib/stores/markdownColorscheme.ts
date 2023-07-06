import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export interface IMarkdownColorscheme {
	[key: string]: string;
}

const defaultValue: IMarkdownColorscheme = { value: 'Github Dark', theme: 'github-dark' };
const initialValue = browser
	? JSON.parse(window.localStorage.getItem('markdowColorscheme')) ?? defaultValue
	: defaultValue;

console.log(defaultValue);
console.log(initialValue);

const markdownColorscheme = writable<IMarkdownColorscheme>(initialValue);

markdownColorscheme.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('markdowColorscheme', JSON.stringify(value));
	}
});

export default markdownColorscheme;
