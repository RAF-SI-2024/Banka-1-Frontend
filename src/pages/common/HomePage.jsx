import React from 'react';
import Navbar from "../../components/mainComponents/Navbar";
import Sidebar from "../../components/mainComponents/Sidebar";

const HomePage = () => {
    return (
        <div>

            <Sidebar />
            <div style={{ padding: '20px', marginTop: '64px' }}>
                <h1>Welcome to the Admin Dashboard</h1>
                <p>Please use the sidebar to navigate through different sections.</p>
            </div>
        </div>
    );
};

export default HomePage;