import React from 'react';
import Sidebar from "../../components/mainComponents/Sidebar";
import InternalTransferForm from "../../components/transferComponents/InternalTransferForm";
import {jwtDecode} from "jwt-decode";

const InternalTransferPortal = () => {

    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if(!token) return null;
        try{
            const decoded = jwtDecode(token);
            return decoded.id;
        }catch (error){
            console.error("Invalid token", error);
            return null;
        }

    }

    return (
        <div>
            <Sidebar/>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <InternalTransferForm/>
            </div>

        </div>
    );
};

export default InternalTransferPortal;
