import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';

export function MenuBar() {

  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);
  
    return (
      <Navbar color="dark" dark expand="md" className="mb-3">
        <NavbarBrand tag={Link} to="/">Spotify Record Collection</NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/">Create</NavLink>
            </NavItem>            
          </Nav>
        </Collapse>
      </Navbar>
    );
}