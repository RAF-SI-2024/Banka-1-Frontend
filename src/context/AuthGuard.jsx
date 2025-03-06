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
        const isEmployed = decodedToken.isEmployed || false; // true -> Employee, false -> Customer
        const isAdmin = decodedToken.isAdmin || false; // Boolean
        const userPosition = decodedToken.position || null; // "WORKER", "MANAGER", "DIRECTOR", "HR", "NONE"

        console.log("User employed:", isEmployed, "Admin status:", isAdmin, "Position:", userPosition);

        // If User is Employed, we check allowedPositions
        if (isEmployed) {

            // If User is Admin & Route is for Admin => Accept
            if (isAdmin && allowedPositions.includes("ADMIN")) {
                return children;
            }

            // If User is among Users who can access => Accept
            if (userPosition && allowedPositions.includes(userPosition)) {
                return children;
            }

            // If Employee tries to access any page that is only for Customers
            // If Not Admin Employee tries to access any page that is only for Admin
            return <Navigate to="/home" replace />;
        }


        // User is Customer & allowedPositions is empty (not public route)
        if (!isEmployed && (!allowedPositions || allowedPositions.length === 0)) {
            return children;
        }

        // If Customer tries to access any page that is only for Employees
        return <Navigate to="/home" replace />;

    } catch (error) {
        console.error("Invalid token", error);
        return <Navigate to="/home" replace />;
    }
};

export default AuthGuard;
