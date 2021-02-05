import { Table } from "reactstrap";
import { SpotifyAlbumObject } from "../api/spotifyApiTypes";

export function RecordCollectionAlbumDetails(props: { album: SpotifyAlbumObject, onClose: () => void }) {
  const { album, onClose } = props;

  return (
    <div className="px-2 py-1 bg-transparent-dark h-100">
      <button type="button" className="close m-1 ml-3" aria-label="Close" onClick={onClose}>
          <span aria-hidden="true">&times;</span>
      </button>
      <h5><a href={album.external_urls.spotify} rel="noreferrer" target="_blank" className="hov">{album.name}</a></h5>
      <p className="text-muted">{album.release_date} on {album.label}</p>
      <Table className="text-spotify border-darker">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" className="w-75">Track</th>
            <th scope="col" className="w-25">Duration</th>
          </tr>
        </thead>
        <tbody>
          { album.tracks.items.map(t => (
            <tr>
              <th scope="row">{t.track_number}</th>
              <td><a href={t.uri} rel="noreferrer" target="_blank" className="hov">{t.name}</a></td>
              <td>{t.duration_ms / 1000}s</td>
            </tr>)
            )}
        </tbody>
      </Table>
    </div>
  );
}