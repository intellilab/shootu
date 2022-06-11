import { setup } from 'twind';
import App from './app.svelte';

setup({
  // preflight: (preflight) => ({
  //   ...preflight,
  // }),
});

const root = document.createElement('div');
document.body.append(root);
new App({
  target: root,
});
