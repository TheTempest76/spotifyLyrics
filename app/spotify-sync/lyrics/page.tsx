'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Lyrics from '../../cumponents/lyricscard'

const LyricsPage = () => {
  const searchParams = useSearchParams();
  const songTitle = searchParams.get('songTitle');
  const artistName = searchParams.get('artistName');

  const [lyrics, setLyrics] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (songTitle && artistName) {
      const fetchLyrics = async () => {
        try {
          const response = await fetch(`/api/getLyrics?songTitle=${encodeURIComponent(songTitle)}&artistName=${encodeURIComponent(artistName)}`);
          if (!response.ok) {
            throw new Error('Failed to fetch lyrics');
          }
          const data = await response.json();
          setLyrics(data.lyrics);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('An unknown error occurred');
          }
        }
      };

      fetchLyrics();
    }
  }, [songTitle, artistName]);

  if (!songTitle || !artistName) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className='flex justify-center text-3xl font-extrabold'>currently listening to {songTitle} by {artistName}</h1>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <Lyrics lyrics={lyrics} />
      )}
    </div>
  );
};

const LyricsPageWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LyricsPage />
  </Suspense>
);

export default LyricsPageWithSuspense;
