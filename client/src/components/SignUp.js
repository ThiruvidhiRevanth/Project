// import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import { Form, Button, Card, Message } from 'semantic-ui-react';
// import AuthenticationHash from '../utils/AuthenticationHash';
// import "../App.css";

// class SignUp extends Component {
//     state = {
//         username: '',
//         password: '',
//         digicode: '',
//         alertMessage: '',
//         status: '',
//         signedUp: false
//     }

//     onSignUp = async () => {
//         //this.setState({ signedUp: false });

//         if (this.state.username !== '' && this.state.password !== '' && this.state.digicode !== '') {
//             let username = this.state.username.trim();
//             let password = this.state.password.trim();
//             let digicode = this.state.digicode.trim();

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

//                 if (userAddress !== '0x0000000000000000000000000000000000000000') {
//                     this.setState({
//                         alertMessage: 'this account already exists',
//                         status: 'failed',
//                         username: '',
//                         password: '',
//                         digicode: '',
//                     });

//                     return;
//                 } else {
//                     let hash = await AuthenticationHash(username, this.props.account, password, digicode, this.props.web3);

//                     await this.props.contract.methods.register(hash).send({ from: this.props.account });

//                     this.setState({
//                         username: '',
//                         password: '',
//                         digicode: '',
//                         status: 'success',
//                         alertMessage: "Signup successful",
//                         signedUp: true
//                     });

//                     this.props.accountCreated(this.state.signedUp);
//                     return;
//                 }
//             }
//         }

//     }

//     render() {
//         return (
//             <div className="sign-up">
                
//                 <div className='signup-form'>
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
//                                 <Form.Field>
                                   
//                                     <input
//                                         required
//                                         type='text'
//                                         placeholder='username'
//                                         value={this.state.username}
//                                         autoComplete="username"
//                                         onChange={e => this.setState({ username: e.target.value })}
//                                     />
//                                 </Form.Field>
//                                 <Form.Field>
//                                     <input
//                                         required
//                                         type='password'
//                                         placeholder='password'
//                                         value={this.state.password}
//                                         autoComplete="current-password"
//                                         onChange={e => this.setState({ password: e.target.value })}
//                                     />
//                                 </Form.Field>
//                                 <Form.Field>
//                                     <input
//                                         required
//                                         type='text'
//                                         placeholder='6 digit code'
//                                         value={this.state.digicode}
//                                         autoComplete="digicode"
//                                         onChange={e => this.setState({ digicode: e.target.value })}
//                                     />
//                                 </Form.Field>
//                                 <Form.Field>
//                                     <Button type='submit' primary fluid size='large' onClick={this.onSignUp}>
//                                         Create account
//                                     </Button>
//                                 </Form.Field>
//                             </Form>
//                         </Card.Content>
//                     </Card>
//                     <div className="signin-onUp">
//                         Already have an account? <Link to='/sign-in'>Sign in</Link>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }

// export default SignUp


import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Message, Loader, Dimmer } from 'semantic-ui-react';
import Web3 from 'web3';
import AuthenticationHash from '../utils/AuthenticationHash';
import "../App.css";

const AUTH_CONTRACT_ABI = [
    [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
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
        },
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
        }
    ]
];
const AUTH_CONTRACT_ADDRESS = "0xDed3822e2cD77e162d121c4F79be2BA7A27Db751";

class SignUp extends Component {
    state = {
        username: '',
        password: '',
        digicode: '',
        alertMessage: '',
        status: '',
        signedUp: false,
        web3: null,
        contract: null,
        account: '',
        loading: false,
    };

    async componentDidMount() {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            const contract = new web3.eth.Contract(AUTH_CONTRACT_ABI, AUTH_CONTRACT_ADDRESS);

            this.setState({ web3, contract, account });
        } else {
            alert("Please install MetaMask!");
        }
    }

    onSignUp = async () => {
        const { username, password, digicode, contract, account, web3 } = this.state;

        if (!username || !password || !digicode) {
            this.setState({ alertMessage: 'Please fill in all fields.', status: 'failed' });
            return;
        }

        if (password.length < 8) {
            this.setState({ alertMessage: 'Password must be at least 8 characters.', status: 'failed' });
            return;
        }

        if (digicode.length !== 6) {
            this.setState({ alertMessage: 'Digicode must be 6 digits.', status: 'failed' });
            return;
        }

        this.setState({ loading: true });

        try {
            const userAddress = await contract.methods.getUserAddress().call({ from: account });

            if (userAddress !== '0x0000000000000000000000000000000000000000') {
                this.setState({ alertMessage: 'This account is already registered.', status: 'failed', loading: false });
                return;
            }

            const hash = await AuthenticationHash(username, account, password, digicode, web3);

            await contract.methods.register(hash).send({ from: account });

            this.setState({
                username: '',
                password: '',
                digicode: '',
                status: 'success',
                alertMessage: 'Signup successful',
                signedUp: true,
                loading: false,
            });

            this.props.accountCreated(true);
        } catch (error) {
            console.error("Error registering user:", error);
            this.setState({ alertMessage: 'Error registering user.', status: 'failed', loading: false });
        }
    };

    render() {
        const { username, password, digicode, alertMessage, status, loading } = this.state;

        return (
            <div className="sign-up">
                <div className='signup-form'>
                <div className="signin-onUp">Create Your Account</div>
                    <Card fluid centered>
                        <Card.Content>
                            <Form size='large'>
                                {alertMessage && (
                                    <Message negative={status === 'failed'} positive={status === 'success'}>
                                        {alertMessage}
                                    </Message>
                                )}
                                <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='Username'
                                        value={username}
                                        onChange={(e) => this.setState({ username: e.target.value.trim() })}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <input
                                        type='password'
                                        placeholder='Password'
                                        value={password}
                                        onChange={(e) => this.setState({ password: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                    <input
                                        type='text'
                                        placeholder='6 digit code'
                                        value={digicode}
                                        onChange={(e) => this.setState({ digicode: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Button type='submit' primary fluid size='large' onClick={this.onSignUp} disabled={loading}>
                                        {loading ? 'Creating account...' : 'Create account'}
                                    </Button>
                                </Form.Field>
                            </Form>
                            {loading && (
                                <Dimmer active>
                                    <Loader>Processing...</Loader>
                                </Dimmer>
                            )}
                        </Card.Content>
                    </Card>
                    <div className="signin-onUp">
                        Already have an account? <Link to='/sign-in'>Sign in</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUp;
