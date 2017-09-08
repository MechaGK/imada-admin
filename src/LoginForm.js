import React, {
    Component
} from 'react';
import './LoginForm.css'
import MessageBox from './MessageBox'

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            message: '',
        };

        this.handleUsernameChanged = this.handleUsernameChanged.bind(this);
        this.handlePasswordChanged = this.handlePasswordChanged.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChanged(event) {
        this.setState({
            username: event.target.value,
        });
    }

    handlePasswordChanged(event) {
        this.setState({
            password: event.target.value,
        });
    }

    async handleSubmit(event) {
        event.preventDefault();

        let result = await this.props.signIn(this.state.username, this.state.password);

        if (result === 'LOGIN_FAILED') {
            this.setState({
                message: 'Failed to sign in',
            });
        }
    }

    render() {
        return ( 
            <div className="LoginForm">
                <MessageBox message={this.state.message} />
                <form onSubmit={this.handleSubmit} >
                    <label>
                        <span>Username</span>
                        <input type="text" value={this.state.username} onChange={this.handleUsernameChanged} />
                    </label>
                    <label>
                        <span>Password</span>
                        <input type="password" value={this.state.password} onChange={this.handlePasswordChanged} />
                    </label>
                    <input type="submit" value="Sign in" />
                </form>
            </div>
        );
    }
}

export default LoginForm;