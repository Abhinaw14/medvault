 import React, { useState } from 'react';
import './UserLogin.css';

const UserLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setMessage('Please enter a valid email.');
            return false;
        }
        if (!formData.password || formData.password.length < 6) {
            setMessage('Password must be at least 6 characters.');
            return false;
        }
        setMessage('Login successful (demo).');
        // Demo: store user name and redirect to dashboard
        const name = formData.email.split('@')[0];
        localStorage.setItem('demoUserName', name.charAt(0).toUpperCase() + name.slice(1));
        // Store demo user id and first-time flag for reset flow demo
        localStorage.setItem('userId', '1');
        // Uncomment if you want to force first-time reset flow demo
        // localStorage.setItem('requiresPasswordChange','true');
        setTimeout(() => { window.location.href = '/dashboard'; }, 600);
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        validate();
    };

    return (
        <div className="user-login">
            <div className="login-container">
                <h2>User Login</h2>
                {message && (
                    <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter password"
                        />
                    </div>
                    <button type="submit" className="submit-btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default UserLogin;
