import { useCallback, useState } from 'react';
import { SpotifyAuth, SpotifyAuthDetails } from './SpotifyAuth';
import { SpotifyAlbums } from './SpotifyAlbums';
import { PageContainer } from './PageContainer';
import { SpotifyContext, SpotifyContextAuthDetails } from '../api/SpotifyContext';

export function HomePage() {

  let [authDetails, setAuthDetails] = useState<SpotifyAuthDetails>();

  const handleAuthDetailsUpdated = useCallback((details: SpotifyContextAuthDetails) => {
    setAuthDetails(details);
  }, [])

  return (
    <SpotifyContext.Provider value={ { authDetails: authDetails, authDetailsUpdated: handleAuthDetailsUpdated } }>
      { authDetails &&
        <PageContainer>
          <SpotifyAlbums />
        </PageContainer>
      }
      { !authDetails &&
        <SpotifyAuth />
      }
    </SpotifyContext.Provider>
    );
}