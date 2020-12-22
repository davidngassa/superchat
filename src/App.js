import "./App.css";
import { useState, useRef } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

import ChatMessage from "./components/ChatMessage";

firebase.initializeApp({
  apiKey: "AIzaSyDIP3n3t30XSKGuU3toB5KB9Xq0WPiBFR0",
  authDomain: "superchat-135cf.firebaseapp.com",
  projectId: "superchat-135cf",
  storageBucket: "superchat-135cf.appspot.com",
  messagingSenderId: "806543431567",
  appId: "1:806543431567:web:fdb4f5b01b22a20dbc1dfa",
  measurementId: "G-N4Q2BR3M0K",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return <div className="App">{user ? <ChatRoom /> : <SignIn />}</div>;
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <div>
      <button className="auth-button" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container">
      <header>
        <button onClick={() => auth.signOut()}>SignOut</button>
      </header>

      <div className="chat-room">
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
        <form onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="say something nice"
          />

          <button type="submit" disabled={!formValue}>
            🕊️
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
