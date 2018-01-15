import React, { Component } from 'react';
import { firebaseApp } from '../firebase';
import { Link } from 'react-router';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: {
                message: ''
            }
        };
    }
    
    signIn() {
        console.log('this.state', this.state);
        const { email, password } = this.state;
        firebaseApp.auth().signInWithEmailAndPassword(email, password)
            .catch(error => {
                console.log('error', error);
                this.setState({error})
            });
    }
    
    render() {
        return (
        <div className="form-inline" style={{margin: '5%'}}>
            <h2>Sign In</h2>
            <div className="form-group">
                <input
                    className="form-control"
                    type="text"
                    style={{marginRight: '5px'}}
                    placeholder="email"
                    onChange={event => this.setState({email: event.target.value})}
                />
                <input
                    className="form-control"
                    type="password"
                    style={{marginRight: '5px'}}
                    placeholder="password"
                    onChange={event => this.setState({password: event.target.value})}
                />
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => this.signIn()}
                > 
                    Sign In
                </button>
            </div>
            <div>{this.state.error.message}</div>
            <div><Link to={'/signup'}>Sign up instead</Link></div>
        </div>
     );
    }
}

export default SignIn;