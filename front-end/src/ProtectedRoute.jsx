import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import TopBar from "./components/TopBar";

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Verify the token with the backend using cookies
        axios.get('http://localhost:5100/api/auth/verify-token', { withCredentials: true })
            .then(response => {
                setIsAuthenticated(true);
                setIsAdmin(response.data.role === 'ADMIN');
                setUserRole(response.data.role)
                localStorage.setItem("userRole", response.data.role);
            })
            .catch(() => setIsAuthenticated(false));
    }, []);

    if (isAuthenticated === null) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/" />; 
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/welcome" />;
    }

    return (
        <>
        <div id="wrapper">
            <TopBar />
            <div className="content-page">
                <Outlet />
            </div>
        </div>
    </>
    );
};

export default ProtectedRoute;
