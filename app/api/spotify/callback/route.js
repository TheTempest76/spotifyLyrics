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
    const { accessToken, refreshToken } = await getAccessToken(code, codeVerifier);
    console.log(accessToken)
    // Get the currently playing song
    const currentTrack = await getCurrentlyPlaying(accessToken);
    
    if (!currentTrack) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const { songTitle, artistName } = currentTrack;
    const tit = songTitle.split('-')[0].trim().toLowerCase();

    // Redirect to the lyrics page
    const response = NextResponse.redirect(new URL(`/spotify-sync/lyrics?songTitle=${encodeURIComponent(tit)}&artistName=${encodeURIComponent(artistName)}`, request.url));
    
    // Set cookies
    response.cookies.set('spotifyAccessToken', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    response.cookies.set('spotifyRefreshToken', refreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
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