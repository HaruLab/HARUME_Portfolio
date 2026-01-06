
import https from 'https';

const PLAYLIST_ID = 'PL_IDDWCeMOvfUv5lD2VfvLX4TSVfLvrZv';
const PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`;

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
  }
};

const fetchUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
};

const getVideoDetails = async (videoId) => {
  try {
    const html = await fetchUrl(`https://www.youtube.com/watch?v=${videoId}`);
    // Extract description from ytInitialPlayerResponse
    const match = html.match(/var ytInitialPlayerResponse = ({.*?});/s);
    if (!match) return { description: '', publishDate: '' };
    
    const json = JSON.parse(match[1]);
    const description = json.videoDetails?.shortDescription || '';
    const publishDate = json.microformat?.playerMicroformatRenderer?.publishDate || '';
    
    return { description, publishDate };
  } catch (e) {
    console.error(`Error fetching details for ${videoId}:`, e.message);
    return { description: '', publishDate: '' };
  }
};

const main = async () => {
  try {
    const playlistHtml = await fetchUrl(PLAYLIST_URL);
    
    const match = playlistHtml.match(/var ytInitialData = ({.*?});/s) || playlistHtml.match(/window\["ytInitialData"\] = ({.*?});/s);
    if (!match) throw new Error('Could not find ytInitialData in playlist');

    const json = JSON.parse(match[1]);
    const contents = json.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer?.contents;

    if (!contents) throw new Error('Could not find playlist contents');

    const videos = contents
      .filter(item => item.playlistVideoRenderer)
      .map(item => {
        const video = item.playlistVideoRenderer;
        return {
          id: video.videoId,
          title: video.title.runs[0].text,
          thumbnail: video.thumbnail.thumbnails.pop().url.split('?')[0],
          channel: video.shortBylineText?.runs?.[0]?.text || '',
          length: video.lengthText?.simpleText || '',
          url: `https://www.youtube.com/watch?v=${video.videoId}&list=${PLAYLIST_ID}`
        };
      });

    // Fetch descriptions for each video (sequential to be nice to server)
    const videosWithDetails = [];
    console.error(`Found ${videos.length} videos. Fetching details...`);
    
    for (const video of videos) {
      console.error(`Fetching ${video.title}...`);
      const { description, publishDate } = await getVideoDetails(video.id);
      
      // Simple credit extraction heuristic: Look for lines with "Made by", "Movie:", "Music:", etc?
      // For now, just store the full text, and maybe a "credits" object if we parse common patterns.
      // Let's try to extract lines containing specific keywords?
      // Or just pass the raw description for the frontend to handle/display?
      // User said "概要欄にクレジットがあるが". 
      // I will save the full description.
      
      videosWithDetails.push({
        ...video,
        description_raw: description,
        publishDate: publishDate
      });
      
      // Small delay
      await new Promise(r => setTimeout(r, 500));
    }

    console.log(JSON.stringify(videosWithDetails, null, 2));

  } catch (e) {
    console.error('Error:', e);
  }
};

main();
