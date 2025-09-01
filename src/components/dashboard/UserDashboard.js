import React, { useMemo, useEffect, useState } from 'react';
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
        <div className="p-6 bg-slate-50 min-h-screen">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Welcome, {userName}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-slate-700 mb-4">Upcoming Appointments</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 rounded-l-lg">ID</th>
                                    <th scope="col" className="px-6 py-3">Doctor</th>
                                    <th scope="col" className="px-6 py-3">Patient</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Time</th>
                                    <th scope="col" className="px-6 py-3 rounded-r-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(a => (
                                    <tr key={a.id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{a.id}</td>
                                        <td className="px-6 py-4">{a.doctor}</td>
                                        <td className="px-6 py-4">{a.patient}</td>
                                        <td className="px-6 py-4">{a.date}</td>
                                        <td className="px-6 py-4">{a.time}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${a.status === 'Completed' ? 'bg-green-100 text-green-800' : a.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                                {a.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-slate-700 mb-4">Reset Password</h3>
                    <UserPasswordReset />
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;


