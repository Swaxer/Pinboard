import React, { Component } from "react";
import "./App.css";
import socketIOClient from "socket.io-client";
import AddButton from "./components/AddButton";
import Modal from "./components/Modal";
import Note from "./components/Note";
import styled from "styled-components";
import Header from "./components/MainPage/Header";

class App extends Component {
  constructor(props) {
    super(props);

    this.noteToEdit = -1;
    this.hasRecivedNotes = false;
    this.version = 0;

    this.socket = socketIOClient("http://localhost:5000/");
    this.socket.on("allNotes", notes => this.initNotes(notes));
    this.socket.on("noteUpdate", note => this.updateNote(note));
    this.socket.on("deleteNote", id => this.removeNote(id));
    this.socket.on("shareNotes", amountOfClients => this.sendAllNotes(amountOfClients));
    this.socket.on('requestAnswer', isAllowed => this.requestToEditAnswered(isAllowed));
    this.socket.on("getNewID", noteID => this.newIdReceived(noteID));
  }

  shouldComponentUpdate() {
    return !this.state.modalState.open;
  }

  state = {
    noteToEdit: {},
    notes: {},
    modalState: {
      modalMode: "normal",
      id: -1,
      open: false,
      header: "",
      body: ""
    }
  };

  initNotes(notes) {
    if (!this.hasRecivedNotes || notes.version > this.version) {
      this.setState({ notes: notes.notes });
      this.hasRecivedNotes = true;
      this.version = notes.version;
    }
  }

  sendAllNotes(amountOfClients) {
    if (amountOfClients < 2) {
      this.hasRecivedNotes = true;
    }
    if (this.hasRecivedNotes) {
      this.socket.emit("allNotes", {
        notes: this.state.notes,
        version: this.version
      });
    }
  }

  propagateUpdate() {
    if (this.state.modalState.id !== -1) {
      this.socket.emit("noteUpdate", {
        ID: this.state.modalState.id,
        header: this.state.modalState.header,
        body: this.state.modalState.body
      });
    }
  }

  updateNote(note) {
    const updatedNotes = this.state.notes;
    updatedNotes[note.ID] = note;
    this.setState({ notes: updatedNotes });
    this.version++;
  }

  handleHeaderChange = e => {
    this.setState(
      {
        modalState: { ...this.state.modalState, header: e.target.value }
      },
      () => {
        this.propagateUpdate();
      }
    );
  };

  handleBodyChange = e => {
    this.setState(
      {
        modalState: { ...this.state.modalState, body: e.target.value }
      },
      () => {
        this.propagateUpdate();
      }
    );
  };

  addNote = () => {
    this.socket.emit("getNewID");
  };

  newIdReceived(noteID) {
    this.setState({
      noteToEdit: noteID,
      modalState: {
        ...this.state.modalState,
        modalMode: "normal",
        id: noteID,
        open: true,
        header: "",
        body: ""
      }
    });
  };

  editNote = (noteID) => {
    this.noteToEdit = noteID;
    this.socket.emit('requestToEdit', noteID);
  };

  requestToEditAnswered(isAllowed) {
    if(isAllowed) {
      this.setState({
        noteToEdit: this.noteToEdit,
        modalState: {
          ...this.state.modalState,
          modalMode: "edit",
          id: this.noteToEdit,
          open: true,
          header: this.state.notes[this.noteToEdit].header,
          body: this.state.notes[this.noteToEdit].body
        }
      }, () => { this.forceUpdate(); });
    } else {
      alert("Note is already being edited.");
    }
  };

  closeModal = e => {
    this.socket.emit('finishedEditing', this.state.modalState.id);
    this.setState({
      noteToEdit: {},
      modalState: {
        ...this.state.modalState,
        open: false,
        modalMode: "normal",
        id: -1,
        header: "",
        body: ""
        }
      }, () => { this.forceUpdate() });
  };

  deleteNote = id => {
    this.socket.emit('deleteNote', id);
    this.removeNote(id);
    this.closeModal();
  };

  removeNote(id) {
    let notesCopy = Object.assign({}, this.state.notes);
    delete notesCopy[id];
    this.setState({
      notes: notesCopy
    });
  };

  render() {
    const Background = styled.div`
      display: flex;
      flex-direction: row;
      background-color: #F4F6F7;
      position: fixed;
      width: 100%;
      flex-wrap: wrap;
      align-content: flex-start;
      overflow: auto;
      overflow-y: auto;
      height: 80%;
      z-index: 1000;
      padding: 30px;
    `;
    const modalState = this.state.modalState.open;
    return (
      <div>
        <Header />
        <Background>
          <AddButton addNote={this.addNote} />
          {Object.keys(this.state.notes).map(note => (
            <Note
              key={this.state.notes[note].ID}
              id={this.state.notes[note].ID}
              header={this.state.notes[note].header}
              body={this.state.notes[note].body}
              editNote={this.editNote}
            />
          ))}
          {modalState && (
            <Modal
              modalMode={this.state.modalState.modalMode}
              modalstate
              noteToEdit={this.state.notes[this.state.noteToEdit]}
              headerChange={this.handleHeaderChange}
              bodyChange={this.handleBodyChange}
              closeModal={this.closeModal}
              deleteNote={this.deleteNote}
            />
          )}
        </Background>
      </div>
    );
  }
}

export default App;
