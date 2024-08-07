import SpotifyWebApi from "spotify-web-api-node";
import { randomBytes, createHash } from 'crypto';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

export function generateCodeVerifier() {
  return randomBytes(32).toString('base64url');
}

export function generateCodeChallenge(verifier) {
  return createHash('sha256').update(verifier).digest('base64url');
}

export function getAuthorizationUrl(codeChallenge) {
  const scopes = ['user-read-currently-playing'];
  const state = randomBytes(16).toString('hex');

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', process.env.SPOTIFY_CLIENT_ID);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('scope', scopes.join(' '));
  authUrl.searchParams.append('code_challenge_method', 'S256');
  authUrl.searchParams.append('code_challenge', codeChallenge);

  console.log("Generated Auth URL:", authUrl.toString());
  return authUrl.toString();
}

export async function getAccessToken(code, codeVerifier) {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    spotifyApi.setAccessToken(data.access_token);
    spotifyApi.setRefreshToken(data.refresh_token);
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

export async function getCurrentlyPlaying() {
  const data = await spotifyApi.getMyCurrentPlayingTrack();
  if (data.body && data.body.item) {
    return {
      songTitle: data.body.item.name,
      artistName: data.body.item.artists[0].name,
    };
  }
  return null;
} 