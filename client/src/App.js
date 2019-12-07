import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import './App.css';
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import MenuBar from "./components/menuBar";
import { Container } from 'semantic-ui-react'

function App() {
  return (
    <Router>
      <Container>
        <MenuBar/>
        <Route exact path="/" component= {Home}/>
        <Route exact path="/login" component= {Login}/>
        <Route exact path="/register" component= {Register}/>
      </Container>
    </Router>
  );
}

export default App;
