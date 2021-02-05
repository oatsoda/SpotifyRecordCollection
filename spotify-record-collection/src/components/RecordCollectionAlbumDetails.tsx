import { Table } from "reactstrap";
import { SpotifyAlbumObject } from "../api/spotifyApiTypes";

export function RecordCollectionAlbumDetails(props: { album: SpotifyAlbumObject, useAppLinks: boolean, onClose: () => void }) {
  const { album, useAppLinks, onClose } = props;

  function getDurationDisplay(duration_ms: number) {
    const secs = Math.floor((duration_ms / 1000) % 60);
    const mins = Math.floor((duration_ms / (1000 * 60)) % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  }

  return (
    <div className="px-2 py-1 bg-transparent-dark h-100">
      <button type="button" className="close m-1 ml-3" aria-label="Close" onClick={onClose}>
          <span aria-hidden="true">&times;</span>
      </button>
      <h5><a href={useAppLinks ? album.uri : album.external_urls.spotify} rel="noreferrer" target="_blank" className="hov">{album.name}</a></h5>
      <p className="text-muted">{album.release_date} on {album.label}</p>
      <Table className="text-spotify border-darker">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" className="col-10">Track</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          { album.tracks.items.map(t => (
            <tr>
              <th scope="row">{t.track_number}</th>
              <td><a href={useAppLinks ? album.uri : t.uri} rel="noreferrer" target="_blank" className="hov">{t.name}</a></td>
              <td>{getDurationDisplay(t.duration_ms)}</td>
            </tr>)
            )}
        </tbody>
      </Table>
    </div>
  );
}
