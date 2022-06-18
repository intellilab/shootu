import { setup, apply } from 'twind';
import App from './app.svelte';

setup({
  preflight: (preflight) => ({
    ...preflight,
    '.mask > *': apply`absolute bg-gray-900 bg-opacity-50 inset-0`,
  }),
});

const root = document.createElement('div');
document.body.append(root);
new App({
  target: root,
});
