import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from "@mui/material";


import Sidebar from "../../components/mainComponents/Sidebar";
import {fetchAllRecipientsForUser, getUserIdFromToken} from "../../services/AxiosBanking";

const RecipientOverviewPage = () => {
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    const loadRecipients = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;
      try {
        const data = await fetchAllRecipientsForUser(userId);
        setRecipients(data);
      } catch (error) {
        console.error("Failed to fetch recipients:", error);
      }
    };
    loadRecipients();
  }, []);

  return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Saved Recipients
          </Typography>
          <Paper elevation={3}>
            {recipients.length === 0 ? (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography>No saved recipients found.</Typography>
                </Box>
            ) : (
                <List>
                  {recipients.map((recipient, index) => (
                      <React.Fragment key={recipient.id || index}>
                        <ListItem>
                          <ListItemText
                              primary={recipient.fullName}
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
        </Box>
      </Box>
  );
};

export default RecipientOverviewPage;
