import axios from 'axios';
import { useState, useContext } from 'react';
import UserContext from '../UserContext.js';
import { Navigate } from 'react-router-dom';


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { user, setUser } = useContext(UserContext);


    const register = async (e) => {
        e.preventDefault();
        try {
            const newUser = {username, password};
            const response = await axios.post('http://localhost:3030/register', newUser);
            setUser(response.data[0]);
        } catch (error) {
            setError(error.response.data.msg);
        }
    }

    if (user) {
        return <Navigate replace to='/login' />;
    }

    return (
    <div>
        <h2>Register</h2>
        {error && <p>{error}</p>}
        <form onSubmit={register}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type='submit'>Register</button>
        </form>
    </div>
    );
}

export default Register;