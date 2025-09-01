import React, { useMemo, useEffect, useState } from 'react';
import './AdminDashboard.css';
import UserPasswordReset from './UserPasswordReset';

const UserDashboard = () => {
    const [userName, setUserName] = useState('User');
    useEffect(() => {
        const stored = localStorage.getItem('demoUserName');
        if (stored) setUserName(stored);
    }, []);

    const appointments = useMemo(() => ([
        { id: 1, doctor: 'Dr. Alice Smith', patient: 'John Doe', date: '2025-09-01', time: '09:30', status: 'Scheduled' },
        { id: 2, doctor: 'Dr. Brian Lee', patient: 'John Doe', date: '2025-09-03', time: '14:00', status: 'Confirmed' },
        { id: 3, doctor: 'Dr. Carla Nguyen', patient: 'John Doe', date: '2025-09-10', time: '11:15', status: 'Completed' },
        { id: 4, doctor: 'Dr. David Patel', patient: 'John Doe', date: '2025-09-12', time: '16:00', status: 'Cancelled' },
    ]), []);

    return (
        <div className="admin-dashboard">
            <h2>Welcome, {userName}</h2>
            <div className="cards">
                <div className="card">
                    <h3>Upcoming Appointments</h3>
                    <div className="table-wrapper">
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Doctor</th>
                                    <th>Patient</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(a => (
                                    <tr key={a.id}>
                                        <td>{a.id}</td>
                                        <td>{a.doctor}</td>
                                        <td>{a.patient}</td>
                                        <td>{a.date}</td>
                                        <td>{a.time}</td>
                                        <td>{a.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card">
                    <h3>Reset Password</h3>
                    <UserPasswordReset />
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;


