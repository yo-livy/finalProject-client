import axios from 'axios';
import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext.js';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    const { user, setUser } = useContext(UserContext);

    const login = async (e) => {
        e.preventDefault();
        try {
            const user = {username, password};
            const response = await axios.post('http://localhost:3030/login', user);
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
            setError(error.response.data.msg)
        }
    };

    if (user) {
        return <Navigate replace to='/dashboard' />
    };

    return (
    <div>
        <h2>Login</h2>
        {error && <p>{error}</p>}
        <form onSubmit={login}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type='submit'>Login</button>
        </form>
    </div>
    );
}

export default Login;