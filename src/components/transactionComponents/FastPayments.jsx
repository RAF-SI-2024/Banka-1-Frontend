import React, {useEffect, useState} from "react";
import { Button, Box, Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddFastPayment from "./AddFastPayment";
import {
    createRecipient,
    fetchRecipientsForFast,
    getUserIdFromToken
} from "../../services/AxiosBanking";



const FastPayments = () => {

    //state za modal, state za novu osobu za brzo placanje,
    // state za upravljanje osobama za brzo placanje, poruka za error
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [recipient, setRecipient] = useState({ name: "", accountNumber: "" });
    const [recipientList, setRecipientList] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = getUserIdFromToken();
        if (userId) {
            const fetchRecipients1 = async () => {
                try {
                    setLoading(true);
                    const data = await fetchRecipientsForFast(userId);
                    console.log(data);
                    setRecipientList(data || []);
                } catch {
                    setError("Failed to load recipients.");
                } finally {
                    setLoading(false);
                }
            };
            fetchRecipients1();
        } else {
            setError("User ID not found.");
            setLoading(false);
        }
    }, []);


    // Funkcija za dodavanje novog primaoca, imitira API POST poziv,
    // dodaje primaoca u listu,
    // zatvara modal, cisti unos
    const handleAddRecipient = async () => {
        if (!recipient.name || !recipient.accountNumber) {
            setError("Both fields must be filled.");
            return;
        }

        const userId = getUserIdFromToken();
        if (!userId) {
            setError("User ID not found.");
            return;
        }

        const newRecipient = {
            ownerAccountId: userId,  // Dinamički podatak
            accountNumber: recipient.accountNumber,
            fullName: recipient.name
        };

        try {

            await createRecipient(userId, newRecipient);

            const updatedRecipients = await fetchRecipientsForFast(userId);


            setRecipientList(updatedRecipients);



            // Resetuj formu
            setOpenModal(false);
            setRecipient({ name: "", accountNumber: "" });
            setError("");


        } catch (err) {
            setError("Failed to add recipient.");
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
                        onClick={() => navigate("/new-payment-portal", { state: { recipient } })}
                    >
                        {recipient.firstName}{recipient.lastName}
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

