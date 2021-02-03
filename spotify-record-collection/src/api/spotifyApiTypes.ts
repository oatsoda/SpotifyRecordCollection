/* Objects */

export type SpotifyAlbumObject = {
  album_type: "album" | "single" | "compilation",
  id: string,
  href: string,
  external_urls: SpotifyExternalUrlsObject,
  name: string,
  release_date: Date,
  images: SpotifyImageObject[],
  artists: SpotifyArtistObject[]
}

export type SpotifyArtistObject = {
  name: string,
  id: string,
  href: string,
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
  followers: {
    total: number
  }
}


/* Responses */

export type GetAlbumsResponse = {
  limit : number,
  next : string,
  offset : number,
  previous : string,
  total : number
  items: GetAlbumsResponseItem[]
}
export type GetAlbumsResponseItem = {
  album : SpotifyAlbumObject
}