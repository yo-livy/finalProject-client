import './Nav.css'

import { useContext } from 'react'; 
import UserContext from '../../UserContext';
import { Link } from 'react-router-dom';

const Nav = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="navbar">
      {!user && <Link to="/login">Login</Link>}
      {!user && <Link to="/register">Register</Link>}
      {user && <Link to="/dashboard">Dashboard</Link>}
      {user && <Link to="/invest">Invest</Link>}
      {user && <Link to="/logout">Logout</Link>} {/* Add this link */}
    </div>
  );
}

export default Nav;



