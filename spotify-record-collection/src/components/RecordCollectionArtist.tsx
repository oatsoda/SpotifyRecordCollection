import React, { useCallback, useContext, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from "reactstrap";
import { ArtistCollection } from "./recordCollectionTypes";
import { RecordCollectionArtistBadge } from "./RecordCollectionArtistBadge";
import { RecordCollectionAlbum } from "./RecordCollectionAlbum";
import { SpotifyAlbumObject, SpotifyArtistObject, SpotifyImageObject } from "../api/spotifyApiTypes";
import { getArtist } from "../api/spotifyApi";
import { SpotifyContext } from "../api/SpotifyContext";
import { RecordCollectionAlbumDetails } from "./RecordCollectionAlbumDetails";

export function RecordCollectionArtist(props: { artist: ArtistCollection, useAppLinks: boolean }) {

  const contextData = useContext(SpotifyContext);

  const { artist, useAppLinks } = props;

  const [fullArtist, setFullArtist] = useState<SpotifyArtistObject>();  
  const [openState, setOpenState] = useState({ isOpen: false, isFirstOpen: true });
  const [selectedAlbum, setSelectedAlbum] = useState<SpotifyAlbumObject>();  

  const toggle = () => setOpenState(prev => { return { isOpen: !prev.isOpen, isFirstOpen: false } });
  
  const handleExpanded = useCallback(async () => {
    if (!fullArtist)
      await getArtist(artist.href, contextData, (result) => { setFullArtist(result) }, _ => {})

  }, [artist.href, contextData, fullArtist]);
  
  const handleAlbumSelected = useCallback((a: SpotifyAlbumObject | undefined) => {
    setSelectedAlbum(a);
  }, []);

  const sortedAlbums = () => artist.albums.sort((a1, a2) => a1.release_date > a2.release_date ? 0 : -1);

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
      backgroundPosition: "top right",
      backgroundRepeat: "repeat-y",
      backgroundSize: "100% auto",
      opacity: 0.1
     };
  } 

  return (
    <Card className="bg-transparent border-darker">
      <CardHeader className="d-flex justify-content-between align-items-center position-relative">        
        <Button color="link" id={`tog${artist.id}`} onClick={toggle}>{artist.name}</Button>
        <RecordCollectionArtistBadge artist={artist} />
      </CardHeader>
      <Collapse toggler={`#tog${artist.id}`} onEntered={handleExpanded} isOpen={openState.isOpen}>
        <CardBody className={selectedAlbum ? "" : "pr-0 pb-0"}>
          <Row noGutters>
            <Col>
              <div className="d-flex flex-row flex-wrap">
                {sortedAlbums().map(a => (<RecordCollectionAlbum album={a} key={a.id} 
                                              hasBeenOpened={!openState.isFirstOpen}
                                              onAlbumSelected={handleAlbumSelected} />))}
              </div>
            </Col>
            { selectedAlbum  &&
              <Col sm={5}><RecordCollectionAlbumDetails album={selectedAlbum} useAppLinks={useAppLinks} onClose={() => handleAlbumSelected(undefined) }/></Col>
            }
          </Row>
          <div className="bg" style={getBackgroundImage(fullArtist?.images)}></div>
        </CardBody>
      </Collapse>
    </Card>
  );
}