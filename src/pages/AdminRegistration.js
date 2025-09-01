import React, { useState } from 'react';
import './AdminRegistration.css';

const AdminRegistration = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match!');
            return;
        }

        if (formData.password.length < 6) {
            setMessage('Password must be at least 6 characters long!');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/users/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: formData.password,
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber,
                    role: 'ADMIN'
                }),
            });

            if (response.ok) {
                setMessage('Admin registered successfully!');
                setFormData({
                    password: '',
                    confirmPassword: '',
                    email: '',
                    firstName: '',
                    lastName: '',
                    phoneNumber: ''
                });
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Registration failed!');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-registration">
            <div className="registration-container">
                <h2>Admin Registration</h2>
                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter email"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name *</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                placeholder="Enter first name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last Name *</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                placeholder="Enter last name"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number *</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            placeholder="Enter phone number"
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
                            placeholder="Enter password (min 6 characters)"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm password"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register Admin'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminRegistration;
