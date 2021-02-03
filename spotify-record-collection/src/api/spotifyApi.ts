
import Axios from 'axios'
import { GetAlbumsResponse, SpotifyUserObject } from "./spotifyApiTypes";
import { ProcessedResponse, processResponseAxios } from "./apiHelpers";
import { SpotifyContextData } from './SpotifyContext';

export async function getUserSavedAlbums(url: string | null, contextData: SpotifyContextData, onSuccess: (response: GetAlbumsResponse) => void, onNonAuthError: (response: ProcessedResponse) => void) {

  if (!url)
    url = "https://api.spotify.com/v1/me/albums?offset=0&limit=50";

  return await Axios.get<GetAlbumsResponse>(url, {
    headers: { 'Authorization': `Bearer ${contextData.authDetails?.access_token}` },
    validateStatus: _ => true
  })
  .then(processResponseAxios)
  .then(async (result) => {
    console.log(result);
    onSuccess(result.data);
  })
  .catch(err => {
    console.log(err);
    if (err.status === 401) {
      // TODO: Try to get new access token with refresh_token
      contextData.authDetailsUpdated(undefined);
    } else {
      onNonAuthError(err);
    }
  });
}

export async function getUser(contextData: SpotifyContextData, onSuccess: (response: SpotifyUserObject) => void, onNonAuthError: (response: ProcessedResponse) => void) {
  return await Axios.get<SpotifyUserObject>("https://api.spotify.com/v1/me/", {
    headers: { 'Authorization': `Bearer ${contextData.authDetails?.access_token}` },
    validateStatus: _ => true
  })
  .then(processResponseAxios)
  .then(async (result) => {
    console.log(result);
    onSuccess(result.data);
  })
  .catch(err => {
    console.log(err);
    if (err.status === 401) {
      // TODO: Try to get new access token with refresh_token
      contextData.authDetailsUpdated(undefined);
    } else {
      onNonAuthError(err);
    }
  });
}