import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Products from "./components/Products";
import './App.css';

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" exact element={<Products />} />
      </Routes>
    </>
  )
}

export default App;