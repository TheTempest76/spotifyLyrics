'use client';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [cookies] = useCookies(['spotifyAccessToken']);
  const [spotifyAuthed, setSpotifyAuthed] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (cookies.spotifyAccessToken) {
      setSpotifyAuthed(true);
    }
  }, [cookies.spotifyAccessToken]);

  const handleSpotifyAuth = async () => {
    if (spotifyAuthed) {
      try {
        const response = await fetch('/api/spotify/getTrack');
        const data = await response.json();
        if ('songTitle' in data && 'artistName' in data) {
          router.push(`/spotify-sync/lyrics?songTitle=${encodeURIComponent(data.songTitle)}&artistName=${encodeURIComponent(data.artistName)}`);
        } else {
          throw new Error('Failed to fetch current track');
        }
      } catch (error) {
        console.error('Error fetching current track:', error);
        // If there's an error (e.g., token expired), initiate new auth
        initiateSpotifyAuth();
      }
    } else {
      initiateSpotifyAuth();
    }
  };

  const initiateSpotifyAuth = async () => {
    try {
      const response = await fetch('/api/spotify/auth');
      const data: { authUrl: string } = await response.json();
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Error during Spotify auth:', error);
    }
  };

  return (
    <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <button onClick={handleSpotifyAuth} className="bg-green-500 text-white p-2 rounded mb-4">
        Connect to Spotify
      </button>
    </main>
  );
}