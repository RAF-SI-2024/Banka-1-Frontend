import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button
} from "@mui/material";
import Sidebar from "../../components/mainComponents/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  fetchAllRecipientsForUser,
  createRecipientt,
  getUserIdFromToken
} from "../../services/AxiosBanking";
import FastPaymentPopup from "../../components/transactionComponents/FastPaymentPopup";

const RecipientOverviewPage = () => {
  const [recipients, setRecipients] = useState([]);
  const [showNewRecipientModal, setShowNewRecipientModal] = useState(false);
  const [newRecipient, setNewRecipient] = useState({
    name: "",
    address: "",
    accountNumber: ""
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loadRecipients = async () => {
    const mockRecipients = [
      {
        id: "mock1",
        firstName: "Ana",
        lastName: "Petrović",
        accountNumber: "123456789012345678",
        address: "Bulevar Kralja Aleksandra 73",
        userId: 101
      },
      {
        id: "mock2",
        firstName: "Marko",
        lastName: "Jovanović",
        accountNumber: "876543210987654321",
        address: "Cara Dušana 25",
        userId: 102
      }
    ];

    setRecipients(mockRecipients);

    // ZA PRAVI FETCH
    /*
    const userId = getUserIdFromToken();
    if (!userId) return;
    try {
      const data = await fetchAllRecipientsForUser(userId);
      setRecipients(data);
    } catch (error) {
      console.error("Failed to fetch recipients:", error);
    }
    */
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  const handleAddRecipient = async () => {
    if (
      !newRecipient.name.trim() ||
      !newRecipient.address.trim() ||
      !newRecipient.accountNumber.trim()
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      await createRecipientt({
        fullName: newRecipient.name,
        address: newRecipient.address,
        accountNumber: newRecipient.accountNumber,
        ownerAccountId: null
      });
      setShowNewRecipientModal(false);
      setNewRecipient({ name: "", address: "", accountNumber: "" });
      setError("");
      loadRecipients();
    } catch (err) {
      console.error("Failed to add recipient:", err);
      setError("Failed to add recipient.");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4, pt: 10 }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5">Saved recipients</Typography>
          <Button
            variant="outlined"
            onClick={() => setShowNewRecipientModal(true)}
            sx={{
              borderColor: "#aab4f8",
              color: "#aab4f8",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "rgba(170, 180, 248, 0.1)",
                borderColor: "#aab4f8",
                color: "#aab4f8"
              },
              textTransform: "none"
            }}
          >
            New recipient
          </Button>
        </Box>

        <Paper elevation={3}>
          {recipients.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography>No saved recipients found.</Typography>
            </Box>
          ) : (
            <List>
              {recipients.map((recipient, index) => (
                <React.Fragment key={recipient.id || index}>
                  <ListItem
                    secondaryAction={
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() =>
                          navigate("/new-payment-portal", {
                            state: { recipient }
                          })
                        }
                      >
                        New Payment
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={`${recipient.firstName} ${recipient.lastName}`}
                      secondary={
                        <>
                          <div>Account Number: {recipient.accountNumber}</div>
                          <div>Address: {recipient.address}</div>
                        </>
                      }
                    />
                  </ListItem>
                  {index < recipients.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>

        <FastPaymentPopup
          open={showNewRecipientModal}
          onClose={() => setShowNewRecipientModal(false)}
          onSave={handleAddRecipient}
          recipient={newRecipient}
          setRecipient={setNewRecipient}
          error={error}
        />
      </Box>
    </Box>
  );
};

export default RecipientOverviewPage;
