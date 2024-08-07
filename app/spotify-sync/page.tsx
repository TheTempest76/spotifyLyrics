'use client';

import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function Home() {
  const [cookies, setCookie, removeCookie] = useCookies(['spotifyAccessToken']);
  const [songTitle, setSongTitle] = useState<string>('');
  const [artistName, setArtistName] = useState<string>('');
  const [lyrics, setLyrics] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [spotifyAuthed, setSpotifyAuthed] = useState<boolean>(false);

  useEffect(() => {
    if (cookies.spotifyAccessToken) {
      setSpotifyAuthed(true);
      fetchCurrentTrack();
    }
  }, [cookies.spotifyAccessToken]);

  const handleSpotifyAuth = async () => {
    try {
      const response = await fetch('/api/spotify/auth');
      const data: { authUrl: string } = await response.json();
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Error during Spotify auth:', error);
      setError('Failed to initiate Spotify authentication');
    }
  };

  const fetchCurrentTrack = async () => {
    try {
      const response = await fetch('/api/spotify/getTrack');
      const data: { songTitle: string; artistName: string } | { error: string } = await response.json();
      if ('songTitle' in data && 'artistName' in data) {
        setSongTitle(data.songTitle);
        setArtistName(data.artistName);
        handleFetchLyrics(data.songTitle, data.artistName);
      }
    } catch (error) {
      console.error('Error fetching current track:', error);
      setError('Failed to fetch current track');
    }
  };

  const handleFetchLyrics = async (title: string, artist: string) => {
    
    setLoading(true);
    setError('');
    setLyrics('');
    try {

      const response = await fetch(`/api/lyrics?songTitle=${encodeURIComponent(title.split('-')[0].trim().toLowerCase())}&artistName=${encodeURIComponent(artist)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: { lyrics: string } | { error: string } = await response.json();
      if ('error' in data) {
        throw new Error(data.error);
      }
      setLyrics(data.lyrics);
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      {spotifyAuthed ? (
        <>
          <button onClick={fetchCurrentTrack} className="bg-blue-500 text-white p-2 rounded mb-4">
            Fetch Current Track
          </button>
          <div>
            <p>Now Playing: {songTitle} by {artistName}</p>
          </div>
        </>
      ) : (
        <button onClick={handleSpotifyAuth} className="bg-green-500 text-white p-2 rounded">
          Connect to Spotify
        </button>
      )}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {lyrics && (
        <div className="whitespace-pre-wrap mt-4">
          <h2 className="text-xl font-semibold mb-2">Lyrics:</h2>
          <p>{lyrics}</p>
        </div>
      )}
    </main>
  );
}
