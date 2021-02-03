import { ArtistCollection } from "./recordCollectionTypes";

export function RecordCollectionArtistBadge(props: { artist: ArtistCollection; }) {
  const { artist } = props;
  const colour = artist.albums.length > 1 ? "bg-spotify" : "text-spotify";
  return (<span className={`badge ${colour} badge-pill`}>{artist.albums.length}</span>);
}
