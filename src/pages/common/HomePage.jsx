import React from 'react';
import Navbar from "../../components/mainComponents/Navbar";
import Sidebar from "../../components/mainComponents/Sidebar";
import FastPayments from "../../components/transactionComponents/FastPayments";
import RecentTransactions from "../../components/transactionComponents/RecentTransations";

const HomePage = () => {
    return (
        <div>

            <Sidebar />
            <div style={{ padding: '20px', marginTop: '64px' }}>
                <h1>Welcome to the Admin Dashboard</h1>
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