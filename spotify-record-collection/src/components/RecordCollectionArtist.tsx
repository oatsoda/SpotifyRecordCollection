import React from "react";
import { Button, Card, CardHeader, UncontrolledCollapse } from "reactstrap";
import { ArtistCollection } from "./recordCollectionTypes";
import { RecordCollectionArtistBadge } from "./RecordCollectionArtistBadge";


export function RecordCollectionArtist(props: { artist: ArtistCollection; }) {
  const { artist } = props;

  function renderArtistAlbums(artist: ArtistCollection) {
    return (<ul>
      {artist.albums.sort((a1, a2) => a1.release_date > a2.release_date ? 0 : -1).map(a => (<li key={a.id}>{a.name} <a href={a.external_urls.spotify} target="_blank" rel="noreferrer">^</a></li>))}
    </ul>);
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <Button color="link" id={`tog${artist.id}`}>{artist.name}</Button>
        <RecordCollectionArtistBadge artist={artist} />
      </CardHeader>
      <UncontrolledCollapse toggler={`#tog${artist.id}`}>
        <div className="card-body">
          {renderArtistAlbums(artist)}
        </div>
      </UncontrolledCollapse>
    </Card>
  );
}
