import AccountSlider from "../../components/accountComponent/AccountSlider";
import React from "react";


const ClientAccountPortal = () =>{
    return (
        <div>
            <Sidebar/>
            <AccountSlider/>
            {/* druga komponenta koju treba ubaciti*/}
        </div>
    );
};

export default ClientAccountPortal;