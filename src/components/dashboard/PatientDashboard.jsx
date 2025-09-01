import React, { useEffect, useState, useContext } from 'react';
import Spinner from '../components/Spinner';
import { AuthContext } from '../../context/AuthContext';
import styles from './PatientDashboard.module.css';

const PatientDashboard = () => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const p = await fetch('/api/patient/profile', { headers });
                const d = await fetch('/api/patient/doctor', { headers });
                setProfile(p.ok ? await p.json() : null);
                setDoctor(d.ok ? await d.json() : null);
            } catch (_) {}
            finally { setLoading(false); }
        };
        load();
    }, [token]);

    if (loading) return <div className={styles.loading}><Spinner label="Loading dashboard..." /></div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Patient Dashboard</h2>
            <div className={styles.grid}>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Profile</h3>
                    {profile ? (
                        <div>
                            <div className={styles.infoItem}><span className={styles.label}>Name:</span> {profile.name || '-'}</div>
                            <div className={styles.infoItem}><span className={styles.label}>Gender:</span> {profile.gender || '-'}</div>
                            <div className={styles.infoItem}><span className={styles.label}>Address:</span> {profile.address || '-'}</div>
                            <div className={styles.infoItem}><span className={styles.label}>Emergency Contact:</span> {profile.emergencyContact || '-'}</div>
                        </div>
                    ) : <div className={styles.noData}>No profile data.</div>}
                </div>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Assigned Doctor</h3>
                    {doctor ? (
                        <div>
                            <div className={styles.infoItem}><span className={styles.label}>Name:</span> {doctor.name || '-'}</div>
                            <div className={styles.infoItem}><span className={styles.label}>Specialization:</span> {doctor.specialization || '-'}</div>
                        </div>
                    ) : <div className={styles.noData}>No doctor assigned.</div>}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;


