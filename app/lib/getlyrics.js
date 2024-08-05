import axios from 'axios';
import { load } from 'cheerio';

async function scrapeLyrics(url) {
    try {
        console.log(`URL: ${url}`);
        const response = await axios.get(url);
        const data = await response.data;
        const $ = load(data);
        const lyrics = $('.Lyrics__Container-sc-1ynbvzw-1').text();
       
        if (!lyrics) {
            console.log('No lyrics found on the page');
            return null;
        }

        console.log('Lyrics scraped successfully');
        console.log('Lyrics preview:', lyrics.substring(0, 100)); // Log the first 100 characters of the lyrics
        return lyrics;
    } catch (error) {
        console.error('Error scraping lyrics:', error);
        if (error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
}

export default async function getSongLyrics(songTitle, artistName) {
    const formattedSongTitle = songTitle.replace(/\s+/g, '-').toLowerCase();
    const formattedArtistName = artistName.replace(/\s+/g, '-').toLowerCase();
    const lyricsUrl = `https://genius.com/${formattedArtistName}-${formattedSongTitle}-lyrics`;
    console.log(`Formatted URL: ${lyricsUrl}`);
    const lyrics = await scrapeLyrics(lyricsUrl);
    if (lyrics === null) {
        throw new Error('Lyrics not found');
    }
    return lyrics;
}