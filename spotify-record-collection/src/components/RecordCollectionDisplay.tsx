import React, { useCallback, useState } from "react";
import { UncontrolledCollapse } from "reactstrap";
import { ArtistCollection, ByArtistCollection, RecordCollection } from "./recordCollectionTypes";
import { RecordCollectionLoader } from "./RecordCollectionLoader";

export function RecordCollectionDisplay() {

  let [recordCollection, setRecordCollection] = useState<RecordCollection>();

  const handleLoadCompleted = useCallback((loadedCollection: RecordCollection) => {
    setRecordCollection(loadedCollection);
  }, []);

  function renderArtists(byArtist: ByArtistCollection) {     
    return Array.from(byArtist.keys()).sort((a1, a2) => a1.toLowerCase() > a2.toLowerCase() ? 0 : -1).map(a => {
      const artist = byArtist.get(a)!;
      return (
        <div className="card" key={artist.id}>
          <div className="card-header d-flex justify-content-between align-items-center">
            
              <button className="btn btn-link stretched-link" type="button" id={`tog${artist.id}`}>
                { artist.name }
              </button>
              <span className="badge badge-primary badge-pill">{ artist.albums.length }</span>
            
          </div>
          <UncontrolledCollapse toggler={`#tog${artist.id}`}>
            <div className="card-body">
              { renderArtistAlbums(artist) }
            </div>
          </UncontrolledCollapse>
        </div>
      );
    });
  }

  function renderArtistAlbums(artist: ArtistCollection) {
    return (<ul>
      { artist.albums.sort((a1, a2) => a1.release_date > a2.release_date ? 0 : -1).map(a => (<li key={a.id}>{a.name} <a href={a.external_urls.spotify} target="_blank" rel="noreferrer">^</a></li>)) }
    </ul>);
  }

  return (
    <div>
      <h2>Albums</h2>
      { !recordCollection && 
        <RecordCollectionLoader onLoadCompleted={handleLoadCompleted} />
      }
      { recordCollection &&
        <>
          <p>Total Albums: {recordCollection.allAlbums.length} | Total Artists: {recordCollection.byArtist.size}</p>
          <div className="accordion" id="accordionExample">
          { renderArtists(recordCollection.byArtist) }
          </div>
        </>
      }
    </div>   
  );
}