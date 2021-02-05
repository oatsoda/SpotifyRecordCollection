import React, { useCallback, useState } from "react";
import { ByArtistCollection, RecordCollection } from "./recordCollectionTypes";
import { RecordCollectionLoader } from "./RecordCollectionLoader";
import { RecordCollectionArtist } from "./RecordCollectionArtist";
import { Container, FormGroup, Input, Label } from "reactstrap";

export function RecordCollectionDisplay() {

  let [recordCollection, setRecordCollection] = useState<RecordCollection>();
  let [useAppLinks, setUseAppLinks] = useState<boolean>(false);

  const handleLoadCompleted = useCallback((loadedCollection: RecordCollection) => {
    setRecordCollection(loadedCollection);
  }, []);

  const handleCheckboxChange = useCallback(() => {
    setUseAppLinks(prev => !prev);
  }, [])

  function renderArtists(byArtist: ByArtistCollection) {     
    return Array.from(byArtist.keys()).sort((a1, a2) => normaliseArtist(a1) > normaliseArtist(a2) ? 0 : -1).map(a => {
      const artist = byArtist.get(a)!;
      return (<RecordCollectionArtist artist={artist} key={artist.id} useAppLinks={useAppLinks} />);
    });
  }

  function normaliseArtist(artist: string) {
    const re = /^the\s/i;
    return artist.toLowerCase().replace(re, '');
  }

  return (
    <Container>
      { !recordCollection && 
        <RecordCollectionLoader onLoadCompleted={handleLoadCompleted} />
      }
      { recordCollection &&
        <>
          <p className="mb-1">Total Liked Albums: {recordCollection.allAlbums.length} <span className="text-muted">|</span> Liked Album Artists: {recordCollection.byArtist.size}</p>
          <FormGroup check className="mb-3 mt-0 ml-1 text-muted">
            <Label check>
              <Input type="checkbox" checked={useAppLinks} onChange={handleCheckboxChange} />{' '}
              Use Spotify App links
            </Label>
          </FormGroup>
     
          <div className="accordion coll">
          { renderArtists(recordCollection.byArtist) }
          </div>
        </>
      }
      </Container> 
  );
}


