<script lang="ts">
  import { ipcRenderer } from 'electron';
  import { onMount } from 'svelte';
  import { tw } from 'twind';
  import { takeScreenShot } from './screenshot';

  export let imageUrl: string;
  let el: HTMLDivElement;
  let rect: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } = null;

  async function handleScreenshot() {
    ipcRenderer.send('hideImage');
    const blob = await takeScreenShot();
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    imageUrl = URL.createObjectURL(blob);
    ipcRenderer.send('showImage');
  }

  function handleShowImage(_, url: string) {
    imageUrl = url;
  }

  function handleMouseDown(e: MouseEvent) {
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseup', handleMouseUp);
    rect = {
      x1: e.clientX - 10,
      y1: e.clientY - 10,
      x2: e.clientX - 10,
      y2: e.clientY - 10,
    };
  }

  function handleMouseMove(e: MouseEvent) {
    rect.x2 = e.clientX - 10;
    rect.y2 = e.clientY - 10;
  }

  function handleMouseUp(e: MouseEvent) {
    el.removeEventListener('mousemove', handleMouseMove);
    el.removeEventListener('mouseup', handleMouseUp);
  }

  function buildCSS(style: Record<string, number>) {
    return Object.entries(style)
      .map(([key, value]) => `${key}:${value}px;`)
      .join('');
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

<div
  class={tw`absolute inset-[10px] cursor-crosshair`}
  on:mousedown={handleMouseDown}
  bind:this={el}
>
  {#if imageUrl}
    <img class={tw`w-full`} src={imageUrl} />
  {/if}
  {#if rect}
    <div class="mask">
      <div style={buildCSS({ width: rect.x1 })} />
      <div style={buildCSS({ left: rect.x2 })} />
      <div
        style={buildCSS({
          left: rect.x1,
          width: rect.x2 - rect.x1,
          height: rect.y1,
        })}
      />
      <div
        style={buildCSS({
          left: rect.x1,
          width: rect.x2 - rect.x1,
          top: rect.y2,
        })}
      />
    </div>
  {/if}
</div>
