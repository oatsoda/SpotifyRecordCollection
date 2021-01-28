import { useEffect, useState } from "react";
import Axios from 'axios'
import { processResponseAxios } from '../api/apiHelpers';

export function SpotifyAlbums(params: { token: string }) {

    const { token } = params;

    let [albums, setAlbums] = useState<GetAlbumsResponse>();

    useEffect(() => {
      async function getAlbums() {
  
        await Axios.get<GetAlbumsResponse>("https://api.spotify.com/v1/me/albums?offset=0&limit=50", {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(processResponseAxios)
        .then(result => {
          console.log(result);
          setAlbums(result.data);
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


    return (
      <div>
        <h2>Albums</h2>        
        { albums &&
          <>
            <p>{albums.offset + 1} to {albums.limit} of {albums.total}</p>
            { albums.items.map(i => (<img key={i.album.id} src={i.album.images[0].url} alt={i.album.name} />)) }
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
  name: string,
  images: SpotifyImageObject[],
  artists: SpotifyArtistObject[]
}

type SpotifyArtistObject = {
  name: string,
  id: string
}

type SpotifyImageObject = {
  url: string,
  height: number,
  widgth: number
}