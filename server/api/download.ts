import { defineEventHandler, getQuery } from 'h3';
import ytdl from 'ytdl-core';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const url = query.url as string;
  const format = query.format as 'video' | 'audio';

  if (!url || !ytdl.validateURL(url)) {
    event.res.statusCode = 400;
    return { error: 'Invalid YouTube URL' };
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters

    let options: ytdl.downloadOptions;
    let filename: string;
    let contentType: string;

    if (format === 'audio') {
      options = {
        quality: 'highestaudio',
        filter: 'audioonly',
      };
      filename = `${title}.mp3`;
      contentType = 'audio/mpeg';
    } else {
      options = {
        quality: 'highestvideo',
        filter: 'videoandaudio',
      };
      filename = `${title}.mp4`;
      contentType = 'video/mp4';
    }

    event.res.setHeader('Content-Type', contentType);
    event.res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    return ytdl(url, options).pipe(event.res);

  } catch (error) {
    console.error(error);
    event.res.statusCode = 500;
    return { error: 'Failed to download video' };
  }
});
