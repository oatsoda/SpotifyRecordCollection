import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { getUser } from '../api/spotifyApi';
import { SpotifyUserObject } from '../api/spotifyApiTypes';
import { SpotifyContext } from '../api/SpotifyContext';

export function MenuBar() {

  const [collapsed, setCollapsed] = useState(true);
  
  const contextData = useContext(SpotifyContext);

  const toggleNavbar = () => setCollapsed(prev => !prev);
  
  const signOut = useCallback(() => {
    contextData.authDetailsUpdated(undefined);
  }, [contextData])

  return (
    <Navbar dark expand="md" className="bg-spotify mb-3">
      <NavbarBrand tag={Link} to="/">Spotify Record Collection</NavbarBrand>
      <NavbarToggler onClick={toggleNavbar} className="mr-2" />
      <Collapse isOpen={!collapsed} navbar>
        <Nav navbar>
          <NavItem>
            <NavLink tag={Link} to="/">Home</NavLink>
          </NavItem>            
        </Nav>
        <Nav className="ml-auto" navbar>
          { contextData.authDetails && 
            <UserDisplay />
          }
          <NavItem>
            {/* <NavLink tag={Link} to="/">Create</NavLink> */}
            { contextData.authDetails && 
              <NavLink href="#" onClick={signOut}>Sign Out</NavLink>
            }
          </NavItem>            
        </Nav>
      </Collapse>
    </Navbar>
  );
}

export function UserDisplay() {

  const contextData = useContext(SpotifyContext);
  
  const [user, setUser] = useState<SpotifyUserObject>();
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    async function getUserData() {

      await getUser(contextData, 
        async result => {
          setUser(result);
        }, 
        err =>{
          setErrorMessage(err.data);
        });
    }
    
    getUserData();
    return () => {}; // TODO: tidy up before unmount?    
  }, [contextData]);

  return (
    <NavItem>
      { user &&
        <NavLink href={user.external_urls.spotify} rel="noreferrer" target="_blank">{user.display_name}</NavLink>
      }
      { !user && errorMessage &&
        <span>errorMessage</span>
      }
      
    </NavItem>
  );
}