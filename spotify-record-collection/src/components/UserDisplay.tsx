import { useContext, useEffect, useState } from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { getUser } from '../api/spotifyApi';
import { SpotifyUserObject } from '../api/spotifyApiTypes';
import { SpotifyContext } from '../api/SpotifyContext';


export function UserDisplay() {

  const contextData = useContext(SpotifyContext);

  const [user, setUser] = useState<SpotifyUserObject>();
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    async function getUserData() {

      await getUser(contextData,
        async (result) => {
          setUser(result);
        },
        err => {
          setErrorMessage(err.data);
        });
    }

    getUserData();
    return () => { }; // TODO: tidy up before unmount?    
  }, [contextData]);

  return (
    <NavItem>
      {user &&
        <NavLink href={user.external_urls.spotify} rel="noreferrer" target="_blank">{user.display_name}</NavLink>}
      {!user && errorMessage &&
        <span>errorMessage</span>}

    </NavItem>
  );
}
