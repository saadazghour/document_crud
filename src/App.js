import "./App.css";
import { Route, Routes } from "react-router-dom";
import AddDoc from "./components/AddDoc";
import UpdateDoc from "./components/UpdateDoc";
import ReadDoc from "./components/ReadDoc";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ReadDoc />}></Route>
        <Route path="/add" element={<AddDoc />}></Route>
        <Route path="/update/:id" element={<UpdateDoc />}></Route>
      </Routes>
    </div>
  );
}

export default App;
