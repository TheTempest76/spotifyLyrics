import { NextResponse } from 'next/server';
import { generateCodeChallenge ,generateCodeVerifier } from '../../../lib/spotify';
import { getAuthorizationUrl } from '../../../lib/spotify'


export async function GET() {
    const code_verifier = generateCodeVerifier();
    const code_challenge = generateCodeChallenge(code_verifier);
    console.log("Setting code verifier:", code_verifier);
    console.log("Code challenge:", code_challenge);
  const authUrl = getAuthorizationUrl(code_challenge);
  console.log(authUrl)
  const response = NextResponse.json({ authUrl });
  response.cookies.set('spotifyCodeVerifier', code_verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/', // Ensure the cookie is accessible from all paths
  });

  return response;
}