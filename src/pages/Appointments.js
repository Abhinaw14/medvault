import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import './AdminDashboard.css';

const Appointments = () => {
    const appointments = useMemo(() => ([
        { id: 1, doctor: 'Dr. Alice Smith', patient: 'John Doe', date: '2025-09-01', time: '09:30', status: 'Scheduled' },
        { id: 2, doctor: 'Dr. Brian Lee', patient: 'Jane Roe', date: '2025-09-03', time: '14:00', status: 'Confirmed' },
        { id: 3, doctor: 'Dr. Carla Nguyen', patient: 'Alex Kim', date: '2025-09-10', time: '11:15', status: 'Completed' },
        { id: 4, doctor: 'Dr. David Patel', patient: 'Sam Roy', date: '2025-09-12', time: '16:00', status: 'Cancelled' },
        { id: 5, doctor: 'Dr. Emily Chen', patient: 'Pat Doe', date: '2025-09-15', time: '10:45', status: 'Scheduled' },
    ]), []);

    const statusCounts = useMemo(() => {
        const counts = { Active: 0, Completed: 0, Cancelled: 0 };
        appointments.forEach(a => {
            if (a.status === 'Completed') counts.Completed++;
            else if (a.status === 'Cancelled') counts.Cancelled++;
            else counts.Active++;
        });
        return [
            { name: 'Active', value: counts.Active },
            { name: 'Completed', value: counts.Completed },
            { name: 'Cancelled', value: counts.Cancelled },
        ];
    }, [appointments]);

    const COLORS = ['#6366F1', '#10B981', '#EF4444'];

    return (
        <div className="admin-dashboard">
            <h2>Appointments</h2>
            <div className="dashboard-container">
                <div className="main-content" style={{ flex: 1 }}>
                    <div className="tab-content">
                        <h3>Appointment List</h3>
                        <div className="users-table">
                            <table>
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
                </div>
                <div className="sidebar" style={{ width: 380 }}>
                    <h3>Status Breakdown</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={statusCounts} cx="50%" cy="50%" labelLine={false} outerRadius={120} dataKey="value">
                                    {statusCounts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointments;


