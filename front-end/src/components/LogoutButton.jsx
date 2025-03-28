/* import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:5100/api/auth/logout", {}, { withCredentials: true });
            toast.success("Logged out successfully!");
            navigate("/login"); 
        } catch (error) {
            toast.error("Error logging out!");
            console.error("Logout failed:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-500 transition"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
 */