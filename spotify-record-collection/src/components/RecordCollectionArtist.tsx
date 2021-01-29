import React from "react";
import { Button, Card, CardBody, CardHeader, UncontrolledCollapse } from "reactstrap";
import { ArtistCollection } from "./recordCollectionTypes";
import { RecordCollectionArtistBadge } from "./RecordCollectionArtistBadge";
import { RecordCollectionAlbum } from "./RecordCollectionAlbum";


export function RecordCollectionArtist(props: { artist: ArtistCollection; }) {
  const { artist } = props;


  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center position-relative">
        <Button color="link" id={`tog${artist.id}`} className="stretched-link">{artist.name}</Button>
        <RecordCollectionArtistBadge artist={artist} />
      </CardHeader>
      <UncontrolledCollapse toggler={`#tog${artist.id}`}>
        <CardBody>
          <RecordCollectionArtistAlbums artist={artist} />  
        </CardBody>
      </UncontrolledCollapse>
    </Card>
  );
}

function RecordCollectionArtistAlbums(props: { artist: ArtistCollection; }){
  const albums = props.artist.albums.sort((a1, a2) => a1.release_date > a2.release_date ? 0 : -1);
  
  return (
    <>
      {albums.map(a => (<RecordCollectionAlbum album={a} key={a.id} />))}
    </>
  );
}


