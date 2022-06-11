<script>
  import { ipcRenderer } from 'electron';
  import { onMount } from 'svelte';
  import { tw } from 'twind';
  import { takeScreenShot } from './screenshot';

  export let imageUrl;

  async function handleScreenshot() {
    ipcRenderer.send('hideImage');
    const blob = await takeScreenShot();
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    imageUrl = URL.createObjectURL(blob);
    ipcRenderer.send('showImage');
  }

  function handleShowImage(_, url) {
    imageUrl = url;
  }

  onMount(() => {
    ipcRenderer.on('takeScreenshot', handleScreenshot);
    ipcRenderer.on('showImage', handleShowImage);
    return () => {
      ipcRenderer.removeListener('takeScreenshot', handleScreenshot);
      ipcRenderer.removeListener('showImage', handleShowImage);
    };
  });
</script>

<div class={tw`absolute inset-[10px]`}>
{#if imageUrl}
<img class={tw`w-full`} src={imageUrl}>
{/if}
</div>
