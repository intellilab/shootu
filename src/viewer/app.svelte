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
  } = { x1: 0, y1: 0, x2: 0, y2: 0 };

  function hideImage() {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    imageUrl = null;
    ipcRenderer.send('hideImage');
  }

  async function handleScreenshot() {
    hideImage();
    const blob = await takeScreenShot();
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.src = url;
    image.onload = () => {
      imageUrl = url;
    };
    ipcRenderer.send('showImage');
  }

  function handleMouseDown(e: MouseEvent) {
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseup', handleMouseUp);
    rect = {
      x1: e.clientX,
      y1: e.clientY,
      x2: e.clientX,
      y2: e.clientY,
    };
  }

  function handleMouseMove(e: MouseEvent) {
    rect.x2 = e.clientX;
    rect.y2 = e.clientY;
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
    return () => {
      ipcRenderer.removeListener('takeScreenshot', handleScreenshot);
    };
  });
</script>

<div
  class={tw`absolute inset-0 cursor-crosshair`}
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
