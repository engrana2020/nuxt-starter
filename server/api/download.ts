import ytDlp from 'yt-dlp-exec';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const url = query.url as string;

  if (!url) {
    return {
      statusCode: 400,
      body: 'URL is required',
    };
  }

  try {
    const videoInfo = await ytDlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      callHome: false,
      noCheckCertificate: true,
    });
    return videoInfo;
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: 'Failed to fetch video information',
    };
  }
});
