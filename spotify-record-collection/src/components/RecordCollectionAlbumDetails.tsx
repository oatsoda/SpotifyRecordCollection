import { Table } from "reactstrap";
import { SpotifyAlbumObject } from "../api/spotifyApiTypes";

export function RecordCollectionAlbumDetails(props: { album: SpotifyAlbumObject; }) {
  const { album } = props;

  return (
    <div className="px-2 py-1 bg-transparent-dark h-100">
      <h5><a href={album.external_urls.spotify} rel="noreferrer" target="_blank" className="hov">{album.name}</a></h5>
      <p className="text-muted">{album.release_date} on {album.label}</p>
      <Table className="text-spotify border-darker">
        <thead>
          <tr>
            <th>#</th>
            <th>Track</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          { album.tracks.items.map(t => (
            <tr>
              <th scope="row">{t.track_number}</th>
              <td>{t.name}</td>
              <td>{t.duration_ms / 1000}s</td>
            </tr>)
            )}
          <tr>
            
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
