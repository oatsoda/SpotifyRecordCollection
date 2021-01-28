import cryptoRandomString from 'crypto-random-string';
import { useCallback, useContext, useEffect, useState } from 'react';
import Axios, { AxiosRequestConfig } from 'axios';
import { ProcessedResponse, processResponseAxios } from '../api/apiHelpers';
import { useHistory } from 'react-router';
import { SpotifyContext } from '../api/SpotifyContext';
import { Alert } from 'reactstrap';

const codeVerifierLength = 128;
const spotifyClientId = "078e53defda343c19205d805139575e0";
const callbackRedirect = "http://localhost:3000/";
const scopes = "user-library-read";
const exchangeCodeUrl = "https://accounts.spotify.com/api/token";

export function SpotifyAuth() {

  const history = useHistory();
  const contextData = useContext(SpotifyContext);

  const [errorMessage, setErrorMessage] = useState<string>();

  const urlParams = new URLSearchParams(window.parent.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const error = urlParams.get('error');
  
  useEffect(() => {

    if (error != null) {
      setErrorMessage(error);
      return;
    }

    if (code == null)
      return;

    const sourceState = localStorage.getItem("authState");
    if (state !== sourceState) {
      setErrorMessage("Invalid state: The state returned from the OAuth request did not match the state value sent with the initial request.");        
      return;
    }

    function success(data: SpotifyAuthDetails) {
      contextData.authDetailsUpdated(data);
      history.push('/');
    }

    function failure(err: ProcessedResponse) {
      if (err.status === 400) {
        setErrorMessage(`${err.data.error}: ${err.data.error_description}`);
      }
    }

    // Post exchange of code for Access Token
    const codeVerifier = localStorage.getItem("authCodeVerifier")!;
    //console.log(`Local Code Verifier: ${codeVerifier}`);
    postExchangeCode(exchangeCodeUrl, code, codeVerifier, success, failure); 

  }, [code, state, error, setErrorMessage, contextData, history]);

  const onStartAuthenticate = useCallback(async () => {

    const codeVerifier = cryptoRandomString({length: codeVerifierLength});
    //console.log(`New Code Verifier: ${codeVerifier}`);
    localStorage.setItem("authCodeVerifier", codeVerifier);
    const codeChallenge = await pkce_challenge_from_verifier(codeVerifier);
    //console.log(`Code Challenge: ${codeChallenge}`);
    const sourceState = cryptoRandomString({length: 14, type: 'base64'});
    localStorage.setItem("authState", sourceState);

    const startAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${spotifyClientId}&redirect_uri=${encodeURIComponent(callbackRedirect)}&state=${sourceState}&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=${scopes}`;

    // Redirect browser to Permissions screen
    window.location.href = startAuthUrl;

  }, []);

  return (    
      <>
        { errorMessage && 
          <Alert>{errorMessage}</Alert>
        }
        { !errorMessage && !code &&          
          <p><button onClick={onStartAuthenticate}>Authenticate</button></p>
        }
      </>
  )
}


export type SpotifyAuthDetails = {
  access_token: string,
  token_type: string,
  scope: string,
  expires_in: number,
  refresh_token: string,
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


async function postExchangeCode(url: string, code: string, codeVerifier: string, onSuccess: (authDetails: SpotifyAuthDetails) => void, onFailure: (errorDetails: ProcessedResponse) => void) {

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
      onSuccess(result.data);
    })
    .catch(err => {
      console.log(err.data);
      onFailure(err)
    });
}