import React, { useCallback, useState } from "react";
import { ByArtistCollection, RecordCollection } from "./recordCollectionTypes";
import { RecordCollectionLoader } from "./RecordCollectionLoader";
import { RecordCollectionArtist } from "./RecordCollectionArtist";
import { Container } from "reactstrap";

export function RecordCollectionDisplay() {

  let [recordCollection, setRecordCollection] = useState<RecordCollection>();

  const handleLoadCompleted = useCallback((loadedCollection: RecordCollection) => {
    setRecordCollection(loadedCollection);
  }, []);

  function renderArtists(byArtist: ByArtistCollection) {     
    return Array.from(byArtist.keys()).sort((a1, a2) => normaliseArtist(a1) > normaliseArtist(a2) ? 0 : -1).map(a => {
      const artist = byArtist.get(a)!;
      return (<RecordCollectionArtist artist={artist}  key={artist.id} />);
    });
  }

  function normaliseArtist(artist: string) {
    const re = /^the\s/i;
    return artist.toLowerCase().replace(re, '');
  }

  return (
    <Container>
      <h2>Albums</h2>
      { !recordCollection && 
        <RecordCollectionLoader onLoadCompleted={handleLoadCompleted} />
      }
      { recordCollection &&
        <>
          <p>Total Items: {recordCollection.allAlbums.length} | Total Artists: {recordCollection.byArtist.size}</p>
          <div className="accordion" id="accordionExample">
          { renderArtists(recordCollection.byArtist) }
          </div>
        </>
      }
      </Container> 
  );
}


