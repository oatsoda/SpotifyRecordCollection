import { useCallback, useState } from 'react';
import { SpotifyAuth, SpotifyAuthDetails } from './SpotifyAuth';
import { SpotifyAlbums } from './SpotifyAlbums';
import { PageContainer } from './PageContainer';

export function HomePage() {

  let [authDetails, setAuthDetails] = useState<SpotifyAuthDetails>();

  const handleSuccessfulAuth = useCallback((details: SpotifyAuthDetails) => {
    setAuthDetails(details);
  }, [])

  return (<>
    { authDetails &&
      <PageContainer>
        <SpotifyAlbums authDetails={authDetails!} />
      </PageContainer>
    }
    { !authDetails &&
      <SpotifyAuth onSuccessfulAuth={handleSuccessfulAuth} />
    }
    </>
    );
}