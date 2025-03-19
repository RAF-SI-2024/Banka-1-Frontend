import React, {useEffect, useState} from 'react';
import Navbar from "../../components/mainComponents/Navbar";
import Sidebar from "../../components/mainComponents/Sidebar";
import FastPayments from "../../components/transactionComponents/FastPayments";
import RecentTransactions from "../../components/transactionComponents/RecentTransations";
import {jwtDecode} from "jwt-decode";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import PeopleIcon from "@mui/icons-material/People";
import ListItemText from "@mui/material/ListItemText";


const HomePage = () => {

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);

                setIsAdmin(decodedToken.isAdmin);

                console.log("Set position:", decodedToken.position, "Admin status:", decodedToken.isAdmin, "Employed:", decodedToken.isEmployed);
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    return (
        <div>

            <Sidebar />
            <div style={{ padding: '20px', marginTop: '64px' }}>
                {isAdmin && (
                    <h1>Welcome to the Admin Dashboard</h1>
                )}
                {!isAdmin && (
                    <h1>Welcome to the Employee Dashboard</h1>
                )}

                <p>Please use the sidebar to navigate through different sections.</p>

                {/* Treba dodati ove komponente u Home Page customerov
                <FastPayments />
                <RecentTransactions />
                */}
            </div>
        </div>
    );
};

export default HomePage;