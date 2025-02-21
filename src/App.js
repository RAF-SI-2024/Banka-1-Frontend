import logo from "./logo.svg";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </div>
  );
}

export default App;
