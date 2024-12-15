// import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import { Form, Button, Card, Message } from 'semantic-ui-react';
// import AuthValidation from '../utils/AuthValidation';
// import "../App.css";

// class SignIn extends Component {
//     state = {
//         username: '',
//         password: '',
//         digicode: '',
//         alertMessage: '',
//         status: '',
//         loggedIn: false
//     }

//     onSignIn = async () => {

//         if (this.state.username !== '' && this.state.password !== '' && this.state.digicode !== '') {
//             let username = this.state.username.trim();
//             let password = this.state.password.trim();
//             let digicode = this.state.digicode.trim();

//             let usernameToSend = username;

//             //===
//             if (password.length < 8) {
//                 this.setState({
//                     alertMessage: "at least 8 characters for password",
//                     status: 'failed',
//                     password: '',
//                     digicode: '',
//                 });
//                 return;
//             } else {

//             } if (digicode.length !== 6) {
//                 this.setState({
//                     alertMessage: "6 digit required for digicode",
//                     status: 'failed',
//                     digicode: ''
//                 });
//                 return
//             } else {
//                 let userAddress = await this.props.contract.methods.getUserAddress()
//                     .call({ from: this.props.account });

//                 if (userAddress === '0x0000000000000000000000000000000000000000') {
//                     this.setState({
//                         alertMessage: 'Account does not exists',
//                         status: 'failed',
//                         username: '',
//                         password: '',
//                         digicode: '',
//                     });
//                     return;
//                 } else {
//                     let validated = await
//                         AuthValidation(
//                             username,
//                             this.props.account,
//                             password, digicode,
//                             this.props.web3,
//                             this.props.contract
//                         );

//                     if (!validated) {
//                         this.setState({
//                             alertMessage: 'Incorrect log in',
//                             status: 'failed',
//                             username: '',
//                             password: '',
//                             digicode: '',
//                         });
//                         return
//                     } else {
//                         this.setState({
//                             username: '',
//                             password: '',
//                             digicode: '',
//                             status: 'success',
//                             alertMessage: "Sign in successful",
//                             loggedIn: true
//                         });

//                         this.props.userSignedIn(
//                             this.state.loggedIn,
//                             usernameToSend
//                         );

//                         return;
//                     }
//                 }
//             }
//         }


//         this.setState({
//             username: '',
//             password: '',
//             digicode: ''
//         })
//     }
//     render() {
//         return (
//             <div className="sign-up">
             
//                 <div className='signup-form'>
//                 <div className="signin-onUp">
//                 Login Into Your Account</div>
//                     <Card fluid centered>
//                         <Card.Content>
//                             <Form size='large'>
//                                 {
//                                     this.state.alertMessage !== '' && this.state.status === 'failed' ?
//                                         <Message negative>
//                                             {this.state.alertMessage}
//                                         </Message> :
//                                         this.state.alertMessage !== '' && this.state.status === 'success' ?
//                                             <Message positive>
//                                                 {this.state.alertMessage}
//                                             </Message> :
//                                             console.log('')
//                                 }
//                                 <Form.Field required>
//                                     <input
//                                         type='text'
//                                         placeholder='username'
//                                         value={this.state.username}
//                                         autoComplete="username"
//                                         onChange={e => this.setState({ username: e.target.value })}
//                                     />
//                                 </Form.Field>
//                                 <Form.Field required>
//                                     <input
//                                         type='password'
//                                         placeholder='password'
//                                         value={this.state.password}
//                                         autoComplete="current-password"
//                                         onChange={e => this.setState({ password: e.target.value })}
//                                     />
//                                 </Form.Field>
//                                 <Form.Field required>
//                                     <input
//                                         type='text'
//                                         placeholder='6 digit code'
//                                         value={this.state.digicode}
//                                         autoComplete="digicode"
//                                         onChange={e => this.setState({ digicode: e.target.value })}
//                                     />
//                                 </Form.Field>
//                                 <Form.Field>
//                                     <Button type='submit' primary fluid size='large' onClick={this.onSignIn}>
//                                         Sign in
//                                     </Button>
//                                 </Form.Field>

//                             </Form>
//                         </Card.Content>
//                     </Card>
//                     {
//                         this.props.signedUp ?
//                             console.log() :
//                             <div className="signin-onUp">
//                                 Don't have an account? <Link to='/sign-up'>Sign up</Link>
//                             </div>
//                     }
//                 </div>
//             </div>
//         );
//     }
// }

// export default SignIn

import React, { Component } from 'react';
import Web3 from 'web3';  // Import Web3.js
import { Button, Card, Form, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import "../App.css";

// Make sure to set your contract ABI and deployed contract address
const AUTH_CONTRACT_ABI = [ [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_signature",
				"type": "string"
			}
		],
		"name": "register",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "unregister",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_newSignature",
				"type": "string"
			}
		],
		"name": "updateSignature",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "UserDeleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "signatureHash",
				"type": "string"
			}
		],
		"name": "UserRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "newSignatureHash",
				"type": "string"
			}
		],
		"name": "UserUpdated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getSignatureHash",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getUserAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nbOfUsers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] ];
const AUTH_CONTRACT_ADDRESS = "0xDed3822e2cD77e162d121c4F79be2BA7A27Db751"; // Replace with your deployed contract address

class SignIn extends Component {
    state = {
        username: '',
        password: '',
        digicode: '',
        alertMessage: '',
        status: '',
        loggedIn: false,
        web3: null,
        contract: null,
        account: ''
    }

    // Set up Web3 and Contract in componentDidMount
    async componentDidMount() {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];

            // Create contract instance
            const contract = new web3.eth.Contract(AUTH_CONTRACT_ABI, AUTH_CONTRACT_ADDRESS);

            this.setState({ web3, contract, account });
        } else {
            alert("Please install MetaMask!");
        }
    }

    // Fetch user address from the contract
    getUserAddress = async () => {
        try {
            const userAddress = await this.state.contract.methods.getUserAddress().call({ from: this.state.account });
            if (userAddress === '0x0000000000000000000000000000000000000000') {
                this.setState({
                    alertMessage: 'Account does not exist.',
                    status: 'failed',
                    username: '',
                    password: '',
                    digicode: '',
                });
            } else {
                this.setState({
                    alertMessage: `User address found: ${userAddress}`,
                    status: 'success',
                });
            }
        } catch (error) {
            this.setState({
                alertMessage: 'Error fetching user address.',
                status: 'failed',
            });
        }
    }

    // Fetch user signature hash from the contract
    getSignatureHash = async () => {
        try {
            const signatureHash = await this.state.contract.methods.getSignatureHash().call({ from: this.state.account });
            this.setState({
                alertMessage: `Signature hash: ${signatureHash}`,
                status: 'success',
            });
        } catch (error) {
            this.setState({
                alertMessage: 'Error fetching signature hash.',
                status: 'failed',
            });
        }
    }

    // Register a new user
    registerUser = async () => {
        const { username, password, digicode } = this.state;

        if (username && password && digicode) {
            const signature = `${username}-${password}-${digicode}`; 

            try {
                await this.state.contract.methods.register(signature).send({ from: this.state.account });
                this.setState({
                    alertMessage: 'User registered successfully!',
                    status: 'success',
                });
            } catch (error) {
                this.setState({
                    alertMessage: 'Error registering user.',
                    status: 'failed',
                });
            }
        } else {
            this.setState({
                alertMessage: 'Please fill in all fields.',
                status: 'failed',
            });
        }
    }

    // Update the signature hash for the user
    updateSignature = async () => {
        const { password, digicode } = this.state;
        if (password && digicode) {
            const newSignature = `${password}-${digicode}`;  // Update signature with new password & digicode

            try {
                await this.state.contract.methods.updateSignature(newSignature).send({ from: this.state.account });
                this.setState({
                    alertMessage: 'Signature updated successfully!',
                    status: 'success',
                });
            } catch (error) {
                this.setState({
                    alertMessage: 'Error updating signature.',
                    status: 'failed',
                });
            }
        } else {
            this.setState({
                alertMessage: 'Please fill in both password and digicode.',
                status: 'failed',
            });
        }
    }

    // Sign in user and validate (you can modify this part for your own validation logic)
    onSignIn = async () => {
        const { username, password, digicode } = this.state;

        if (username && password && digicode) {
            const signature = `${username}-${password}-${digicode}`;

            try {
                const validated = await this.state.contract.methods.getSignatureHash().call({ from: this.state.account });

                if (validated === signature) {
                    this.setState({
                        alertMessage: 'Sign-in successful!',
                        status: 'success',
                        loggedIn: true,
                    });
                    // Call any action after successful login
                    this.props.userSignedIn(this.state.loggedIn, username);
                } else {
                    this.setState({
                        alertMessage: 'Incorrect login details.',
                        status: 'failed',
                    });
                }
            } catch (error) {
                this.setState({
                    alertMessage: 'Error during sign-in.',
                    status: 'failed',
                });
            }
        } else {
            this.setState({
                alertMessage: 'Please fill in all fields.',
                status: 'failed',
            });
        }
    }

    render() {
        return (
            <div className="sign-up">
                <div className='signup-form'>
                    <div className="signin-onUp">Login Into Your Account</div>
                    <Card fluid centered>
                        <Card.Content>
                            <Form size='large'>
                                {this.state.alertMessage && (
                                    <Message negative={this.state.status === 'failed'} positive={this.state.status === 'success'}>
                                        {this.state.alertMessage}
                                    </Message>
                                )}
                                <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='Username'
                                        value={this.state.username}
                                        onChange={e => this.setState({ username: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <input
                                        type='password'
                                        placeholder='Password'
                                        value={this.state.password}
                                        onChange={e => this.setState({ password: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='6 Digit Code'
                                        value={this.state.digicode}
                                        onChange={e => this.setState({ digicode: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Button primary fluid size='large' onClick={this.onSignIn}>
                                        Sign In
                                    </Button>
                                </Form.Field>
                                
                            </Form>
                        </Card.Content>
                    </Card>
                    <div className="signin-onUp">
                        Don't have an account? <Link to='/sign-up'>Sign up</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignIn;
