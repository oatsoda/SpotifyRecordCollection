import React, { useState } from 'react';
import './App.css';
import { SpotifyAuth } from './components/SpotifyAuth';

function App() {

  let [token, setToken] = useState("");

  return (
    <div className="App">
      {token ? (
          <p>You are authorized with token: {token}</p>
      ) : (
        <SpotifyAuth />
      )}
    </div>
  );
}

export default App;
