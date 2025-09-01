import React, { useState } from 'react';
import './PasswordReset.css';

const AdminPasswordReset = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!email) {
            setMessage('Admin email is required.');
            return;
        }
        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword })
            });
            const data = await res.text();
            if (res.ok) {
                setMessage('Admin password reset successfully.');
            } else {
                setMessage(data || 'Failed to reset admin password.');
            }
        } catch (err) {
            setMessage('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="password-reset">
            <div className="reset-container">
                <h2>Admin Password Reset</h2>
                {message && (
                    <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="reset-form">
                    <div className="form-group">
                        <label htmlFor="email">Admin Email *</label>
                        <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="admin@medvault.com" />
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

export default AdminPasswordReset;


