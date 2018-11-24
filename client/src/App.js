import React, { Component } from "react";
import "./App.css";
import MainPage from "./components/MainPage";
import socketIOClient from "socket.io-client"

class App extends Component {
  constructor(props) {
    super(props);

    this.hasRecivedNotes = false;

    this.socket = socketIOClient('http://localhost:5000/');
    this.socket.on('allNotes', notes => this.initNotes(notes));
    this.socket.on('noteUpdate', note => this.updateNote(note));
    this.socket.on('shareNotes', amountOfClients => this.sendAllNotes(amountOfClients));
  };

  state = {
    notes: {},
    modalState: {
      open: true,
      header: "",
      body: ""
    }
  };

  initNotes(notes) {
    if(!this.hasRecivedNotes) {
      this.setState({ notes: notes.notes });
      this.hasRecivedNotes = true;
    }
  };

  sendAllNotes(amountOfClients) {
    if(amountOfClients < 2) {
      this.hasRecivedNotes = true;
    }
    if(this.hasRecivedNotes) {
      this.socket.emit('allNotes', { notes: this.state.notes });
    }
  };

  propagateUpdate(noteID) {
    this.socket.emit('noteUpdate', { ID: noteID,
      header: this.state.modalState.header,
      body: this.state.modalState.body,
    });
  };

  updateNote(note) {
    var updatedNotes = this.state.notes;
    updatedNotes[note.ID] = note;
    this.setState({ notes: updatedNotes });
  };

  handleHeaderChange = e => {
    this.setState({
      modalState: {...this.state.modalState, header: e.target.value}
    });
  };

  handleBodyChange = e => {
    this.setState({
      modalState: {...this.state.modalState, body: e.target.value}
    });
  };

  handleModalState = e => {
    this.setState({
      modalState: {...this.state.modalState, open: false}
    });
    var noteID = Object.keys(this.state.notes).length + 1;
    this.propagateUpdate(noteID);
  };

  render() {
    const modalState = this.state.modalState.open;
    return (
      <MainPage
        bodyChange={this.handleBodyChange}
        headerChange={this.handleHeaderChange}
        modalStateChange={this.handleModalState}
        modalState={modalState}
      />
    );
  }
}

export default App;
