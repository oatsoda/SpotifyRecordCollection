import React, { useState } from 'react';
import './App.css';
import { SpotifyAuth } from './components/SpotifyAuth';
import { SpotifyAlbums } from './components/SpotifyAlbums';

function App() {

  let [token, setToken] = useState("");

  return (
    <div className="App">
      {token ? (
        <div>
          <p>You are authorized with token: {token}</p>
          <SpotifyAlbums token={token} />
        </div>
      ) : (
        <SpotifyAuth onTokenUpdated={setToken} />
      )}
    </div>
  );
}

export default App;
