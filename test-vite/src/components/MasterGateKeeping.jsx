import { Navigate } from "react-router";
import { useAuth } from "@/context/auth-context";

export const MasterGateKeeping = ( { children, allow }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }
    // if(!user || user.role !== 'admin'){
    //     /**
    //      * TODO
    //      * MAKE FORBIDDEN PAGE
    //      */
    //     return <Navigate to="/" />;
    // }

    if(!user) return <Navigate to ="/" replace/>

    if(!allow.includes(user.role)){
        return  <Navigate to="/app/forbidden" />
    }
    return children;
}