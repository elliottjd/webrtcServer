import React, { useRef, useState }  from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./CreateRoom";
import Room from "./local_modules/Room"; //Room code by Chaim Copyright:https://github.com/coding-with-chaim/native-webrtc
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import logo from "./img/Enrolle.png";
import googleLogo from "./img/googleicon.png";
import twitterLogo from "./img/twittericon.png";
import facebookLogo from "./img/facebookicon.png";


firebase.initializeApp({
  apiKey: "AIzaSyAfrnZVcJp1YKRwd940ofe-y7XIKTvMSPk",
  authDomain: "reshowbase.firebaseapp.com",
  databaseURL: "https://reshowbase.firebaseio.com",
  projectId: "reshowbase",
  storageBucket: "reshowbase.appspot.com",
  messagingSenderId: "156367547920",
  appId: "1:156367547920:web:58d8d32dfc1c90d3746495",
  measurementId: "G-MGFZ1WC0VQ"
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const noScroll = require('no-scroll');


function App() {

  const [user] = useAuthState(auth);


  const[emailValue, setEmailValue] = useState('');
  const[passValue, setPassValue] = useState('');

  document.body.style.overflow = "hidden";
  return (
    <div className="App">
      <header>
      </header>
      <main>
      <img className="mainlogo" src={logo}></img>
      <section className="login-layout">

          <section className="login-socialLogin">            
          {user ? <ChatRoom/> : <SignInGoogle />}
          </section>
      
      </section>
      </main>
      <div className="logout">
      <SignOut />
      </div>
      <section className="background">
      <span class="circle"></span>
      <span class="circleimage"></span>

      </section>
    </div>
  );
}

function SignInEmail(emailInput, passwordInput) {
  const signInWithEmail = () => {
    firebase.auth().signInWithEmailAndPassword(emailInput, passwordInput)
  return(
  <>
    <img src={googleLogo} className="btn-icon" onClick={signInWithEmail}/>
  </>
  )
}
}



function SignInGoogle() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  const signInWithTwitter = () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    auth.signInWithPopup(provider);
  }

  const signInWithFacebook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider);
  }

  const[emailValue, setEmailValue] = useState('');
  const[passValue, setPassValue] = useState('');
  return(
  <>
    <div className="login-logintext">
          <h1 className="logintext">Login</h1>
        </div>

        <div className="logininput-div">
          <form className="login-inputform">
            <input className="login-inputfield" placeholder="Email" value={emailValue} onChange={(change) => setEmailValue(change.target.value)}  />
          </form>

          <form className="login-inputform">
            <input className="login-inputfield" placeholder="Password" type="password" value={passValue} onChange={(change) => setPassValue(change.target.value)}/>
          </form>

          <a className="btn-login" onClick={(emailInput, passwordInput) => SignInEmail}>Login</a>
          </div>

    <img src={googleLogo} className="btn-icon" onClick={signInWithGoogle}/>
    <img src={twitterLogo} className="btn-icon" onClick={signInWithTwitter}/>
    <img src={facebookLogo} className="btn-icon" onClick={signInWithFacebook}/>
  </>
  )
}


function SignOut() {
  return auth.currentUser &&
  (
    <button className="btn-createRoom" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const msgCol = firestore.collection('messages');
  const query = msgCol.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});
  console.log(messages)
  const[formValue, setFormValue] = useState('');
  const dummy = useRef();
  const sendMessage = async(change) => {
    change.preventDefault();
    const {uid, photoURL} = auth.currentUser;
    await msgCol.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  return(
  <>
    <BrowserRouter className="roomButton">
        <Switch>
          <Route path="/" exact component={CreateRoom} />
          <Route path="/room/:roomID" component={Room} />
        </Switch>
      </BrowserRouter>
  </>
  )
}

/*
<div>
      
    </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} className="inputfield" onChange={(change) => setFormValue(change.target.value)} placeholder="Enter Message" />
        <button type="submit" className="btn-createRoom" disabled={!formValue}>🖂</button>
      </form>
      <p>{messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}</p>
        <span ref={dummy}></span>


        <div className="login-logintext">
          <h1 className="logintext">Login</h1>
        </div>

        <div className="logininput-div">
          <form className="login-inputform">
            <input className="login-inputfield" placeholder="Email" value={emailValue} onChange={(change) => setEmailValue(change.target.value)}  />
          </form>

          <form className="login-inputform">
            <input className="login-inputfield" placeholder="Password" type="password" value={passValue} onChange={(change) => setPassValue(change.target.value)}/>
          </form>

          <a className="btn-login" onClick={(emailInput, passwordInput) => SignInEmail}>Login</a>
*/


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="Message" />
      <p>{text}</p>
    </div>
  )
}

export default App;
