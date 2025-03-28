import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import TopBar from "./components/TopBar";

const ProtectedRoute = ({ adminOnly }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Verify the token with the backend using cookies
        axios.get('http://localhost:5100/api/auth/verify-token', { withCredentials: true })
            .then(response => {
                setIsAuthenticated(true);
                setIsAdmin(response.data.role === 'ADMIN');
            })
            .catch(() => setIsAuthenticated(false));
    }, []);

    if (isAuthenticated === null) return <div>Loading...</div>;

    if (!isAuthenticated) return <Navigate to="/login" />; 

    if (adminOnly && !isAdmin) return <Navigate to="/" />; 

    return (
        <div>
            <TopBar />
            <div className="">
                <Outlet /> 
            </div>
        </div>
    );
};

export default ProtectedRoute;
