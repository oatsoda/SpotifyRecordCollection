import { useContext, useEffect, useState } from "react";
import { SpotifyContext } from "../api/SpotifyContext";
import { getUserSavedAlbums } from "../api/spotifyApi";
import { Loader } from "./Loader";
import { GetAlbumsResponse, SpotifyAlbumObject } from "../api/spotifyApiTypes";
import { ArtistCollection, ByArtistCollection, RecordCollection } from "./recordCollectionTypes";

export function RecordCollectionLoader(props: { onLoadCompleted: (recordCollection: RecordCollection) => void }) {
  
  const contextData = useContext(SpotifyContext);

  const { onLoadCompleted } = props;

  const [errorMessage, setErrorMessage] = useState<string>();
  const [progress, setProgress] = useState<LoadProgress>({ total: 0, current: 0, percentage: 0 });

  useEffect(() => {
    async function getAlbums(url: string | null, loadedAlbums: SpotifyAlbumObject[]) {

      await getUserSavedAlbums(url, contextData, 
        async result => {
          loadedAlbums.push(...result.items.map(i => i.album))
          setProgress(parseProgress(result));
          if (result.next)
          {
            await getAlbums(result.next, loadedAlbums); // recurse
            return;
          }          
          onLoadCompleted(parseRecordCollection(loadedAlbums));
        }, 
        err =>{
          setErrorMessage(err.data);
        });
    }
    
    function parseRecordCollection(allAlbums: SpotifyAlbumObject[]) : RecordCollection {
      return {
        allAlbums: allAlbums,
        byArtist: parseArtists(allAlbums)
      }
    }
    
    function parseArtists(allAlbums: SpotifyAlbumObject[]) : ByArtistCollection {
      let artists = new Map<string, ArtistCollection>();
      allAlbums.forEach(album => {
        album.artists.forEach(artist => {
          if (!artists.has(artist.name)){
            artists.set(artist.name, { ...artist, albums: [] });
          }
          artists.get(artist.name)?.albums.push(album);      
        });    
      });
      return artists;
    }

    function parseProgress(response: GetAlbumsResponse) : LoadProgress {
      const current = response.offset + response.items.length;
      const perc = Math.round((current / response.total) * 100);
      return { current: current, total: response.total, percentage: perc };
    }

    getAlbums(null, []);
    return () => {}; // TODO: tidy up before unmount?    
  }, [contextData, contextData.authDetails?.access_token, onLoadCompleted]);

  return (
    <>
      { errorMessage && 
        <Loader isLoading={true} message={`Error: ${errorMessage}`} />
      }
      { !errorMessage && 
        <Loader isLoading={true} message={`Loaded ${progress.current} of ${progress.total} [${progress.percentage}%]`} />
      }
    </>
  );
}

type LoadProgress = {
  total: number,
  current: number,
  percentage: number
}
