import React from 'react'

import {connectToServer} from '../src/websocket'

class ChallengeFriends extends React.Component {

  constructor(props) {
    super(props);
    this.state = {gameName: ''};
    this.startOnServer = this.startOnServer.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    var name = event.target.value.replace(/[^a-z]/gi, '').toLowerCase()
    this.setState({gameName: name});
  }

  startOnServer(event) {
    if (this.state.gameName) {
      if (process.env.NODE_ENV == 'development' && this.state.gameName == 'local') {
        connectToServer("ws://localhost:18181/" + this.state.gameName)  
      } else {
        // MAKE SURE THE URL ENDS WITH A / 
        connectToServer("wss://virginia.bowdown.io:18181/" + this.state.gameName)
      }
      document.getElementById("challenge-friends-form").remove();
      this.props.startGame();
    }
  }

  render() {
    return (
      <div className="centered">
        <div id="challenge-friends-form">
          <p>Type the name of the lobby that you want to create or join</p>
          <input type="text" value={this.state.gameName} onChange={this.handleChange} />
          <p className="join" onClick={this.startOnServer}>Join!</p>
          <p className="share-url">{this.state.gameName ? "Tell your friends to join: " + this.state.gameName : ''}</p>
        </div>
      </div>
    )
  }

}

export default ChallengeFriends