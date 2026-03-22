import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { showNotification } from '../store/uiSlice';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // useDispatch gives us the ability to send Actions to the Redux Store
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        // Dispatch the login action to save the token in the Store!
        dispatch(loginSuccess({ token: data.token, username: data.username }));
        // Dispatch a global UI notification!
        dispatch(showNotification({ message: `Welcome back, ${data.username}!`, type: 'success' }));
      } else {
        setError(data.error);
        dispatch(showNotification({ message: data.error, type: 'error' }));
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white' }}>
      <h2>Log In to Task Board</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username (hint: admin)</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password (hint: lab3)</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Log In
        </button>
      </form>
    </div>
  );
}
