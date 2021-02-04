import { useCallback, useEffect, useState } from "react";
import { SpotifyAlbumObject } from "../api/spotifyApiTypes";


export function RecordCollectionAlbum(props: { album: SpotifyAlbumObject, hasBeenOpened: boolean, onAlbumSelected: (album: SpotifyAlbumObject) => void }) {

  const normalWidth = 256;
  const smallWidth = 128;  

  const { album, hasBeenOpened, onAlbumSelected } = props;

  const calcWidth = () => window.innerWidth < (4 * normalWidth) ? smallWidth : normalWidth;

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
    const image = album.images.filter(i => i.width >= normalWidth).sort((i1, i2) => i1.width > i2.width ? 0 : -1)[0];
    return hasBeenOpened ? image.url : "/img/Spotify_Icon_RGB_Green.png";
  }

  const handleClick = useCallback(() => {
    onAlbumSelected(album)    
  }, [album, onAlbumSelected]);

  return (
    <div className="alb mr-3 mb-3" style={ { width: width, height: width } }>      
      <img src={getImageUrl()} width="100%" alt={album.name} />
      <button onClick={handleClick} className="hov">{album.name}</button>
    </div>
  );
}
