import path from 'path';
import url from 'url';
import { app, BrowserWindow, screen, ipcMain } from 'electron';

let forceQuit = false;

app.on('ready', () => {
  init();
});
app.on('before-quit', () => {
  forceQuit = true;
});

ipcMain.on('log', (e, data) => {
  log(data);
});

function log(data) {
  console.log(new Date(), data);
}

function createWindow(options) {
  const win = new BrowserWindow(options);
  win.on('close', e => {
    if (forceQuit) return;
    e.preventDefault();
    win.hide();
  });
  return win;
}

function init() {
  const winShot = createWindow({
    show: false,
  });
  winShot.loadURL(url.format({
    pathname: path.resolve(__dirname, 'shooter.html'),
    protocol: 'file:',
    slashes: true,
  }));
  winShot.webContents.once('did-finish-load', () => {
    app.on('activate', () => {
      log('screenshot start');
      winShot.webContents.send('takeScreenshot');
    });
  });
  const mainScreen = screen.getPrimaryDisplay();
  const winImage = createWindow({
    x: -10,
    y: -10,
    width: mainScreen.bounds.width + 20,
    height: mainScreen.bounds.height + 20,
    frame: false,
    enableLargerThanScreen: true,
    show: false,
  });
  winImage.setAlwaysOnTop(true, 'screen-saver');
  winImage.loadURL(url.format({
    pathname: path.resolve(__dirname, 'viewer.html'),
    protocol: 'file:',
    slashes: true,
  }));
  ipcMain.on('tokeScreenshot', (e, imageUrl) => {
    log('screenshot ready');
    winImage.webContents.send('showImage', imageUrl);
    winImage.show();
  });
}
