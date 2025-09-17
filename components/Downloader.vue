<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
      <form @submit.prevent="fetchVideoInfo" class="w-full max-w-md">
        <div class="flex items-center border-b border-teal-500 py-2">
          <input v-model="url" class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="https://www.youtube.com/watch?v=..." aria-label="YouTube URL">
          <button class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
            Fetch Video
          </button>
        </div>
      </form>
    </div>

    <div v-if="error" class="w-full max-w-md mt-4 text-red-500">
      {{ error }}
    </div>

    <div v-if="videoInfo" class="w-full max-w-4xl mt-6">
      <h2 class="text-3xl font-bold">{{ videoInfo.title }}</h2>
      <img :src="videoInfo.thumbnail" :alt="videoInfo.title" class="mx-auto mt-4">
      <div class="mt-4">
        <h3 class="text-2xl font-bold">Available Formats</h3>
        <ul class="mt-2">
          <li v-for="format in videoInfo.formats" :key="format.format_id" class="border-b py-2">
            <a :href="`/api/download_video?url=${encodeURIComponent(url)}&formatId=${format.format_id}`" :download="`${videoInfo.title}.${format.ext}`" class="text-blue-500 hover:text-blue-700">
              {{ format.format_note }} - {{ format.ext }} - {{ (format.filesize / 1024 / 1024).toFixed(2) }} MB
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const url = ref('');
const videoInfo = ref(null);
const error = ref(null);

const fetchVideoInfo = async () => {
  error.value = null;
  if (!url.value) {
    error.value = 'Please enter a YouTube URL';
    return;
  }

  const { data, error: fetchError } = await useFetch(`/api/download?url=${encodeURIComponent(url.value)}`);

  if (fetchError.value) {
    error.value = 'Failed to fetch video information. Please check the URL and try again.';
    videoInfo.value = null;
    return;
  }

  videoInfo.value = data.value;
};
</script>
