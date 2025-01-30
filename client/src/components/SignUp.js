import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthenticationHash from '../utils/AuthenticationHash';
import "../App.css";

class SignUp extends Component {
    state = {
        username: '',
        password: '',
        digicode: '',
        alertMessage: '',
        status: '',
        signedUp: false
    }

    onSignUp = async () => {
        if (this.state.username !== '' && this.state.password !== '' && this.state.digicode !== '') {
            let username = this.state.username.trim();
            let password = this.state.password.trim();
            let digicode = this.state.digicode.trim();

            // Validate password
            if (password.length < 8) {
                this.setState({
                    alertMessage: "Password must be at least 8 characters long.",
                    status: 'failed',
                    password: '',
                    digicode: '',
                });
                return;
            } 

            // Validate digicode
            if (digicode.length !== 6) {
                this.setState({
                    alertMessage: "Digicode must be exactly 6 digits.",
                    status: 'failed',
                    digicode: ''
                });
                return;
            } 

            // Check if the user already exists
            let userAddress = await this.props.contract.methods.getUserAddress()
                .call({ from: this.props.account });

            if (userAddress !== '0x0000000000000000000000000000000000000000') {
                this.setState({
                    alertMessage: 'This account already exists.',
                    status: 'failed',
                    username: '',
                    password: '',
                    digicode: '',
                });
                return;
            } 

            // Hash the user data and send to blockchain
            let hash = await AuthenticationHash(username, this.props.account, password, digicode, this.props.web3);

            await this.props.contract.methods.register(hash).send({ from: this.props.account });

            // Update the state on success
            this.setState({
                username: '',
                password: '',
                digicode: '',
                status: 'success',
                alertMessage: "Signup successful.",
                signedUp: true
            });

            this.props.accountCreated(this.state.signedUp);
            return;
        }

        // If any field is empty
        this.setState({
            alertMessage: "Please fill out all fields.",
            status: 'failed',
        });
    }

    render() {
        return (
            <div className="sign-up">
                <h2 style={{fontFamily: 'Arial', textAlign: 'center'}}>Create an account</h2>
                <div className='signup-form'>
                    <Card fluid centered>
                        <Card.Content>
                            <Form size='large'>
                                {
                                    this.state.alertMessage !== '' && this.state.status === 'failed' ? 
                                        <Message negative>
                                            {this.state.alertMessage}
                                        </Message> : 
                                        this.state.alertMessage !== '' && this.state.status === 'success' ? 
                                            <Message positive>
                                                {this.state.alertMessage}
                                            </Message> : 
                                            null
                                }
                                <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='Username'
                                        value={this.state.username}
                                        autoComplete="username"
                                        onChange={e => this.setState({ username: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='password'
                                        placeholder='Password'
                                        value={this.state.password}
                                        autoComplete="current-password"
                                        onChange={e => this.setState({ password: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='6-digit code'
                                        value={this.state.digicode}
                                        autoComplete="digicode"
                                        onChange={e => this.setState({ digicode: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Button type='button' primary fluid size='large' onClick={this.onSignUp}>
                                        Create account
                                    </Button>
                                </Form.Field>
                            </Form>
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
