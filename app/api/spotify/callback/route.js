import { getAccessToken, getCurrentlyPlaying } from '../../../lib/spotify';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const codeVerifier = request.cookies.get('spotifyCodeVerifier')?.value;

  if (!code || !codeVerifier) {
    console.error('Missing code or code verifier', { code, codeVerifier });
    return NextResponse.json({ error: 'Missing code or code verifier' }, { status: 400 });
  }

  try {
    const accessToken = await getAccessToken(code, codeVerifier);
    
    // Get the currently playing song
    const currentTrack = await getCurrentlyPlaying();
    
    if (!currentTrack) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const { songTitle, artistName } = currentTrack;
    const tit = songTitle.split('-')[0].trim().toLowerCase()
    // Redirect to a new page that will handle fetching lyrics
    const response = NextResponse.redirect(new URL(`/spotify-sync/lyrics?songTitle=${encodeURIComponent(tit)}&artistName=${encodeURIComponent(artistName)}`, request.url));
    
    response.cookies.set('spotifyAccessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/', 
    });

    return response;
  } catch (error) {
    console.error('Error getting access token:', error);
    return NextResponse.json({ 
      error: 'Failed to get access token', 
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}