import { ipcRenderer } from 'electron';

export default function takeScreenShot(callback) {
  const screenConstraints = {
    mandatory: {
      chromeMediaSource: 'screen',
      maxWidth: screen.width * devicePixelRatio,
      maxHeight: screen.height * devicePixelRatio,
    },
    optional: [],
  };

  const session = {
    audio: false,
    video: screenConstraints,
  };

  let streaming = false;
  const canvas = document.createElement('canvas');
  const video = document.createElement('video');
  document.body.appendChild(canvas);
  document.body.appendChild(video);
  const width = screen.width * devicePixelRatio;
  ipcRenderer.send('log', 'screenshot init');

  video.addEventListener('canplay', () => {
    ipcRenderer.send('log', 'video ready');
    if (!streaming) {
      const height = video.videoHeight / (video.videoWidth / width);
      video.width = width;
      video.height = height;
      streaming = true;

      const context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        canvas.toBlob(data => {
          ipcRenderer.send('log', 'canvas ready');
          video.pause();
          URL.revokeObjectURL(video.src);
          video.src = '';
          document.body.removeChild(video);
          document.body.removeChild(canvas);
          callback(data);
        });
      }
    }
  }, false);

  navigator.getUserMedia(session, stream => {
    ipcRenderer.send('log', 'stream ready');
    video.src = URL.createObjectURL(stream);
    video.play();
  }, err => {
    console.error(err);
  });
}
