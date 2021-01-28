import { useEffect, useState } from "react";
import Axios from 'axios'
import { processResponseAxios } from '../api/apiHelpers';

export function SpotifyAlbums(params: { token: string }) {

    const { token } = params;

    let [recordCollection, setRecordCollection] = useState<RecordCollection>();

    useEffect(() => {
      async function getAlbums() {
  
        // TODO: load all pages and show progress while doing so...
        await Axios.get<GetAlbumsResponse>("https://api.spotify.com/v1/me/albums?offset=0&limit=50", {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(processResponseAxios)
        .then(result => {
          console.log(result);
          setRecordCollection(parseResponse(result.data));
        })
        .catch(err => {
          // Do somthing
          console.log (err);
          if (err.status === 400) {
            //setErrorDetails(err.data);
          }
        });  
      }

      getAlbums();
    }, [token]);

    function renderArtists(byArtist: ByArtistCollection) {     
      return Array.from(byArtist.keys()).sort((a1, a2) => a1 > a2 ? 0 : -1).map(a => {
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
        { recordCollection &&
          <>
            <p>Total Albums: {recordCollection.allAlbums.length}</p>
            <p>Total Artists: {recordCollection.byArtist.size}</p>
            <ul>
            { renderArtists(recordCollection.byArtist) }
            </ul>
          </>
        }
      </div>
    );

}

type GetAlbumsResponse = {
  limit : number,
  next : string,
  offset : number,
  previous : string,
  total : number
  items: GetAlbumsResponseItem[]
}
type GetAlbumsResponseItem = {
  album : SpotifyAlbumObject
}

type SpotifyAlbumObject = {
  album_type: "album" | "single" | "compilation",
  id: string,
  href: string,
  external_urls: SpotifyExternalUrlsObject,
  name: string,
  release_date: Date,
  images: SpotifyImageObject[],
  artists: SpotifyArtistObject[]
}

type SpotifyArtistObject = {
  name: string,
  id: string,
  href: string,
  external_urls: SpotifyExternalUrlsObject
}

type SpotifyImageObject = {
  url: string,
  height: number,
  widgth: number
}

type SpotifyExternalUrlsObject = {
  spotify: string
}

type RecordCollection = {
  allAlbums: SpotifyAlbumObject[],
  byArtist: ByArtistCollection
}

type ArtistCollection = SpotifyArtistObject & {
  albums: SpotifyAlbumObject[]
}

type ByArtistCollection = Map<string, ArtistCollection>;

function parseResponse(response: GetAlbumsResponse) : RecordCollection {
  const allAlbums = response.items.map(i => i.album);
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