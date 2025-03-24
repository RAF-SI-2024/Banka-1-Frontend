import React, { useEffect, useState } from 'react';
import Sidebar from "../../components/mainComponents/Sidebar";
import { jwtDecode } from "jwt-decode";

const HomePage = () => {
    const [roleMessage, setRoleMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const isAdmin = decodedToken.isAdmin;
                const isEmployed = decodedToken.isEmployed;
                const department = decodedToken.department || null;

                if (isAdmin) {
                    setRoleMessage("Welcome to the Admin Dashboard");
                } else if (isEmployed && department === "SUPERVISOR") {
                    setRoleMessage("Welcome to the Supervisor Dashboard");
                } else if (isEmployed && department === "AGENT") {
                    setRoleMessage("Welcome to the Agent Dashboard");
                } else if (isEmployed && department !== "AGENT" && department !== "SUPERVISOR") {
                    setRoleMessage("Welcome to the Employee Dashboard");
                } else {
                    setRoleMessage("Unauthorized Access");
                }

            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    return (
        <div>
            <Sidebar />
            <div style={{ padding: '20px', marginTop: '64px' }}>
                <h1>{roleMessage}</h1>
                <p>Please use the sidebar to navigate through different sections.</p>
            </div>
        </div>
    );
};

export default HomePage;
