import { NextResponse } from 'next/server';
import { getCurrentlyPlaying } from '../../../lib/spotify';

export async function GET(request) {
  try {
    const track = await getCurrentlyPlaying();
    if (track) {
      return NextResponse.json(track);
    } else {
      return NextResponse.json({ error: 'No track currently playing' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error getting current track:', error);
    return NextResponse.json({ error: 'Failed to get current track' }, { status: 500 });
  }
}