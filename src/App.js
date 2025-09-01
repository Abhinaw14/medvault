import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminRegistration from "./pages/AdminRegistration";
import UserRegistrationRequest from "./pages/UserRegistrationRequest";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import UserLogin from "./pages/UserLogin";
import PasswordReset from "./pages/PasswordReset";
import AdminPasswordReset from "./pages/AdminPasswordReset";
import UserPasswordReset from "./pages/UserPasswordReset";
import Appointments from "./pages/Appointments";
import "./App.css";

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);
    
    // Close sidebar when route changes
    useEffect(() => {
        closeSidebar();
    }, [location]);

    return (
        <div className="app">
            <header className="app-header">
                <button className="hamburger-btn" onClick={toggleSidebar} aria-label="Toggle Menu">
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
                <h1 className="app-title">MedVault</h1>
            </header>

            <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <nav className="sidebar-nav">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/appointments" className="nav-link">Appointments</Link>
                    <Link to="/admin-dashboard" className="nav-link">Admin</Link>
                    <Link to="/user-login" className="nav-link">User Login</Link>
                    <Link to="#" className="nav-link">Settings</Link>
                </nav>
            </aside>

            {sidebarOpen && <div className="backdrop" onClick={closeSidebar}></div>}

            <main className="main-content">
                <Routes>
                    <Route path="/" element={
                        <div className="home-page">
                            <h2>Welcome to MedVault</h2>
                            <p>Your comprehensive medical management system</p>
                            <div className="home-banners">
                                <div className="banner">
                                    <h4>Trusted Doctors</h4>
                                    <p>Experienced specialists ready to help you.</p>
                                </div>
                                <div className="banner">
                                    <h4>Patient-Centered</h4>
                                    <p>Compassionate care with modern technology.</p>
                                </div>
                                <div className="banner">
                                    <h4>Secure Records</h4>
                                    <p>Your data is protected and always accessible.</p>
                                </div>
                            </div>
                            <div className="home-actions">
                                <Link to="/admin-register" className="action-btn primary">Admin Registration</Link>
                                <Link to="/user-request" className="action-btn primary">User Registration Request</Link>
                                <Link to="/admin-dashboard" className="action-btn secondary">Admin Dashboard</Link>
                                <Link to="/user-login" className="action-btn primary">User Login</Link>
                            </div>
                        </div>
                    } />
                    <Route path="/admin-register" element={<AdminRegistration />} />
                    <Route path="/user-request" element={<UserRegistrationRequest />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/user-login" element={<UserLogin />} />
                    <Route path="/password-reset" element={<PasswordReset />} />
                    <Route path="/admin-reset" element={<AdminPasswordReset />} />
                    <Route path="/user-reset" element={<UserPasswordReset />} />
                    <Route path="/dashboard" element={<UserDashboard />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
