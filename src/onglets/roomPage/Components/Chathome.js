import React, { useState, useRef, useContext, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import "./stylechat.css" ;
import {auth , db} from "../../../firebase-config" 
import 'firebase/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, addDoc, orderBy, query } from "firebase/firestore";
import { DataContext } from "../../../dataContext"


export default function Chathome()   {
    const navigate = useNavigate()
    const { currentUser, getUserTable, getbyid } = useContext(DataContext)

    const [searchParams, setSearchParams] = useSearchParams();
    const [currentSalon, setCurrentSalon] = useState()
    useEffect(() => {getbyid(searchParams.get("id")).then(res => setCurrentSalon(res))}, [])
   
         
        
  
    function ChatMessage(props) {
        const { text, uid, photoURL ,Rommes  } = props.message;
        const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
        if (Rommes !=currentSalon.id) return (<> <div></div>  </>)
        else
            return (<>
            <div className={`message ${messageClass}`}>

                    <img onClick={() => { navigate(`/info?id=${uid}`) }} 
                 className='im' src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
                <p className='pa'>{text}</p>
            </div>
            </>) 
    }

    function ChatRoom() {
            
        const dummy = useRef();
        const [formValue, setFormValue] = useState('');        
        const messagesRef = collection(db, 'messages');
        const messagesQuery = query(messagesRef, orderBy('createdAt'));
        const [messages] = useCollectionData(messagesQuery, { idField: 'id' });
            
        const sendMessage = async (e) => {
            e.preventDefault();
            const { uid } = auth.currentUser;
            const photoURL = getUserTable(currentUser?.email)?.photoURL ;
            //const photoURL = getphotoURL(); 
            console.log(formValue)
            console.log("currentuser",currentUser)
            await addDoc(collection(db, "messages"), {
                text: formValue,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                photoURL,
                Rommes :currentSalon.id
            });  
            setFormValue('');
            dummy.current.scrollIntoView({ behavior: 'smooth' }); 
        } 
        
        return (<>
            <main className='gl chat'>
        
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                <span ref={dummy}></span>

            </main>

            <form className='fo' onSubmit={sendMessage} >

                <input className='in' value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Ecrivez votre message ici" />

                <button className='bu' type="submit" disabled={!formValue}>🕊️</button>

            </form>
        </>)
    } // fin du function ChatRoom()
   
    return (
        <>
        {currentSalon && 
        
        <>
        <Container>
            <div>
            </div>
            <div className="chat">
                <header>
                    <h1>💬</h1>
                </header>
                <section>
                    <ChatRoom />
                </section>

            </div>
            
            </Container>  
        </>
        
        }
        </>
        
    );
};


