import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import axios from "axios";
import expect from "expect";

jest.mock("axios");

describe("App Component", () => {
  test("renders the app correctly", async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Login")).toBeInTheDocument();
    });
  });
});