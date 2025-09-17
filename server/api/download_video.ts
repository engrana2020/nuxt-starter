import ytDlp from 'yt-dlp-exec';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const url = query.url as string;
  const formatId = query.formatId as string;

  if (!url || !formatId) {
    return {
      statusCode: 400,
      body: 'URL and formatId are required',
    };
  }

  try {
    const stream = ytDlp.exec(url, {
      format: formatId,
      output: '-',
    });

    return sendStream(event, stream.stdout);
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: 'Failed to download video',
    };
  }
});
