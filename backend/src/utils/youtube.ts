/**
 * Extract YouTube video ID from various URL formats.
 * Returns null if the URL is not a recognizable YouTube URL.
 */
export function youtubeId(url: string): string | null {
  // youtu.be/<id>
  const short = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (short) return short[1];

  // youtube.com/watch?v=<id>
  const watch = url.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (watch) return watch[1];

  // youtube.com/embed/<id> or youtube.com/shorts/<id>
  const embed = url.match(/youtube\.com\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})/);
  if (embed) return embed[1];

  return null;
}

/** YouTube thumbnail URL from a video ID */
export function youtubeThumb(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
