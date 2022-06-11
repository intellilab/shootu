import { ipcRenderer } from 'electron';

export async function takeScreenShot() {
  const { size, sources } = await ipcRenderer.invoke('getSources');
  const width = size.width * devicePixelRatio;
  const height = size.height * devicePixelRatio;
  const sourceId = sources.find((item) => item.id.startsWith('screen:')).id;
  ipcRenderer.send('log', 'screenshot init', sourceId);
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: sourceId,
        minWidth: width,
        maxWidth: width,
        minHeight: height,
        maxHeight: height,
      },
    },
  });
  ipcRenderer.send('log', 'stream ready');
  const video = await new Promise((resolve, reject) => {
    const video = document.createElement('video');
    document.body.append(video);
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
    };
    video.oncanplay = () => {
      ipcRenderer.send('log', 'video ready');
      video.width = width;
      video.height = height;
      resolve(video);
    };
    video.onerror = reject;
  });
  const data = await getImage(video);
  video.pause();
  video.remove();
  return data;
}

function getImage(video) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.width;
    canvas.height = video.height;
    context.drawImage(video, 0, 0, video.width, video.height);
    canvas.toBlob(resolve);
  });
}
