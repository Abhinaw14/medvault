import React, { useState } from 'react';
import './FirstTimePasswordReset.css';

const FirstTimePasswordReset = ({ username, onPasswordReset }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('New password and confirm password do not match');
            return;
        }

        if (formData.newPassword.length < 8) {
            setMessage('New password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/users/first-time-reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword
                }),
            });

            if (response.ok) {
                setMessage('Password reset successfully! You can now log in with your new password.');
                setTimeout(() => {
                    if (onPasswordReset) {
                        onPasswordReset();
                    }
                }, 2000);
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Password reset failed');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="first-time-password-reset">
            <div className="reset-container">
                <div className="reset-header">
                    <h2>🔐 First-Time Password Reset</h2>
                    <p>Welcome! For security reasons, you must change your password on your first login.</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="reset-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            disabled
                            className="disabled-input"
                        />
                        <small>This is your assigned username</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password *</label>
                        <div className="password-input-group">
                            <input
                                type={showPassword.current ? "text" : "password"}
                                id="currentPassword"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your current password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => togglePasswordVisibility('current')}
                                title={showPassword.current ? "Hide password" : "Show password"}
                            >
                                {showPassword.current ? "👁️" : "🙈"}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password *</label>
                        <div className="password-input-group">
                            <input
                                type={showPassword.new ? "text" : "password"}
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your new password (min 8 characters)"
                                minLength="8"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => togglePasswordVisibility('new')}
                                title={showPassword.new ? "Hide password" : "Show password"}
                            >
                                {showPassword.new ? "👁️" : "🙈"}
                            </button>
                        </div>
                        <small>Password must be at least 8 characters long</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password *</label>
                        <div className="password-input-group">
                            <input
                                type={showPassword.confirm ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                placeholder="Confirm your new password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => togglePasswordVisibility('confirm')}
                                title={showPassword.confirm ? "Hide password" : "Show password"}
                            >
                                {showPassword.confirm ? "👁️" : "🙈"}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </form>

                <div className="security-notice">
                    <h4>🔒 Security Notice</h4>
                    <ul>
                        <li>Choose a strong, unique password</li>
                        <li>Don't share your password with anyone</li>
                        <li>Consider using a mix of letters, numbers, and symbols</li>
                        <li>This is a one-time requirement for your first login</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FirstTimePasswordReset;
