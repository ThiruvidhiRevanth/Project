import React, { Component } from "react";
import web3Connection from '../web3Connection';
import Contract from '../Contract';
import Formate from '../utils/Formate';
import 'semantic-ui-css/semantic.min.css';
import { Menu, Button } from "semantic-ui-react";
import Home from '../components/Home';
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import SignOut from "../components/SignOut";
import UserAccount from '../components/UserAccount';
import "../App.css";
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';

class Navigation extends Component {
  state = {
    web3: null,
    account: null,
    contract: null,
    balance: null,
    activeItem: 'home', // default active item
    signedUp: false,
    loggedIn: false,
    color: "blue",
    username: '',
    isNavVisible: true,  // default visibility
  };

  // Handle menu item clicks and manage active item and nav visibility
  handleItemClick = (e, { name }) => {
    let isNavVisible = true;

    // Hide the nav on certain actions like sign-in, sign-up, and sign-out
    if (name === 'sign in' || name === 'sign up' || name === 'sign out' || name === "user account") {
      isNavVisible = false;
    }

    // Save the current active item and nav visibility state to localStorage
    localStorage.setItem('activeItem', name);
    localStorage.setItem('isNavVisible', isNavVisible.toString());

    // Update component state
    this.setState({ activeItem: name, color: 'blue', isNavVisible });
  };

  componentDidMount = async () => {
    try {
      const web3 = await web3Connection();
      const contract = await Contract(web3);
      const accounts = await web3.eth.getAccounts();

      // Retrieve the last active item and nav visibility from localStorage
      const activeItem = localStorage.getItem('activeItem') || 'home';
      const isNavVisible = localStorage.getItem('isNavVisible') === 'true';

      // Check if user is logged in and retrieve the username
      const loggedIn = localStorage.getItem('loggedIn') === 'true';
      const username = localStorage.getItem('username') || '';

      this.setState({
        web3, contract, account: accounts[0], loggedIn, username, activeItem, isNavVisible
      }, this.start);
    } catch (error) {
      console.error("Error during component mount:", error);
    }

    await this.getAccount();
  };
  
  
  getAccount = async () => {
    if (this.state.web3 !== null || this.state.web3 !== undefined) {
      // Listen for account changes in MetaMask
      window.ethereum.on('accountsChanged', async (accounts) => {
        this.setState({
          account: accounts[0],
          loggedIn: false,
        });
  
        // Update balance if needed
        this.state.web3.eth.getBalance(accounts[0], (err, balance) => {
          if (!err) {
            this.setState({ balance: Formate(this.state.web3.utils.fromWei(balance, 'ether')) });
          }
        });
      });
    }
  };
  

  start = async () => {
    await this.getAccount();
    const { web3, contract, account } = this.state;
    console.log("Web3:", web3, "Contract:", contract, "Account:", account);
  };

  getAccount = async () => {
    if (this.state.web3 !== null || this.state.web3 !== undefined) {
      await window.ethereum.on('accountsChanged', async (accounts) => {
        this.setState({
          account: accounts[0],
          loggedIn: false
        });

        this.state.web3.eth.getBalance(accounts[0], (err, balance) => {
          if (!err) {
            this.setState({ balance: Formate(this.state.web3.utils.fromWei(balance, 'ether')) });
          }
        });
      });
    }
  };

  accountCreated = async (signedUp) => {
    this.setState({ signedUp });
  };

  userSignedIn = async (loggedIn, username) => {
    localStorage.setItem('loggedIn', loggedIn);
    localStorage.setItem('username', username);

    this.setState({ loggedIn, username });
  };

  loggedOut = async () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');

    this.setState({ loggedIn: false, username: '' });
  };
 

  render() {
    const { activeItem, color,isNavVisible} = this.state;

    if (!this.state.web3) {
      return <div>Loading...</div>;
    }

    return (
      <>
        <nav id="menu" className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#bs-example-navbar-collapse-1"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>

            <a className="navbar-brand page-scroll" href="#page-top">
            AI Health Predict
            </a>

            <BrowserRouter>
              <div className="home-nav" >
                <Menu stackable inverted secondary size='mini'>
                  <Menu.Item
                    name='home'
                    color={color}
                    className="custom-menu-item"
                    active={activeItem === 'home'}
                    onClick={this.handleItemClick}
                   
                    as={Link}
                    to='/'
                  />
                 {isNavVisible && (
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                      <ul className="nav navbar-nav navbar-right">
                        <li><a href="#features" className="page-scroll">Features</a></li>
                        <li><a href="#about" className="page-scroll">About</a></li>
                        <li><a href="#services" className="page-scroll">Services</a></li>
                        <li><a href="#portfolio" className="page-scroll">Gallery</a></li>
                        <li><a href="#testimonials" className="page-scroll">Testimonials</a></li>
                        <li><a href="#team" className="page-scroll">Team</a></li>
                        <li><a href="#contact" className="page-scroll">Contact</a></li>
                      </ul>
                    </div>
                  )}

                  {this.state.loggedIn ?
                    <Menu.Item 
                      name='user account'
                      color={color } 
                      active={activeItem === 'user account'}
                      className="custom-menu-item"
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/user-account'
                       position='right'
                    />:
                    console.log('')
                  }
                  {!this.state.loggedIn ?
                    <Menu.Item
                      name='sign in'
                      color={color}
                      active={activeItem === 'sign in'}
                      onClick={this.handleItemClick}
                      className="custom-menu-item"
                      as={Link}
                      to='/sign-in'
                       position='right'
                    />:
                    console.log('')
                    
                  }

                  {this.state.loggedIn ? 
                    <Menu.Item
                      name='sign out'
                      color='red'
                       className="custom-menu-item"
                      active={activeItem === 'sign out'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/sign-out'
                       
                    />
                  : (
                    <Menu.Item
                      name='sign up'
                      color={color}
                       className="custom-menu-item"
                      active={activeItem === 'sign up'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/sign-up'
                       
                    />
                  )}
                </Menu>
              </div>

              <Routes>
                <Route exact path='/' element={<Navigate />} />
                <Route
                  path='/user-account'
                  element={this.state.loggedIn ? (
                    <UserAccount
                      account={this.state.account}
                      username={this.state.username}
                    />
                  ) : (
                    <div>You have been logged out</div>
                  )}
                />
                <Route
                  path='/sign-in'
                  element={this.state.loggedIn ? (
                    <Navigate to='/user-account' />
                  ) : (
                    <SignIn
                      web3={this.state.web3}
                      contract={this.state.contract}
                      account={this.state.account}
                      signedUp={this.state.signedUp}
                      userSignedIn={this.userSignedIn}
                    />
                  )}
                />
                <Route
                  path='/sign-out'
                  element={this.state.loggedIn ? (
                    <SignOut loggedOut={this.loggedOut} />
                  ) : (
                    <Navigate to='/sign-in' />
                  )}
                />
                <Route
                  path='/sign-up'
                  element={
                    <SignUp
                      web3={this.state.web3}
                      contract={this.state.contract}
                      account={this.state.account}
                      accountCreated={this.accountCreated}
                    />
                  }
                />
              </Routes>
            </BrowserRouter>
          </div>
        </nav>
      </>
    );
  }
}

export default Navigation; 





