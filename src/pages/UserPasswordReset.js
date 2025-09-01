import React, { useState, useEffect } from 'react';
import './PasswordReset.css';

const UserPasswordReset = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [firstTime, setFirstTime] = useState(false);

    useEffect(() => {
        setFirstTime(localStorage.getItem('requiresPasswordChange') === 'true');
        const uid = localStorage.getItem('userId');
        if (uid) setUserId(uid);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setMessage('New password must be at least 6 characters.');
            return;
        }

        // First-time change requires userId and hits /api/auth/change-first-time-password
        if (firstTime && !userId) {
            setMessage('Missing user session. Please login again.');
            return;
        }

        setIsLoading(true);
        try {
            if (firstTime) {
                const res = await fetch('/api/auth/change-first-time-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ userId, currentPassword, newPassword })
                });
                if (res.ok) {
                    setMessage('Password changed successfully. Redirecting...');
                    localStorage.removeItem('requiresPasswordChange');
                    setTimeout(() => { window.location.href = '/dashboard'; }, 1200);
                } else {
                    let err = 'Password change failed.';
                    try { const data = await res.json(); err = data.message || err; } catch(_) {}
                    setMessage(err);
                }
            } else {
                setMessage('Use the reset link sent to your email to reset password.');
            }
        } catch (e) {
            setMessage('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="password-reset">
            <div className="reset-container">
                <h2>User Password Reset</h2>
                {firstTime ? (
                    <p className="reset-instructions">You must change your temporary password now.</p>
                ) : (
                    <p className="reset-instructions">For regular resets, use the email reset link.</p>
                )}
                {message && (
                    <div className={`message ${message.includes('successfully') || message.includes('changed') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="reset-form">
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password *</label>
                        <input id="currentPassword" type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} required placeholder="Enter current password" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password *</label>
                        <input id="newPassword" type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} required placeholder="At least 6 characters" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password *</label>
                        <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required placeholder="Retype new password" />
                    </div>
                    <button type="submit" className="submit-btn" disabled={isLoading}>{isLoading ? 'Resetting...' : 'Reset Password'}</button>
                </form>
            </div>
        </div>
    );
};

export default UserPasswordReset;


