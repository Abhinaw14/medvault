import React, { useState } from 'react';
import './UserRegistrationRequest.css';

const UserRegistrationRequest = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: 'PATIENT',
        // Doctor fields
        specialization: '',
        licenseNumber: '',
        department: '',
        // Patient fields
        dateOfBirth: '',
        gender: '',
        address: '',
        emergencyContact: ''
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
        
        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/user-registration/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                setMessage(`Registration request submitted successfully! Request ID: ${result.requestId}`);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
                    role: 'PATIENT',
                    specialization: '',
                    licenseNumber: '',
                    department: '',
                    dateOfBirth: '',
                    gender: '',
                    address: '',
                    emergencyContact: ''
                });
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Registration request failed!');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const isDoctor = formData.role === 'DOCTOR';
    const isPatient = formData.role === 'PATIENT';

    return (
        <div className="user-registration-request">
            <div className="request-container">
                <h2>User Registration Request</h2>
                <p className="request-info">
                    Submit your registration request. An admin will review and approve it.
                    You will receive your login credentials once approved.
                </p>
                
                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="request-form">
                    <div className="form-section">
                        <h3>Basic Information</h3>
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

                        <div className="form-row">
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
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Role *</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="PATIENT">Patient</option>
                                <option value="DOCTOR">Doctor</option>
                            </select>
                        </div>
                    </div>

                    {isDoctor && (
                        <div className="form-section">
                            <h3>Doctor Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="specialization">Specialization *</label>
                                    <input
                                        type="text"
                                        id="specialization"
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Cardiology, Neurology"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="licenseNumber">License Number *</label>
                                    <input
                                        type="text"
                                        id="licenseNumber"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="Medical license number"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="department">Department</label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="Department name"
                                />
                            </div>
                        </div>
                    )}

                    {isPatient && (
                        <div className="form-section">
                            <h3>Patient Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="dateOfBirth">Date of Birth</label>
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="gender">Gender</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your address"
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="emergencyContact">Emergency Contact</label>
                                <input
                                    type="tel"
                                    id="emergencyContact"
                                    name="emergencyContact"
                                    value={formData.emergencyContact}
                                    onChange={handleChange}
                                    placeholder="Emergency contact number"
                                />
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Registration Request'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserRegistrationRequest;
