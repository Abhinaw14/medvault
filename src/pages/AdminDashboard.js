import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [pendingUsers, setPendingUsers] = useState([]);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Admin inline reset form (uses existing backend DTO: email + newPassword)
    const [adminResetForm, setAdminResetForm] = useState({
        email: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchPendingUsers();
        fetchApprovedUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/pending-users');
            setPendingUsers(response.data);
        } catch (error) {
            toast.error('Error fetching pending users');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApprovedUsers = async () => {
        try {
            const response = await axios.get('/api/admin/approved-users');
            setApprovedUsers(response.data);
        } catch (error) {
            toast.error('Error fetching approved users');
            console.error('Error:', error);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (adminResetForm.newPassword !== adminResetForm.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            await axios.post('/api/admin/reset-password', {
                email: adminResetForm.email,
                newPassword: adminResetForm.newPassword
            });
            toast.success('Password reset successfully!');
            setAdminResetForm({ email: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data || 'Error resetting password');
        }
    };

    const handleApproveUser = async (userId) => {
        try {
            const response = await axios.post(`/api/admin/approve/${userId}`);
            
            if (response.data.credentials) {
                const { username, password, email } = response.data.credentials;
                toast.success(`User approved successfully! Credentials sent to ${email}`);
                
                // Show credentials in a popup or alert
                alert(`User Approved!\n\nCredentials:\nUsername: ${username}\nPassword: ${password}\n\nThese credentials have been sent to the user's email.`);
            } else {
                toast.success('User approved successfully!');
            }
            
            // Refresh both lists immediately
            fetchPendingUsers();
            fetchApprovedUsers();
        } catch (error) {
            toast.error(error.response?.data || 'Error approving user');
        }
    };

    const handleRejectUser = async (userId) => {
        try {
            await axios.post(`/api/admin/reject/${userId}`);
            toast.success('User rejected successfully!');
            // Refresh pending users list immediately
            fetchPendingUsers();
        } catch (error) {
            toast.error(error.response?.data || 'Error rejecting user');
        }
    };

    const renderPendingUsersTab = () => (
        <div className="tab-content">
            <h3>Pending User Approvals</h3>
            {loading ? (
                <div className="loading">Loading...</div>
            ) : pendingUsers.length === 0 ? (
                <div className="no-data">No pending users</div>
            ) : (
                <div className="users-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>{user.role}</td>
                                    <td className="actions">
                                        <button 
                                            onClick={() => handleApproveUser(user.id)}
                                            className="btn-approve"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleRejectUser(user.id)}
                                            className="btn-reject"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderApprovedUsersTab = () => (
        <div className="tab-content">
            <h3>Approved Users</h3>
            {approvedUsers.length === 0 ? (
                <div className="no-data">No approved users</div>
            ) : (
                <div className="users-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvedUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <span className="status-approved">Approved</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderPasswordResetTab = () => (
        <div className="tab-content">
            <h3>Reset Admin Password</h3>
            <form onSubmit={handlePasswordReset} className="password-reset-form">
                <div className="form-group">
                    <label htmlFor="email">Admin Email</label>
                    <input id="email" type="email" placeholder="admin@medvault.com" value={adminResetForm.email} onChange={(e)=>setAdminResetForm({...adminResetForm, email: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input id="newPassword" type="password" placeholder="New Password" value={adminResetForm.newPassword} onChange={(e)=>setAdminResetForm({...adminResetForm, newPassword: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input id="confirmPassword" type="password" placeholder="Confirm Password" value={adminResetForm.confirmPassword} onChange={(e)=>setAdminResetForm({...adminResetForm, confirmPassword: e.target.value})} required />
                </div>
                <button type="submit" className="btn-primary">Reset Password</button>
            </form>
        </div>
    );

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h2>Admin Dashboard</h2>
            </div>
            
            <div className="dashboard-container">
                {/* Left Sidebar */}
                <div className="sidebar">
                    <div className="sidebar-header">
                        <h3>Admin Panel</h3>
                    </div>
                    <nav className="sidebar-nav">
                        <button 
                            className={`sidebar-nav-item ${activeTab === 'pending' ? 'active' : ''}`}
                            onClick={() => setActiveTab('pending')}
                        >
                            Pending Users
                        </button>
                        <button 
                            className={`sidebar-nav-item ${activeTab === 'approved' ? 'active' : ''}`}
                            onClick={() => setActiveTab('approved')}
                        >
                            Approved Users
                        </button>
                        <button 
                            className={`sidebar-nav-item ${activeTab === 'password-reset' ? 'active' : ''}`}
                            onClick={() => setActiveTab('password-reset')}
                        >
                            Reset Admin Password
                        </button>
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="main-content">
                    {activeTab === 'pending' && renderPendingUsersTab()}
                    {activeTab === 'approved' && renderApprovedUsersTab()}
                    {activeTab === 'password-reset' && renderPasswordResetTab()}
                </div>
            </div>

            <ToastContainer position="top-right" />
        </div>
    );
};

export default AdminDashboard;
