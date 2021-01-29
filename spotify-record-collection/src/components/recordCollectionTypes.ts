import { SpotifyAlbumObject, SpotifyArtistObject } from "./spotifyApiTypes";

export type RecordCollection = {
  allAlbums: SpotifyAlbumObject[],
  byArtist: ByArtistCollection
}

export type ArtistCollection = SpotifyArtistObject & {
  albums: SpotifyAlbumObject[]
}

export type ByArtistCollection = Map<string, ArtistCollection>;