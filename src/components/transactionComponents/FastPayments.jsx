import React, {useEffect, useState} from "react";
import { Button, Box, Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddFastPayment from "./AddFastPayment";
import {addFastPaymentPerson, getFastPaymentPersons} from "../../services/TansactionService";



const FastPayments = () => {

    //state za modal, state za novu osobu za brzo placanje,
    // state za upravljanje osobama za brzo placanje, poruka za error
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [recipient, setRecipient] = useState({ name: "", accountNumber: "" });
    const [recipientList, setRecipientList] = useState([]);
    const [error, setError] = useState("");

    // Učitavanje mockovanih podataka sa API-ja, nema rute i dalje
    useEffect(() => {
        const fetchRecipients = async () => {
            const data = await getFastPaymentPersons();
            setRecipientList(data);
        };
        fetchRecipients();
    }, []);


    // Funkcija za dodavanje novog primaoca, imitira API POST poziv,
    // dodaje primaoca u listu,
    // zatvara modal, cisti unos
    const handleAddRecipient = async () => {
        if (!recipient.name || !recipient.accountNumber) {
            setError("Both fields must be filled.");
            return;
        }

        try {
            const newRecipient = await addFastPaymentPerson(recipient);
            setRecipientList([...recipientList, newRecipient]);
            setOpenModal(false);
            setRecipient({ name: "", accountNumber: "" });
            setError("");
        } catch (err) {
            setError(err);
        }
    };



    return (
        <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Fast Payments
            </Typography>

            {/* Lista osoba za brzo placanje */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                {recipientList.map((recipient, index) => (
                    <Button
                        key={index}
                        variant="contained"
                        sx={{ marginRight: 1 }}
                        //ovde kad se klikne treba da se otvori stranica za placanje sa datim
                        onClick={() => navigate("./pages/portal/NewPaymentPortal", { state: { recipient } })}
                    >
                        {recipient.name}
                    </Button>
                ))}




                {/* Dugme za dodavanje novog primaoca, otvara modal */}
                <Button variant="outlined" onClick={() => setOpenModal(true)}>
                    Add New Recipient
                </Button>
            </Box>

            {/* Pozivanje modalne komponente */}
            <AddFastPayment
                open={openModal}
                onClose={() => setOpenModal(false)}
                onAddRecipient={handleAddRecipient}
                recipient={recipient}
                setRecipient={setRecipient}
                error={error}
            />







        </Box>
    );
};

export default FastPayments;

