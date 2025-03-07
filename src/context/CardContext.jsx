
import React, { createContext, useContext, useState } from "react";
import { fetchUserCards, createCard, changeCardName, changeCardLimit, updateCardStatus } from "../services/AxiosBanking.js";

const CardContext = createContext();

export const CardProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cards from the API
  const fetchCards = async (accountId) => {
    setLoading(true);
    try {
      const data = await fetchUserCards(accountId);
      setCards(data);
    } catch (error) {
      if (error.response.status === 404) {
      } else {
        console.error("Error fetching cards:", {error});
      }
    }
    setLoading(false);
  };

  // Add a new card
  const addCard = async (accountId, cardType, cardBrand) => {
    setLoading(true);
    try {
      await createCard(accountId, cardType, cardBrand);
      await fetchCards(accountId);
    } catch (error) {
      // ignore not found errors
      if (error.response.status === 404) {
      } else {
        console.error("Error creating card:", error);
      }
    }
    setLoading(false);
  };

  // Update card name
  const updateCardName = async (cardId, newName) => {
    setLoading(true);
    try {
      await changeCardName(cardId, newName);
      setCards((prev) =>
        prev.map((card) => (card.id === cardId ? { ...card, name: newName } : card))
      );
    } catch (error) {
      console.error("Error updating card name:", error);
    }
    setLoading(false);
  };

  // Update card limit
  const updateCardLimit = async (cardId, newLimit) => {
    setLoading(true);
    try {
      await changeCardLimit(cardId, newLimit);
      setCards((prev) =>
        prev.map((card) => (card.id === cardId ? { ...card, limit: newLimit } : card))
      );
    } catch (error) {
      console.error("Error updating card limit:", error);
    }
    setLoading(false);
  };

  // Block or unblock a card
  const updateStatus = async (cardId, status) => {
    setLoading(true);
    try {
      await updateCardStatus(cardId, status);
      setCards((prev) =>
        prev.map((card) => (card.id === cardId ? { ...card, status } : card))
      );
    } catch (error) {
      console.error("Error updating card status:", error);
    }
    setLoading(false);
  };

  return (
    <CardContext.Provider value={{ cards, fetchCards, addCard, updateCardName, updateCardLimit, updateStatus, loading }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCards = () => useContext(CardContext);

