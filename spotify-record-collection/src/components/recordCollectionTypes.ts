import { SpotifyAlbumObject, SpotifyAlbumArtistObject } from "../api/spotifyApiTypes";

export type RecordCollection = {
  allAlbums: SpotifyAlbumObject[],
  byArtist: ByArtistCollection
}

export type ArtistCollection = SpotifyAlbumArtistObject & {
  albums: SpotifyAlbumObject[]
}

export type ByArtistCollection = Map<string, ArtistCollection>;