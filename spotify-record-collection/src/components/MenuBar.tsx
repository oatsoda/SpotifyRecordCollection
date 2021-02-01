import { useCallback, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { SpotifyContext } from '../api/SpotifyContext';

export function MenuBar() {

  const [collapsed, setCollapsed] = useState(true);
  
  const contextData = useContext(SpotifyContext);

  const toggleNavbar = () => setCollapsed(prev => !prev);
  
  const signOut = useCallback(() => {
    contextData.authDetailsUpdated(undefined);
  }, [contextData])

  return (
    <Navbar color="dark" dark expand="md" className="mb-3">
      <NavbarBrand tag={Link} to="/">Spotify Record Collection</NavbarBrand>
      <NavbarToggler onClick={toggleNavbar} className="mr-2" />
      <Collapse isOpen={!collapsed} navbar>
      <Nav navbar>
          <NavItem>
            <NavLink tag={Link} to="/">Home</NavLink>
          </NavItem>            
        </Nav>
        <Nav className="ml-auto" navbar>
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