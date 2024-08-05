import getSongLyrics from '../../lib/getlyrics';

import { NextResponse } from 'next/server';


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const songTitle = searchParams.get('songTitle');
  const artistName = searchParams.get('artistName');

  if (!songTitle || !artistName) {
    return NextResponse.json({ error: 'Missing songTitle or artistName' }, { status: 400 });
  }

  try {
    console.log(`Fetching lyrics for: ${songTitle} by ${artistName}`);
    const lyrics = await getSongLyrics(songTitle, artistName);
    console.log('Lyrics fetched successfully');
    console.log('Lyrics preview:', lyrics.substring(0, 100)); // Log the first 100 characters of the lyrics
    return NextResponse.json({ lyrics });
  } catch (error) {
    console.error('Error in API route:', error);
    if (error.message === 'Lyrics not found') {
      return NextResponse.json({ error: 'Lyrics not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to fetch lyrics' }, { status: 500 });
  }
}