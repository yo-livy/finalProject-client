import './Nav.css';
import { useContext } from 'react'; 
import UserContext from '../UserContext';
import { NavLink, Link, useLocation } from 'react-router-dom';

const Nav = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  }

  return (
    <div className={user ? "navbar dash" : "navbar"}>
      {(!user && location.pathname !== "/login") && <NavLink to="/login">Sign in</NavLink>}
      {!user && <Link to="/register" className='reg'>Sign up</Link>}
      {user && <NavLink to="/dashboard" className={isActive("/dashboard") ? 'menu activeRoute' : 'menu'}>Dashboard</NavLink>}
      {user && <NavLink to="/invest" className={isActive("/invest") ? 'menu activeRoute' : 'menu'}>Invest</NavLink>}
      {user && <Link to="/logout">Logout</Link>}
    </div>
  );
}

export default Nav;

