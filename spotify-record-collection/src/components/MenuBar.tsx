import { useCallback, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { SpotifyContext } from '../api/SpotifyContext';
import { UserDisplay } from './UserDisplay';

export function MenuBar() {

  const [collapsed, setCollapsed] = useState(true);
  
  const contextData = useContext(SpotifyContext);

  const toggleNavbar = () => setCollapsed(prev => !prev);
  
  const signOut = useCallback(() => {
    contextData.authDetailsUpdated(undefined);
  }, [contextData])

  return (
    <Navbar dark expand="md" className="bg-spotify mb-3">
      <NavbarBrand tag={Link} to="/" className="pb-0">
        <img src="/img/Spotify_Icon_RGB_Black.png" width="40px" className="pb-1 mr-1" alt="" /> Spotify Record Collection
      </NavbarBrand>
      <NavbarToggler onClick={toggleNavbar} className="mr-2" />
      <Collapse isOpen={!collapsed} navbar>
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

