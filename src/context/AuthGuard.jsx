import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthGuard = ({ allowedPositions, children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const userPosition = decodedToken.position; // "Direktor", "Menadžer", "Radnik", "HR", "Nijedna"
                                                    // From Backend
        const isAdmin = decodedToken.isAdmin; // Boolean

        console.log("User position:", userPosition, "Admin status:", isAdmin);

        // If User Is Admin & Route Is For Admin => Accept
        if (allowedPositions.includes("Admin") && isAdmin) {
            return children;
        }

        // If User Is Among Users Who Can Access => Accept
        if (allowedPositions.includes(userPosition)) {
            return children;
        }

        // If User Doesn't Have Approval => Take User To Home Page
        return <Navigate to="/home" replace />;
    } catch (error) {
        console.error("Invalid token", error);
        return <Navigate to="/login" replace />;
    }
};

export default AuthGuard;
