'use client';
import React, { FormEvent, useState } from 'react';
import Lyricss from '../cumponents/lyricscard';
export default function Lyrics() {
  const [songTitle, setSongTitle] = useState<string>('');
  const [artistName, setArtistName] = useState<string>('');
  const [lyrics, setLyrics] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setLyrics('');
    try {
      const response = await fetch(`/api/getLyrics?songTitle=${encodeURIComponent(songTitle)}&artistName=${encodeURIComponent(artistName)}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Lyrics not found. Please check the song title and artist name.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received data:', data); // Log the received data
      if (data.error) {
        throw new Error(data.error);
      }
      if (!data.lyrics) {
        throw new Error('No lyrics received from the server.');
      }
      setLyrics(data.lyrics);
      console.log('Lyrics set:', data.lyrics.substring(0, 100)); // Log the first 100 characters of the lyrics
    } catch (error: unknown) {
      console.error('Error fetching lyrics:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <div className='flex justify-center'>
      <h1 className="text-3xl font-bold mb-4">Lyrics Fetcher</h1>
      </div>
      <div className='flex justify-center'>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          placeholder="Song Title"
          className="border p-2 mr-2 text-black"
          required
        />
        <input
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="Artist Name"
          className="border p-2 mr-2 text-black"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Fetch Lyrics
        </button>
      </form>
      </div>

      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {lyrics && (
        <div >
                  <Lyricss lyrics = {lyrics} />
        </div>
      )}
    </main>
  );
}
