import { ipcRenderer } from 'electron';
import { createElement } from '../utils';
import './style.css';

const root = createElement('div', {
  id: 'root',
});
document.body.appendChild(root);

ipcRenderer.on('showImage', (e, url) => {
  root.innerHTML = '';
  const img = new Image();
  img.src = url;
  root.appendChild(img);
});
