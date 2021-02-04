import { useEffect, useState } from "react";
import { SpotifyAlbumObject } from "../api/spotifyApiTypes";


export function RecordCollectionAlbum(props: { album: SpotifyAlbumObject, hasBeenOpened: boolean }) {

  const normalWidth = 256;
  const smallWidth = 128;  
  const calcWidth = () => window.innerWidth < (4 * normalWidth) ? smallWidth : normalWidth;

  const { album, hasBeenOpened } = props;

  const [width, setWidth] = useState(calcWidth());

  useEffect(() => {
    function handleResize() {
      setWidth(calcWidth());
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    };
  }, []);

  function getImageUrl() {
    const image = album.images.filter(i => i.width >= 256).sort((i1, i2) => i1.width > i2.width ? 0 : -1)[0];
    return hasBeenOpened ? image.url : "/img/Spotify_Icon_RGB_Green.png";
  }

  return (
    <div className="alb mr-3 mb-3" style={ { width: width, height: width } }>      
      <img src={getImageUrl()} width="100%" alt={album.name} />
      <a href={album.external_urls.spotify} rel="noreferrer" target="_blank" className="hov">{album.name}</a>
    </div>
  );
}
