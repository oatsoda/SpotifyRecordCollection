import cryptoRandomString from 'crypto-random-string';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Axios, { AxiosRequestConfig } from 'axios';
import { ProcessedResponse, processResponseAxios } from '../api/apiHelpers';
import { useHistory } from 'react-router';
import { SpotifyContext } from '../api/SpotifyContext';
import { Alert, Button, Col, Container, Row } from 'reactstrap';

const codeVerifierLength = 128;
const spotifyClientId = "078e53defda343c19205d805139575e0";
const scopes = "user-library-read";
const exchangeCodeUrl = "https://accounts.spotify.com/api/token";

const authCodeVerifierStorageKey = "authCodeVerifier";
const authStateStorageKey = "authState";

const callbackRedirect = window.location.origin + '/';

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

    const sourceState = localStorage.getItem(authStateStorageKey);
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

    // Get code used in initial request
    const codeVerifier = localStorage.getItem(authCodeVerifierStorageKey)!;

    // Clear storage as we've used them now    
    localStorage.removeItem(authCodeVerifierStorageKey);
    localStorage.removeItem(authStateStorageKey);

    // Exchange code for Access Token
    postExchangeCode(exchangeCodeUrl, code, codeVerifier, success, failure); 

  }, [code, state, error, setErrorMessage, contextData, history]);

  const onStartAuthenticate = useCallback(async () => {

    const codeVerifier = cryptoRandomString({length: codeVerifierLength});
    localStorage.setItem(authCodeVerifierStorageKey, codeVerifier);
    const codeChallenge = await pkce_challenge_from_verifier(codeVerifier);
    const sourceState = cryptoRandomString({length: 14, type: 'base64'});
    localStorage.setItem(authStateStorageKey, sourceState);

    const startAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${spotifyClientId}&redirect_uri=${encodeURIComponent(callbackRedirect)}&state=${sourceState}&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=${scopes}`;

    // Redirect browser to Permissions screen
    window.location.href = startAuthUrl;

  }, []);

  return (    
      <Container>
        <Row className="justify-content-center">
          <Col md={6} className="border border-darker rounded text-center p-3">
            <p>You need to login to your Spotify account and give permission for us to read your Library.</p>
          { errorMessage && 
            <Alert color="danger">Failed to authenticate: {errorMessage}</Alert>
          }
          { !code &&          
            <Button className="bg-spotify border-0 p-2 px-3" onClick={onStartAuthenticate}><img className="logo float-left" src="/img/Spotify_Icon_RGB_Black.png" alt="Spotify Logo" /> Authenticate with Spotify</Button>
          }
          </Col>
        </Row>
      </Container>
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