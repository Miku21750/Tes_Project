import { Navigate } from "react-router";
import App from "@/App";
import { useAuth } from "@/context/auth-context";

export const GateKeepingRouting = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }

    if(!user) {
        return <Navigate to="/lorem" replace />
    }

    return <App />
}