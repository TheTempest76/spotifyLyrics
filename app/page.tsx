export default function Home(){
  return (
    <div>
      
           <div className="min-h-screen flex flex-col justify-center items-center">
      
      <div className="flex  justify-center ">
        <a href="/lyrics" className="mr-4">
          <button className="px-6 py-3 bg-blue-700 hover:bg-blue-800 rounded-full text-white text-lg">Search</button>
        </a>
        <a href="/spotify-sync">
          <button className="px-6 py-3 bg-green-700 hover:bg-green-800 rounded-full text-white text-lg">Spotify Sync</button>
        </a>
      </div>
    </div>
    </div>
   
  );
}