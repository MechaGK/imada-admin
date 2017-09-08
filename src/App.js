import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import LoginForm from './LoginForm';
import NumberField from './NumberField';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        signedIn: true && localStorage.getItem('token'),
        users: [],
        fundsToAdd: {},
    };

    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.updateUsers = this.updateUsers.bind(this);
    this.submitFunds = this.submitFunds.bind(this);
    this.editFunds = this.editFunds.bind(this);
  }

  signOut() {
    localStorage.removeItem('token');
    this.setState({
      signedIn: false,
    });
  }

  async signIn(username, password) {
    let serverAddress = 'imada.mechagk.dk:3000';
    let request = await fetch(this.createRequestURL('ImadaUsers/login'), {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          username: username,
          password: password,
      })
    });

    let response = await request.json();

    if (response.error !== undefined) {
      return response.error.code;
    }
    else {
      localStorage.setItem('token', response.id);
      this.setState({
        signedIn: true,
      });
    }

    console.log(response);
    return 'SUCCESS';
  }

  createRequestURL(path) {
    let serverAddress = 'imada.mechagk.dk:3000';
    let baseUrl = `https://${serverAddress}/api`;

    if (!path.startsWith("/")) {
      baseUrl += "/";
    }

    var token = ''
    if (localStorage.getItem('token') !== null) {
      token = `?access_token=${localStorage.getItem('token')}`    
    }

    console.log(baseUrl + path + token);

    return baseUrl + path + token;
  }

  async getUsers() {
    let request = await fetch(this.createRequestURL('ImadaUsers'), {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      }
    });

    let response = await request.json();

    if (response.error !== undefined) {
      return response.error.code;
    }
    else {
      return response;
    }
  }

  async updateUsers() {
    this.setState({
      users: await this.getUsers()
    });
  }

  async submitFunds() {
    console.log(this.state.fundsToAdd);
    for (var key in this.state.fundsToAdd) {
      if (!this.state.fundsToAdd.hasOwnProperty(key)) continue;

      let request = await fetch(this.createRequestURL('ImadaUsers/addFunds'), {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: Number(key),
            amount: this.state.fundsToAdd[key],
        })
      });

      console.log(this.state.fundsToAdd[key] + ' ' + typeof(this.state.fundsToAdd[key]))    

      let response = await request.json();
      
      if (response.error !== undefined) {
        console.log(response);        
        break;
      }

      this.setState({
        fundsToAdd: {},
        users: []
      });

      await this.updateUsers();
    }
  }

  editFunds(userId, amount) {
    console.log(amount);
    const fundsToAdd = this.state.fundsToAdd;

    if (amount !== 0) {
      fundsToAdd[userId] = Number(amount);
    } else {
      delete fundsToAdd[userId];
    }

    this.setState({
      fundsToAdd
    });
  }

  renderUserRow(user) {
    return(
      <tr>
        <td>{user.username}</td>
        <td>{user.balance}</td>
        <td>
          <NumberField user={user.id} onChange={this.editFunds}/></td>
      </tr>
    );
  }

  render() {
    if (!this.state.signedIn) {
      return (
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Imada App admin</h2>
          </div>
          <div className="loginForm">
            <LoginForm signIn={this.signIn}/>
          </div>
        </div>
      );
    } else {
      let rows = [];
      for (var i=0; i<this.state.users.length; i++) {
        rows.push(this.renderUserRow(this.state.users[i]))
      }

      return (
        <div className="App">
          <p>
            Signed in! <button onClick={this.signOut}>Sign out</button>
          </p>
          <button onClick={this.updateUsers}>Update users</button>
          <table className="userTable">
            <thead>
              <tr>
                <th>Username</th>
                <th>Balance</th>
                <th>Add funds</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
          <button onClick={this.submitFunds}>
            Submit
          </button>
        </div>
      );
    }
    
  }
}

export default App;
