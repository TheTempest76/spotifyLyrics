'use client'
import { useState } from "react";

export default function Lyrics() {
    const [songTitle, setSongTitle] = useState('');
    const [artistName, setArtistName] = useState('');
    const [lyrics, setLyrics] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
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
      } catch (error) {
        console.error('Error fetching lyrics:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    const formatText = (text) => {
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
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Lyrics Fetcher</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            placeholder="Song Title"
            className="border p-2 mr-2"
            required
          />
          <input
            type="text"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            placeholder="Artist Name"
            className="border p-2 mr-2"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Fetch Lyrics
          </button>
        </form>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {lyrics && (
          <div className="whitespace-pre-wrap">
            <h2 className="text-xl font-semibold mb-2">Lyrics:</h2>
            <p>{formatText(lyrics)}</p>
          </div>
        )}
      </main>
    );
  }