import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


const API_URL = 'http://localhost:5000/api';

const sampleQuotes = [

  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Get busy living or get busy dying.", author: "Stephen King" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "Get busy living or get busy dying.", author: "Stephen King" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "In the end, we only regret the chances we didn’t take.", author: "Lewis Carroll" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "Get busy living or get busy dying.", author: "Stephen King" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "In the end, we only regret the chances we didn’t take.", author: "Lewis Carroll" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "Get busy living or get busy dying.", author: "Stephen King" },
  { text: "In the end, we only regret the chances we didn’t take.", author: "Lewis Carroll" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "In the end, we only regret the chances we didn’t take.", author: "Lewis Carroll" },
  { text: "Get busy living or get busy dying.", author: "Stephen King" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  // Removed incomplete quote object here
];

function App() {
  const [page, setPage] = useState('login'); // login | register | quotes
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [randomQuote, setRandomQuote] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      setPage('quotes');
      fetchFavorites();
      generateRandomQuote();
    }
  }, [token]);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${API_URL}/favorites`, {
        headers: { Authorization: token }
      });
      setFavorites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const generateRandomQuote = () => {
    const random = sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)];
    setRandomQuote(random);
  };

  const handleRegister = async () => {
    setError('');
    if (!username || !password) {
      setError('Username and password required');
      return;
    }
    try {
      await axios.post(`${API_URL}/register`, { username, password });
      alert('Registered successfully! Please login.');
      setPage('login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogin = async () => {
    setError('');
    if (!username || !password) {
      setError('Username and password required');
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUsername('');
      setPassword('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleAddFavorite = async () => {
    if (!randomQuote) return;
    try {
      const res = await axios.post(`${API_URL}/favorites`, randomQuote, {
        headers: { Authorization: token }
      });
      setFavorites(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add favorite');
    }
  };

  const handleRemoveFavorite = async (quoteText) => {
    try {
      const res = await axios.delete(`${API_URL}/favorites`, {
        headers: { Authorization: token },
        data: { text: quoteText }
      });
      setFavorites(res.data);
    } catch (err) {
      alert('Could not remove favorite');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setFavorites([]);
    setRandomQuote(null);
    setPage('login');
  };

  if (page === 'login') {
    return (
      <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <button onClick={handleLogin} style={{ width: '100%', padding: 10 }}>Log In</button>
        <p style={{ marginTop: 10 }}>
          Don't have an account?{' '}
          <button onClick={() => { setPage('register'); setError(''); }}>Register</button>
        </p>
      </div>
    );
  }

  if (page === 'register') {
    return (
      <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
        <h2>Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <button onClick={handleRegister} style={{ width: '100%', padding: 10 }}>Register</button>
        <p style={{ marginTop: 10 }}>
          Already have an account?{' '}
          <button onClick={() => { setPage('login'); setError(''); }}>Login</button>
        </p>
      </div>
    );
  }
  if (page === 'quotes') {
  return (
  <div className="container">
    <button className="logout-btn" onClick={handleLogout}>Logout</button>
    <h2>Random Quotes</h2>

    {randomQuote && (
      <div style={{ border: '1px solid #ccc', padding: 20, marginBottom: 10 }}>
        <p style={{ fontStyle: 'italic' }}>"{randomQuote.text}"</p>
        <p style={{ textAlign: 'right', fontWeight: 'bold' }}>- {randomQuote.author || 'Unknown'}</p>
        <div className="quote-actions">
          <button className="small-btn" onClick={handleAddFavorite}>Add to Favorites💖</button>
          <button className="small-btn" onClick={generateRandomQuote}>New Quote</button>
        </div>
      </div>
    )}

    <h3>Your Favorites💖</h3>
    {favorites.length === 0 && <p>No favorite quotes yet.</p>}
    {favorites.map((fav, i) => (
  <div key={i} className="fav-quote">
    <p className="quote-text">"{fav.text}" - {fav.author || 'Unknown'}</p>
    <button className="small-remove-btn" onClick={() => handleRemoveFavorite(fav.text)}>Remove</button>
  </div>
))}

    </div>
  );
}

  return null;
}

export default App;