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
      { !recordCollection && 
        <RecordCollectionLoader onLoadCompleted={handleLoadCompleted} />
      }
      { recordCollection &&
        <>
          <p>Total Liked Albums: {recordCollection.allAlbums.length} | Liked Album Artists: {recordCollection.byArtist.size}</p>
          <div className="accordion coll">
          { renderArtists(recordCollection.byArtist) }
          </div>
        </>
      }
      </Container> 
  );
}


