import React, { useEffect, useState, useContext } from 'react';
import Spinner from '../components/Spinner';
import { AuthContext } from '../context/AuthContext';

const DoctorDashboard = () => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const p = await fetch('/api/doctor/profile', { headers });
                const a = await fetch('/api/doctor/patients', { headers });
                const profileData = p.ok ? await p.json() : null;
                const apptData = a.ok ? await a.json() : [];
                setProfile(profileData);
                setAppointments(Array.isArray(apptData) ? apptData : []);
            } catch (_) {}
            finally { setLoading(false); }
        };
        load();
    }, [token]);

    if (loading) return <div className="max-w-7xl mx-auto px-4 py-6"><Spinner label="Loading dashboard..." /></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold mb-4">Doctor Dashboard</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="rounded border p-4 md:col-span-1">
                    <h3 className="font-semibold mb-2">Profile</h3>
                    {profile ? (
                        <div className="text-sm space-y-1">
                            <div><span className="text-slate-500">Name:</span> {profile.name || '-'}</div>
                            <div><span className="text-slate-500">Specialization:</span> {profile.specialization || '-'}</div>
                            <div><span className="text-slate-500">Department:</span> {profile.department || '-'}</div>
                            <div><span className="text-slate-500">License:</span> {profile.licenseNumber || '-'}</div>
                        </div>
                    ) : <div className="text-sm text-slate-500">No profile data.</div>}
                </div>
                <div className="rounded border p-4 md:col-span-2">
                    <h3 className="font-semibold mb-2">Assigned Patients</h3>
                    {appointments.length === 0 ? (
                        <div className="text-sm text-slate-500">No patients found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium text-slate-600">Name</th>
                                        <th className="px-3 py-2 text-left font-medium text-slate-600">Gender</th>
                                        <th className="px-3 py-2 text-left font-medium text-slate-600">Age</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {appointments.map((p, idx) => (
                                        <tr key={idx}>
                                            <td className="px-3 py-2">{p.name || '-'}</td>
                                            <td className="px-3 py-2">{p.gender || '-'}</td>
                                            <td className="px-3 py-2">{p.age ?? '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;


