import { formatText } from "../lib/spotify"


interface lyricsProps {
    lyrics : string
}

export default function Lyrics ( lyrics : lyricsProps) {

    return (
            <div className="flex flex-col font-semibold min-h-screen items-center justify-center text-1xl md:text-xl">
                <div className=" bg-gray-600 p-4 overflow-auto w-2/3">
                <pre className="whitespace-pre-wrap break-words" >{formatText(lyrics.lyrics)}</pre>

                </div>
               
            </div>
    )
}