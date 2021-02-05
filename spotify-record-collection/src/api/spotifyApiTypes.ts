/* Objects */

export type SpotifyAlbumObject = {
  album_type: "album" | "single" | "compilation",
  id: string,
  href: string,
  uri: string,
  external_urls: SpotifyExternalUrlsObject,
  name: string,
  release_date: Date,
  images: SpotifyImageObject[],
  artists: SpotifyAlbumArtistObject[],

  release_date_precision: string,
  popularity: number,
  label: string,
  tracks: PagingObject<SpotifyTrackObject>
}

export type SpotifyAlbumArtistObject = {
  name: string,
  id: string,
  href: string,
  uri: string,
  external_urls: SpotifyExternalUrlsObject
}

export type SpotifyImageObject = {
  url: string,
  height: number,
  width: number
}

export type SpotifyExternalUrlsObject = {
  spotify: string
}

export type SpotifyUserObject = {
  display_name: string,
  external_urls: SpotifyExternalUrlsObject,
  followers: SpotifyFollowersObject
}

export type SpotifyArtistObject = SpotifyAlbumArtistObject & {
  followers: SpotifyFollowersObject,
  genres: string[],
  images: SpotifyImageObject[],
  popularity: number
}

export type SpotifyFollowersObject = {
  total: number
}

export type SpotifyTrackObject = {
  id: string,
  href: string,
  external_urls: SpotifyExternalUrlsObject,
  name: string,
  duration_ms: number,
  disc_number: number,
  track_number: string,
  uri: string
}

/* Responses */

export type PagingObject<T> = {
  limit : number,
  next : string,
  offset : number,
  previous : string,
  total : number
  items: T[]
}

export type GetAlbumsResponse = PagingObject<SavedAlbumObject>;

export type SavedAlbumObject = {
  album : SpotifyAlbumObject
}