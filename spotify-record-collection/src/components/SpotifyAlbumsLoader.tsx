import { useContext, useEffect, useState } from "react";
import Axios from 'axios'
import { SpotifyContext } from "../api/SpotifyContext";
import { processResponseAxios } from "../api/apiHelpers";
import { Loader } from "./Loader";
import { GetAlbumsResponse, SpotifyAlbumObject } from "./spotifyApiTypes";
import { ArtistCollection, ByArtistCollection, RecordCollection } from "./recordCollectionTypes";

export function SpotifyAlbumsLoader(props: { onLoadCompleted: (recordCollection: RecordCollection) => void }) {
  
  const contextData = useContext(SpotifyContext);

  const { onLoadCompleted } = props;

  const [errorMessage, setErrorMessage] = useState<string>();
  const [progress, setProgress] = useState<LoadProgress>({ total: 0, current: 0, percentage: 0 });


  useEffect(() => {
    async function getAlbums(url: string, loadedAlbums: SpotifyAlbumObject[]) {

      await Axios.get<GetAlbumsResponse>(url, {
        headers: { 'Authorization': `Bearer ${contextData.authDetails?.access_token}` },
        validateStatus: _ => true
      })
      .then(processResponseAxios)
      .then(async (result) => {
        console.log(result);
        loadedAlbums.push(...result.data.items.map(i => i.album))
        setProgress(parseProgress(result.data));
        if (result.data.next)
        {
          await getAlbums(result.data.next, loadedAlbums); // recurse
          return;
        }
        
        onLoadCompleted(parseRecordCollection(loadedAlbums));
      })
      .catch(err => {
        console.log(err);
        if (err.status === 401) {
          // TODO: Try to get new access token with refresh_token
          contextData.authDetailsUpdated(undefined);
        } else {
          setErrorMessage(err.data)
        }
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

    getAlbums("https://api.spotify.com/v1/me/albums?offset=0&limit=50", []);
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
