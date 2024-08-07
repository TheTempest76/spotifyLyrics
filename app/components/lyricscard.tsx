import { formatText } from "../lib/spotify"


interface lyricsProps {
    lyrics : string
}

export default function Lyrics ( lyrics : lyricsProps) {

    return (
            <div className="flex flex-col font-semibold min-h-screen items-center justify-center text-2xl">
                <div className=" bg-gray-600 p-4 overflow-auto">
                <pre className="whitespace-pre-wrap break-words" >{formatText(lyrics.lyrics)}</pre>

                </div>
               
            </div>
    )
}