import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext.js';

const Logout = () => {
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, [user, setUser]);

    return <Navigate to="/" replace />;
}

export default Logout;
