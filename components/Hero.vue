<script setup>
import Downloader from './Downloader.vue';
</script>

<template>
  <div class="flex flex-col gap-12 mt-10 mb-20 lg:items-center lg:flex-row">
    <div class="flex-1 w-full">
      <h1 class="text-4xl font-bold text-zinc-800 sm:text-5xl text-balance">YouTube Video Downloader</h1>
      <p class="max-w-xl mt-4 text-lg text-zinc-600 sm:text-xl">
        Paste a YouTube video URL below to get started.
      </p>
      <Downloader />
    </div>
  </div>
</template>
