import { ArtistCollection } from "./recordCollectionTypes";

export function RecordCollectionArtistBadge(props: { artist: ArtistCollection; }) {
  const { artist } = props;
  const colour = artist.albums.length > 1 ? "primary" : "muted";
  return (<span className={`badge badge-${colour} badge-pill`}>{artist.albums.length}</span>);
}
