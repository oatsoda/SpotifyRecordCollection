import React, { useCallback, useContext, useState } from "react";
import { Button, Card, CardBody, CardHeader, UncontrolledCollapse } from "reactstrap";
import { ArtistCollection } from "./recordCollectionTypes";
import { RecordCollectionArtistBadge } from "./RecordCollectionArtistBadge";
import { RecordCollectionAlbum } from "./RecordCollectionAlbum";
import { SpotifyAlbumObject, SpotifyArtistObject, SpotifyImageObject } from "../api/spotifyApiTypes";
import { getArtist } from "../api/spotifyApi";
import { SpotifyContext } from "../api/SpotifyContext";

export function RecordCollectionArtist(props: { artist: ArtistCollection; }) {

  const contextData = useContext(SpotifyContext);

  const { artist } = props;
  const [fullArtist, setFullArtist] = useState<SpotifyArtistObject>();
  
  const onExpand = useCallback(async () => {
    if (!fullArtist)
      await getArtist(artist.href, contextData, (result) => { setFullArtist(result) }, (err) => {})

  }, [artist.href, contextData, fullArtist]);

  function getBackgroundImage(images: SpotifyImageObject[] | undefined) : React.CSSProperties {
    if (!images)
      return {};

    if (images.length === 0)
      return { 
        backgroundImage: "url('./img/Spotify_Icon_RGB_Green.png')",  
        backgroundPosition: "top left",
        backgroundAttachment: "local",
        backgroundSize: "128px 128px",
        opacity: 0.02
       };

    const url = images.sort((i1, i2) => i1.width > i2.width ? -1 : 0)[0].url;
    return { 
      backgroundImage: `url('${url}')`,  
      backgroundPosition: "top 20% right",
      backgroundRepeat: "no-repeat",
      backgroundSize: "100% auto",
      opacity: 0.1
     };
  }

  return (
    <Card className="bg-transparent border-darker">
      <CardHeader className="d-flex justify-content-between align-items-center position-relative">        
        <Button color="link" id={`tog${artist.id}`} className="stretched-link">{artist.name}</Button>
        <RecordCollectionArtistBadge artist={artist} />
      </CardHeader>
      <UncontrolledCollapse toggler={`#tog${artist.id}`} onEntered={onExpand}>
        <CardBody className="pr-0 pb-0">
          <div className="d-flex flex-row flex-wrap">
            <RecordCollectionArtistAlbums albums={artist.albums} />  
          </div>
          <div className="bg" style={getBackgroundImage(fullArtist?.images)}></div>
        </CardBody>
      </UncontrolledCollapse>
    </Card>
  );
}

function RecordCollectionArtistAlbums(props: { albums: SpotifyAlbumObject[]; }){
  const sorted = props.albums.sort((a1, a2) => a1.release_date > a2.release_date ? 0 : -1);
  
  return (
    <>
      {sorted.map(a => (<RecordCollectionAlbum album={a} key={a.id} />))}
    </>
  );
}