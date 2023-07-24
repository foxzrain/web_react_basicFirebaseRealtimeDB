import React from "react";
import { Alert, AlertTitle, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

// Import the functions you need from the SDKs you need
// compat packages are API compatible with namespaced code
import firebase from 'firebase/compat/app';
import "firebase/compat/database";

import firebaseConfig from "./db/firebaseConfig";

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    this.state = {
      requests: [],
      open: false,
      id: ''
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  componentDidUpdate(prevState) {
    if (prevState !== this.state.requests) {
      this.writeUserData();
    }
  }

  writeUserData = () => {
    // Initialize Realtime Database and get a reference to the service
    firebase.database()
      .ref("/")
      .update(this.state.requests);
    console.log("DATA SAVED");
  };

  getUserData = () => {
    // Initialize Realtime Database and get a reference to the service
    let ref = firebase.database().ref("/");
    ref.on("value", snapshot => {
      const state = snapshot.val();
      this.setState({requests: state, open: false, id: ''});
    });
  };

  handleRequest = (event, id) => {
    event.preventDefault();

    let name = document.getElementById('requester').value;
    let status = 'Unavailable';
    let date = new Date().toISOString().substring(0, 10);

    const { requests } = this.state;
    const index = requests.findIndex(data => {
      console.log(data.id);
      console.log(id);
      return data.id === id;
    });

    if(index >= 0) {
      requests[index].name = name;
      requests[index].status = status;
      requests[index].date = date;
      this.setState({ requests: requests, open: false });
    } else {
    return <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              status — <strong>Request failed!</strong>
            </Alert>;
    }
  };

  handleReturn = (event, id) => {
    event.preventDefault();
    
    let name = 'N/A';
    let status = 'Available';
    let date = 'N/A';

    const { requests } = this.state;
    const index = requests.findIndex(data => {
      return data.id === id;
    });

    if(index >= 0) {
      requests[index].name = name;
      requests[index].status = status;
      requests[index].date = date;
      this.setState({ requests: requests });
    } else {
      return <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              status — <strong>Return failed!</strong>
            </Alert>;
    }
  };

  handleDialog = (event, isOpen, id) => {
    this.setState({open: isOpen, id: id});
  }; 

  render() {
    const { requests, open, id } = this.state;
    return (
      <React.Fragment>
        <section className="ftco-section">
          <h1>CAE's Mobiles Request</h1>
            <main>
              <table>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>User</th>
                  <th>Request Date</th>
                  <th>Request / Return</th>
                </tr>
                </thead>

                {requests.map(mobileNo => (
                  <tbody key={mobileNo.id}>
                    <tr>
                      <td data-title='ID'>
                        <p ref="id">{mobileNo.id}</p>
                      </td>
                      <td data-title='Mobile'>
                        <p ref="mobile">{mobileNo.mobile}</p>
                      </td>
                      <td data-title='Status'>
                        <span ref="status" className={mobileNo.status === "Available" ? "active" : "inactive"}>{mobileNo.status}</span>
                      </td>
                      <td data-title='User'>
                        <p ref="name">{mobileNo.name}</p>
                      </td>
                      <td data-title='Request Date'>
                        <p ref="date">{mobileNo.date}</p>
                      </td>
                      <td className='select'>
                        <div className='div-btn'>
                          <button className={mobileNo.status === "Available" ? "req" : "disabled"} disabled={mobileNo.status === "Available" ? false : true} onClick={(event) => this.handleDialog(event, true, mobileNo.id)}>
                            Request
                          </button>
                          <button className={mobileNo.status === "Available" ? "disabled" : "ret"} disabled={mobileNo.status === "Available" ? true : false} onClick={(event) => this.handleReturn(event, mobileNo.id)}>
                            Return
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </main>
        </section>

        <div>
            <Dialog open={open} onClose={(event) => this.handleDialog(event, false, id)}>
            <DialogTitle>Who Request</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="requester"
                label="Name"
                type="text"
                variant="standard"
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={(event) => this.handleRequest(event, id)}>OK</Button>
            </DialogActions>
          </Dialog>
        </div>
      </React.Fragment>
    );
  }
}

export default App;