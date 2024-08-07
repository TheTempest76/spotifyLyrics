import { refreshAccessToken } from '../../../lib/spotify';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const refreshToken = request.cookies.get('spotifyRefreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token available' }, { status: 400 });
  }

  try {
    const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);

    const response = NextResponse.json({ success: true });

    response.cookies.set('spotifyAccessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    if (newRefreshToken) {
      response.cookies.set('spotifyRefreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return NextResponse.json({ error: 'Failed to refresh access token' }, { status: 500 });
  }
}