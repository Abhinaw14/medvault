import React, { useState, useEffect } from 'react';
import './AdminUserManagement.css';

const AdminUserManagement = () => {
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({});
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('requests');
    const [generatedCredentials, setGeneratedCredentials] = useState(null);

    useEffect(() => {
        fetchRequests();
        fetchStats();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch('/api/user-registration/requests');

            // Case 1 & 3: network or HTTP error
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Case 2: No pending users
            if (Array.isArray(data) && data.length === 0) {
                setRequests([]); // just show empty list
                return; // no error
            }
            setRequests(data);

        } catch (error) {
            // Case 1: network issue, Case 3: API/server error
            console.error('Error fetching requests:', error);
        }

    };

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/user-registration/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleApprove = async (requestId) => {
        console.log('Approve button clicked for request ID:', requestId);
        console.log('Admin notes:', adminNotes);
        console.log('Admin password:', adminPassword ? 'Set' : 'Not set');
        
        if (!adminNotes.trim()) {
            setMessage('Please add admin notes before approving');
            return;
        }

        if (!adminPassword.trim()) {
            setMessage('Please set a password for the user');
            return;
        }

        setIsLoading(true);
        try {
            const url = `/api/user-registration/requests/${requestId}/approve?adminId=1&adminNotes=${encodeURIComponent(adminNotes)}&adminPassword=${encodeURIComponent(adminPassword)}`;
            console.log('Making request to:', url);
            
            const response = await fetch(url, {
                method: 'POST'
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (response.ok) {
                const result = await response.json();
                console.log('Success result:', result);
                setGeneratedCredentials({
                    username: result.generatedUsername,
                    password: result.generatedPassword,
                    user: result.user
                });
                setMessage('User created successfully! Generated credentials are displayed below.');
                setAdminNotes('');
                setAdminPassword('');
                fetchRequests();
                fetchStats();
            } else {
                const errorText = await response.text();
                console.log('Error response:', errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    setMessage(errorData.message || 'Approval failed');
                } catch (e) {
                    setMessage(`Approval failed: ${response.status} ${response.statusText}`);
                }
            }
        } catch (error) {
            console.error('Network error:', error);
            setMessage('Network error. Please try again. Error: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async (requestId) => {
        if (!adminNotes.trim()) {
            setMessage('Please add admin notes before rejecting');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/user-registration/requests/${requestId}/reject?adminId=1&adminNotes=${encodeURIComponent(adminNotes)}`, {
                method: 'POST'
            });

            if (response.ok) {
                setMessage('Request rejected successfully');
                setAdminNotes('');
                setAdminPassword('');
                setSelectedRequest(null);
                fetchRequests();
                fetchStats();
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Rejection failed');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'orange';
            case 'APPROVED': return 'green';
            case 'REJECTED': return 'red';
            default: return 'gray';
        }
    };

    const closeCredentials = () => {
        setGeneratedCredentials(null);
        setSelectedRequest(null);
        setMessage('');
    };

    const generateRandomPassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setAdminPassword(password);
    };

    return (
        <div className="admin-user-management">
            <h2>Admin User Management</h2>

            {message && (
                <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <div className="stats-section">
                <div className="stat-card">
                    <h3>Pending</h3>
                    <span className="stat-number">{stats.pending || 0}</span>
                </div>
                <div className="stat-card">
                    <h3>Approved</h3>
                    <span className="stat-number">{stats.approved || 0}</span>
                </div>
                <div className="stat-card">
                    <h3>Rejected</h3>
                    <span className="stat-number">{stats.rejected || 0}</span>
                </div>
                <div className="stat-card">
                    <h3>Total</h3>
                    <span className="stat-number">{stats.total || 0}</span>
                </div>
            </div>

            <div className="requests-section">
                <h3>Pending Registration Requests</h3>
                <div className="requests-list">
                    {requests.filter(req => req.status === 'PENDING').map(request => (
                        <div key={request.id} className="request-card">
                            <div className="request-header">
                                <h4>{request.firstName} {request.lastName}</h4>
                                <span className={`status ${request.status.toLowerCase()}`}>
                                        {request.status}
                                    </span>
                            </div>
                            <div className="request-details">
                                <p><strong>Email:</strong> {request.email}</p>
                                <p><strong>Phone:</strong> {request.phoneNumber}</p>
                                <p><strong>Role:</strong> {request.role}</p>
                                {request.role === 'DOCTOR' && (
                                    <>
                                        <p><strong>Specialization:</strong> {request.specialization}</p>
                                        <p><strong>License:</strong> {request.licenseNumber}</p>
                                        <p><strong>Department:</strong> {request.department}</p>
                                    </>
                                )}
                                {request.role === 'PATIENT' && (
                                    <>
                                        <p><strong>Date of Birth:</strong> {request.dateOfBirth}</p>
                                        <p><strong>Gender:</strong> {request.gender}</p>
                                        <p><strong>Address:</strong> {request.address}</p>
                                        <p><strong>Emergency Contact:</strong> {request.emergencyContact}</p>
                                    </>
                                )}
                            </div>
                            <div className="request-actions">
                                <button
                                    className="btn-approve"
                                    onClick={() => setSelectedRequest(request)}
                                >
                                    Approve
                                </button>
                                <button
                                    className="btn-reject"
                                    onClick={() => setSelectedRequest(request)}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for approval/rejection */}
            {selectedRequest && !generatedCredentials && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Process Request</h3>
                        <p>Processing request for: <strong>{selectedRequest.firstName} {selectedRequest.lastName}</strong></p>

                        <div className="form-group">
                            <label htmlFor="adminNotes">Admin Notes *</label>
                            <textarea
                                id="adminNotes"
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add notes about this decision..."
                                rows="4"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="adminPassword">Set User Password *</label>
                            <div className="password-input-group">
                                <input
                                    type="text"
                                    id="adminPassword"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    placeholder="Enter password for the user..."
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn-generate-password"
                                    onClick={generateRandomPassword}
                                    title="Generate random password"
                                >
                                    🎲 Generate
                                </button>
                            </div>
                            <small className="password-hint">
                                This password will be used for the user's first login. They will be required to change it.
                            </small>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="btn-approve"
                                onClick={() => {
                                    console.log('Button clicked!', selectedRequest?.id);
                                    if (selectedRequest?.id) {
                                        handleApprove(selectedRequest.id);
                                    } else {
                                        alert('No request selected');
                                    }
                                }}
                                disabled={isLoading || !adminNotes.trim() || !adminPassword.trim()}
                            >
                                {isLoading ? 'Processing...' : 'Approve & Create User'}
                            </button>
                            <button
                                className="btn-reject"
                                onClick={() => handleReject(selectedRequest.id)}
                                disabled={isLoading || !adminNotes.trim()}
                            >
                                {isLoading ? 'Processing...' : 'Reject Request'}
                            </button>
                            <button
                                className="btn-cancel"
                                onClick={() => {
                                    setSelectedRequest(null);
                                    setAdminNotes('');
                                    setAdminPassword('');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for displaying generated credentials */}
            {generatedCredentials && (
                <div className="modal-overlay">
                    <div className="modal credentials-modal">
                        <h3>✅ User Created Successfully!</h3>
                        <p>User account has been created with the following credentials:</p>

                        <div className="credentials-display">
                            <div className="credential-item">
                                <label>Username:</label>
                                <div className="credential-value">
                                    <span className="credential-text">{generatedCredentials.username}</span>
                                    <button
                                        className="copy-btn"
                                        onClick={() => navigator.clipboard.writeText(generatedCredentials.username)}
                                        title="Copy username"
                                    >
                                        📋
                                    </button>
                                </div>
                            </div>

                            <div className="credential-item">
                                <label>Password:</label>
                                <div className="credential-value">
                                    <span className="credential-text">{generatedCredentials.password}</span>
                                    <button
                                        className="copy-btn"
                                        onClick={() => navigator.clipboard.writeText(generatedCredentials.password)}
                                        title="Copy password"
                                    >
                                        📋
                                    </button>
                                </div>
                            </div>

                            <div className="credential-item">
                                <label>Role:</label>
                                <span className="credential-text">{generatedCredentials.user.role}</span>
                            </div>

                            <div className="credential-item">
                                <label>Email:</label>
                                <span className="credential-text">{generatedCredentials.user.email}</span>
                            </div>
                        </div>

                        <div className="credentials-warning">
                            <p>⚠️ <strong>Important:</strong> Please save these credentials securely. The password cannot be retrieved later.</p>
                            <p>🔐 <strong>First Login:</strong> User will be required to change their password on first login.</p>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="btn-primary"
                                onClick={closeCredentials}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserManagement;
