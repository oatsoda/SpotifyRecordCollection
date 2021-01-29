import { useCallback, useEffect, useState } from 'react';
import { SpotifyAuth, SpotifyAuthDetails } from './SpotifyAuth';
import { RecordCollectionDisplay } from './RecordCollectionDisplay';
import { PageContainer } from './PageContainer';
import { SpotifyContext, SpotifyContextAuthDetails } from '../api/SpotifyContext';

export function HomePage() {

  const lastAccessTokenStorageKey = "lastAccessToken";
  let [authDetails, setAuthDetails] = useState<SpotifyAuthDetails>();

  useEffect(() => {
    if (authDetails)
      return;
    
    const lastAccessToken = localStorage.getItem(lastAccessTokenStorageKey);
    if (!lastAccessToken)
      return;
    
    setAuthDetails({ access_token: lastAccessToken, expires_in: 0, scope: "", token_type: "", refresh_token: "" })
  }, [authDetails]);

  const handleAuthDetailsUpdated = useCallback((details: SpotifyContextAuthDetails) => {
    console.log(`Auth Changed: ${details?.access_token}`);
    setInStorage(details?.access_token); // In the case of clearing out the values, set storage before updating state so that useEffect doesn't pick up old value from storage again
    setAuthDetails(details);
  }, [])

  function setInStorage(accessToken: string | null | undefined) {
    
    if (!accessToken)
      localStorage.removeItem(lastAccessTokenStorageKey);
    else 
      localStorage.setItem(lastAccessTokenStorageKey, accessToken);
  }

  return (
    <SpotifyContext.Provider value={ { authDetails: authDetails, authDetailsUpdated: handleAuthDetailsUpdated } }>
      { authDetails &&
        <PageContainer>
          <RecordCollectionDisplay />
        </PageContainer>
      }
      { !authDetails &&
        <SpotifyAuth />
      }
    </SpotifyContext.Provider>
    );
}