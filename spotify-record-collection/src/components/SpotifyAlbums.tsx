import { useCallback, useState } from "react";
import { ArtistCollection, ByArtistCollection, RecordCollection } from "./recordCollectionTypes";
import { SpotifyAlbumsLoader } from "./SpotifyAlbumsLoader";

export function SpotifyAlbums() {

  let [recordCollection, setRecordCollection] = useState<RecordCollection>();

  const handleLoadCompleted = useCallback((loadedCollection: RecordCollection) => {
    setRecordCollection(loadedCollection);
  }, []);

  function renderArtists(byArtist: ByArtistCollection) {     
    return Array.from(byArtist.keys()).sort((a1, a2) => a1.toLowerCase() > a2.toLowerCase() ? 0 : -1).map(a => {
      const artist = byArtist.get(a)!;
      return (<li key={artist.id}>{a} <a href={artist.external_urls.spotify} target="_blank" rel="noreferrer">^</a>{ renderArtistAlbums(artist) }</li>)        
    });
  }

  function renderArtistAlbums(artist: ArtistCollection) {
    return (<ul>
      { artist.albums.sort((a1, a2) => a1.release_date > a2.release_date ? 0 : -1).map(a => (<li key={a.id}>{a.name} <a href={a.external_urls.spotify} target="_blank" rel="noreferrer">^</a></li>)) }
    </ul>);
  }

  return (
    <div>
      <h2>Albums</h2>
      { !recordCollection && 
        <SpotifyAlbumsLoader onLoadCompleted={handleLoadCompleted} />
      }
      { recordCollection &&
        <>
          <p>Total Albums: {recordCollection.allAlbums.length} | Total Artists: {recordCollection.byArtist.size}</p>
          <ul>
          { renderArtists(recordCollection.byArtist) }
          </ul>
        </>
      }
    </div>   
  );
}