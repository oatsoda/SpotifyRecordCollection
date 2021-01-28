import cryptoRandomString from 'crypto-random-string';
import { useCallback, useEffect, useState } from 'react';
import Axios, { AxiosRequestConfig } from 'axios';
import { processResponseAxios } from '../api/apiHelpers';
import { useHistory } from 'react-router';

const codeVerifierLength = 128;
const spotifyClientId = "078e53defda343c19205d805139575e0";
const callbackRedirect = "http://localhost:3000/";
const scopes = "user-library-read";
const exchangeCodeUrl = "https://accounts.spotify.com/api/token";

export function SpotifyAuth(params: { onSuccessfulAuth: (token: SpotifyAuthDetails) => void }) {

  const history = useHistory();

  const { onSuccessfulAuth } = params;
  const urlParams = new URLSearchParams(window.parent.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const error = urlParams.get('error');

  let [accessDetails, setAccessDetails] = useState<SpotifyAuthDetails>();
  let [errorDetails, setErrorDetails] = useState<PostExchangeError>();

  async function postExchangeCode(url: string, code: string, codeVerifier: string) {

    const params = new URLSearchParams();
    params.append("client_id", spotifyClientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", callbackRedirect);
    params.append("code_verifier", codeVerifier);
    
    const config : AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      validateStatus: _ => true    
    }
  
    await Axios.post<SpotifyAuthDetails>(url, params, config)
      .then(processResponseAxios)
      .then(result => {
        console.log(result);
        setAccessDetails(result.data);
        onSuccessfulAuth(result.data);
        history.push('/');
      })
      .catch(err => {
        // Do somthing
        console.log (err);
        if (err.status === 400) {
          setErrorDetails(err.data);
        }
      });
  }

  useEffect(() => {

    if (accessDetails || errorDetails)
      return;

    if (code != null) {

      const sourceState = localStorage.getItem("authState");
      if (state !== sourceState) {
        // TODO: error
        console.log(`Stored state: ${sourceState}`);
        console.log(`Returned state: ${state}`);
        return;
      }

      // Post exchange of code for Access Token
      const codeVerifier = localStorage.getItem("authCodeVerifier")!;
      console.log(`Local Code Verifier: ${codeVerifier}`);
      postExchangeCode(exchangeCodeUrl, code, codeVerifier);
    }
  });

  const onStartAuthenticate = useCallback(async () => {

    const codeVerifier = cryptoRandomString({length: codeVerifierLength});
    console.log(`New Code Verifier: ${codeVerifier}`);
    localStorage.setItem("authCodeVerifier", codeVerifier);
    const codeChallenge = await pkce_challenge_from_verifier(codeVerifier);
    console.log(`Code Challenge: ${codeChallenge}`);
    const sourceState = cryptoRandomString({length: 14, type: 'base64'});
    localStorage.setItem("authState", sourceState);

    const startAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${spotifyClientId}&redirect_uri=${encodeURIComponent(callbackRedirect)}&state=${sourceState}&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=${scopes}`;

    // Redirect browser to Permissions screen
    window.location.href = startAuthUrl;

  }, []);

  return (    
    <div>     
      { accessDetails &&
        <div>
          <p>{accessDetails.access_token}</p>
          <p>{accessDetails.expires_in}</p>
          <p>{accessDetails.refresh_token}</p>
          <p>{accessDetails.scope}</p>
          <p>{accessDetails.token_type}</p>
        </div>
      }
      { !accessDetails &&
        <p><button onClick={onStartAuthenticate}>Authenticate</button></p>
      }

      <p>State: {state}</p>
      <p>Code: {code}</p>
      <p>Error: {error}</p>
 
      { errorDetails &&
      <div>
        <p>Exchange error: {errorDetails.error}</p>
        <p>Exchange error_description: {errorDetails.error_description}</p>
      </div>
      }
    </div>
  )
}


export type SpotifyAuthDetails = {
  access_token: string,
  token_type: string,
  scope: string,
  expires_in: number,
  refresh_token: string,
}

type PostExchangeError = {  
  error: string,
  error_description: string,
}



function sha256_2(plain: string) { 
  // returns promise ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(a: ArrayBuffer) {
  // Convert the ArrayBuffer to string using Uint8 array.
  // btoa takes chars from 0-255 and base64 encodes.
  // Then convert the base64 encoded to base64url encoded.
  // (replace + with -, replace / with _, trim trailing =)
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(a))))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function pkce_challenge_from_verifier(v: string) : Promise<string> {
  const hashed = await sha256_2(v);
  const base64encoded = base64urlencode(hashed);
  return base64encoded;
}