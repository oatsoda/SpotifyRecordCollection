import React from "react";
import { ArtistCollection } from "./recordCollectionTypes";


export function RecordCollectionArtistBadge(props: { artist: ArtistCollection; }) {
  const { artist } = props;
  return artist.albums.length > 1
    ? (<span className="badge badge-primary badge-pill">{artist.albums.length}</span>)
    : (<></>);
}
