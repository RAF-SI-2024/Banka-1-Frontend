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
        const isAdmin = decodedToken.isAdmin || false; // Boolean
        const userDepartment = decodedToken.department || null; // "SUPERVISOR", "AGENT"
        const userPosition = decodedToken.position || null; // "WORKER", "MANAGER", "DIRECTOR", "HR", "ADMIN", "NONE"

        // Determine if the user is employee based on department or position
        const isEmployed = userDepartment !== null || (userPosition && userPosition !== "NONE");
        const isCustomer = !isEmployed; // If not employed, must be a customer

        console.log(
            "User Department:", userDepartment,
            "User Position:", userPosition,
            "User Employed:", isEmployed,
            "User Admin:", isAdmin
        );

        // Public pages
        if (!allowedPositions || allowedPositions.length === 0) {
            return children;
        }

        // If the user is Employee, check department first
        if (isEmployed) {


            //  If user has a department, check department-level permissions
            if (userDepartment && allowedPositions.includes(userDepartment)) {
                return children;
            }

            // If department is not agent or supervisor, check position instead
            if (!userDepartment && allowedPositions.includes(userPosition)) {
                return children;
            }

            // If the route is for Admin only
            if (isAdmin && allowedPositions.includes("ADMIN")) {
                return children;
            }

            // If the employee tries to access customer-only page
            if (allowedPositions.includes("NONE")) {
                return <Navigate to="/employee-home" replace />;
            }
            // if (isAdmin) {
            //     return children;
            // }
            return <Navigate to="/employee-home" replace />;
        }

        // If the user is Customer (position is NONE)
        if (isCustomer) {

            // If trying to access Employee-only page, deny access
            if (allowedPositions.some(pos => ["WORKER", "MANAGER", "DIRECTOR", "HR", "ADMIN"].includes(pos))) {
                return <Navigate to="/customer-home" replace />;
            }

            // Otherwise, allow access
            return children;
        }

        // If User is not Employee and is not Customer
        return <Navigate to="/login" replace />;
    } catch (error) {
        console.error("Invalid token", error);

        try {
            const decodedToken = jwtDecode(token);
            const isEmployed = decodedToken.department !== null || (decodedToken.position && decodedToken.position !== "NONE");

            // Remote User to home page if he tries to access page that is forbidden
            return isEmployed ? <Navigate to="/employee-home" replace /> : <Navigate to="/customer-home" replace />;
        } catch {

            // Token totally invalid, login again
            return <Navigate to="/login" replace />;
        }
    }
};

export default AuthGuard;
