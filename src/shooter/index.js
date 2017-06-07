import { ipcRenderer } from 'electron';
import './style.css';
import takeScreenShot from './screenshot';

ipcRenderer.on('takeScreenshot', () => {
  takeScreenShot(blob => {
    const url = URL.createObjectURL(blob);
    ipcRenderer.send('tokeScreenshot', url);
    // const img = new Image();
    // img.src = url;
    // document.body.appendChild(img);
  });
});
