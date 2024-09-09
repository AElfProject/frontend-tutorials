import { Routes, Route } from "react-router-dom";

import "./App.css";
import CreateProposal from "./CreateProposal";
import HomeDAO from "./HomeDAO";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeDAO />}></Route>
      <Route path="/create-proposal" element={<CreateProposal />}></Route>
    </Routes>
  );
};

export default App;
