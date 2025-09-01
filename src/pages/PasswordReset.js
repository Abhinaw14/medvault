import React, { useState } from 'react';
import './PasswordReset.css';

const PasswordReset = () => {
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match!');
            return;
        }

        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long!');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resetToken: resetToken,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset successful! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/user-login';
                }, 2000);
            } else {
                setMessage(data.message || 'Password reset failed!');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="password-reset">
            <div className="reset-container">
                <h2>Reset Password</h2>
                <p className="reset-instructions">
                    Enter the reset token from your email and set a new password.
                </p>
                
                {message && (
                    <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="reset-form">
                    <div className="form-group">
                        <label htmlFor="resetToken">Reset Token *</label>
                        <input
                            type="text"
                            id="resetToken"
                            value={resetToken}
                            onChange={(e) => setResetToken(e.target.value)}
                            required
                            placeholder="Enter reset token from email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password *</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Enter new password (min 6 characters)"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </form>

                <div className="reset-actions">
                    <a href="/user-login" className="back-link">Back to Login</a>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;
