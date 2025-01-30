import React, { useState, useEffect } from "react";
import Navigation from "./component/navigation";
import { Header } from "./component/header";
import { Features } from "./component/features";
import { About } from "./component/about";
import { Services } from "./component/services";
import { Gallery } from "./component/gallery";
import { Testimonials } from "./component/testimonials";
// import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import UserAccount from "./components/UserAccount";
import Home from "./components/Home";
import SignOut from "./components/SignOut";
import { Team } from "./component/Team";
import { Contact } from "./component/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";
// import "./style.css";

import { Router } from "react-router-dom";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  const [loggedIn, setLoggedIn] = useState(false); // Example state for loggedIn
  const [account, setAccount] = useState(null); // Example state for account
  const [web3, setWeb3] = useState(null); // Example state for web3

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <div>
      <Navigation />
      <Header data={landingPageData.Header} />
      <Features data={landingPageData.Features} />
      <About data={landingPageData.About} />
      <Services data={landingPageData.Services} />
      <Gallery data={landingPageData.Gallery} />
      <Testimonials data={landingPageData.Testimonials} />
      <Team data={landingPageData.Team} />
      <Contact data={landingPageData.Contact} />
      
      
    </div>
  );
};

export default App;
