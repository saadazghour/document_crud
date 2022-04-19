import "./App.css";
import { Route, Routes } from "react-router-dom";
import AddDoc from "./components/AddDoc";
import UpdateDoc from "./components/UpdateDoc";
import ReadDoc from "./components/ReadDoc";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/review" element={<ReadDoc />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/" element={<Login />}></Route>
        <Route path="/add" element={<AddDoc />}></Route>
        <Route path="/update/:id" element={<UpdateDoc />}></Route>
      </Routes>
    </div>
  );
}

export default App;
