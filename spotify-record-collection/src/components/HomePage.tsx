import { useCallback, useState } from 'react';
import { SpotifyAuth, SpotifyAuthDetails } from './SpotifyAuth';
import { SpotifyAlbums } from './SpotifyAlbums';

export function HomePage() {

  let [authDetails, setAuthDetails] = useState<SpotifyAuthDetails>();

  const handleSuccessfulAuth = useCallback((details: SpotifyAuthDetails) => {
    setAuthDetails(details);
  }, [])

  return (<>
    { authDetails &&
      <div>
        <SpotifyAlbums authDetails={authDetails!} />
      </div>
    }
    { !authDetails &&
      <SpotifyAuth onSuccessfulAuth={handleSuccessfulAuth} />
    }
    </>
    );
}