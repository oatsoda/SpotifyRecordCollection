import { SpotifyAlbumObject } from "./spotifyApiTypes";


export function RecordCollectionAlbum(props: { album: SpotifyAlbumObject; }) {
  const width = 256;
  const album = props.album;
  const image = album.images.filter(i => i.width >= 256).sort((i1, i2) => i1.width > i2.width ? 0 : -1)[0];
  return (
    <div className="alb" style={{width: width, height: width}}>      
      <img src={image.url} width={width} alt={album.name} />
      <a href={album.external_urls.spotify} rel="noreferrer" target="_blank" className="hov">{album.name}</a>
    </div>
  );
}
