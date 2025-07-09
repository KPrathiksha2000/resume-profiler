import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import '../App.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/resume');
    } catch (err) {
      alert('Login failed');
      console.error(err);
    }
  };

  return (
    <>
      <h1>Resume Builder</h1>
      <div>
        <h2>Log In</h2>
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button onClick={handleLogin}>Log In</button>
        <p>
          Don't have an account? <Link to="/Signup">Signup here</Link>
        </p>
      </div>
    </>
  );
}

export default Login;
