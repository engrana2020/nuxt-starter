<script setup>
import { ref } from 'vue';

const url = ref('');
const error = ref('');
const downloading = ref(false);

const download = async (format) => {
  if (!url.value) {
    error.value = 'Please enter a YouTube URL';
    return;
  }
  error.value = '';
  downloading.value = true;

  try {
    const response = await fetch(`/api/download?url=${encodeURIComponent(url.value)}&format=${format}`);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to download');
    }
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const contentDisposition = response.headers.get('content-disposition');
    let filename = 'download';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
      if (filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (err) {
    error.value = err.message;
  } finally {
    downloading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col gap-12 mt-10 mb-20 lg:items-center lg:flex-row">
    <div class="flex-1 w-full">
      <h1 class="text-4xl font-bold text-zinc-800 sm:text-5xl text-balance">YouTube Downloader</h1>
      <p class="max-w-xl mt-4 text-lg text-zinc-600 sm:text-xl">
        Enter a YouTube URL below to download the video or audio.
      </p>
      <div class="flex flex-col gap-4 mt-8">
        <input
          v-model="url"
          type="text"
          placeholder="Enter YouTube URL"
          class="px-4 py-3 border border-gray-300 rounded-sm"
        />
        <div class="flex flex-wrap gap-4">
          <button
            @click="download('video')"
            :disabled="downloading"
            class="inline-flex px-6 py-3 text-white duration-300 bg-green-600 rounded-sm hover:bg-gray-800 transition-color disabled:bg-gray-400"
          >
            {{ downloading ? 'Downloading...' : 'Download Video' }}
          </button>
          <button
            @click="download('audio')"
            :disabled="downloading"
            class="inline-flex px-6 py-3 text-white duration-300 bg-blue-600 rounded-sm hover:bg-gray-800 transition-color disabled:bg-gray-400"
          >
            {{ downloading ? 'Downloading...' : 'Download Audio' }}
          </button>
        </div>
        <p v-if="error" class="text-red-500">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
