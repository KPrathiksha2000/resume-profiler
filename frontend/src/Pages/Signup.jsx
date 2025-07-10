import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:5000/auth/signup', form);
      alert('Signup successful!');
      navigate('/login');
    } catch (err) {
      alert('Signup failed');
      console.error(err);
    }
  };


  return (
    <>
      <h1 className='signupheading'>Resume Builder</h1>
      <div className="signup">
        <h2>Sign Up</h2>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
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
        <button onClick={handleSignup}>Sign Up</button>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </>
  );
}

export default Signup;
