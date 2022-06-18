import path from 'path';
import { app, BrowserWindow, screen, ipcMain, desktopCapturer } from 'electron';

let forceQuit = false;

app.on('ready', () => {
  init();
});
app.on('before-quit', () => {
  forceQuit = true;
});

ipcMain.on('log', (_, data) => {
  log(data);
});

ipcMain.handle('getSources', async () => {
  const display = screen.getPrimaryDisplay();
  const sources = await desktopCapturer.getSources({
    types: ['window', 'screen'],
  });
  return {
    size: display.size,
    sources: sources.map((item) => ({
      id: item.id,
      name: item.name,
      displayId: item.display_id,
      appIcon: item.appIcon,
    })),
  };
});

function log(data: unknown) {
  console.log(new Date(), data);
}

function createWindow(options: Electron.BrowserWindowConstructorOptions) {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    ...options,
  });
  win.on('close', (e) => {
    if (forceQuit) return;
    e.preventDefault();
    win.hide();
  });
  return win;
}

function init() {
  const base = path.join(app.getAppPath(), 'dist');
  const mainScreen = screen.getPrimaryDisplay();
  const winImage = createWindow({
    roundedCorners: false,
    x: 0,
    y: 0,
    width: mainScreen.bounds.width,
    height: mainScreen.bounds.height,
    frame: false,
    enableLargerThanScreen: true,
    show: false,
    transparent: true,
  });
  winImage.setAlwaysOnTop(true, 'screen-saver');
  winImage.loadFile(path.join(base, 'viewer.html'));
  winImage.webContents.once('did-finish-load', () => {
    app.on('activate', () => {
      log('screenshot start');
      winImage.webContents.send('takeScreenshot');
    });
  });
  ipcMain.on('hideImage', () => {
    log('hide screenshot');
    winImage.hide();
  });
  ipcMain.on('showImage', () => {
    log('show screenshot');
    winImage.show();
  });
}
