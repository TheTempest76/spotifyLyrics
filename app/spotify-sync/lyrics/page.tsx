'use client'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const LyricsPage = () => {
  const searchParams = useSearchParams();
  const songTitle = searchParams.get('songTitle');
  const artistName = searchParams.get('artistName');

  const [lyrics, setLyrics] = useState('');
  const [error, setError] = useState(null);
  
  const formatText = (text: string): string => {
    // Define the sections to format
    const sections = [
      'Instrumental Break', 'Verse', 'Pre-Chorus', 'Chorus', 'Post-Chorus', 'Interlude', 'Bridge', 'Outro'
    ];

    // Create a regex pattern that matches any of the sections
    const sectionPattern = new RegExp(`\\[(${sections.join('|')}):`, 'g');

    // Replace the sections with formatted versions
    const formattedText = text
      .replace(sectionPattern, '\n\n[$1:')
      .replace(/([a-zA-Z0-9])\(/g, '$1 (') // Add space before parentheses
      .replace(/\)\(/g, ') (') // Add space between parentheses
      .replace(/(\w)([A-Z])/g, '$1\n$2'); // Add new line between words in CamelCase

    return formattedText.trim();
  };

  useEffect(() => {
    if (songTitle && artistName) {
      const fetchLyrics = async () => {
        try {
          
            const response = await fetch(`/api/getLyrics?songTitle=${encodeURIComponent(songTitle)}&artistName=${encodeURIComponent(artistName)}`);
            console.log(response)
            if (!response.ok) {
            throw new Error('Failed to fetch lyrics');
          }
          const data = await response.json();
          console.log(data.lyrics)
          setLyrics(data.lyrics);
        } catch (error) {
          setError(error.message);
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
      <h1>Lyrics for {songTitle} by {artistName}</h1>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <pre>{formatText(lyrics)}</pre>
      )}
    </div>
  );
};

export default LyricsPage;
