import React, { useState, useContext, useEffect } from 'react'
import { useSearchParams, useNavigate } from "react-router-dom";
import './Salon.css'
import { DataContext } from '../../../dataContext'
import { arrayUnion, arrayRemove, updateDoc} from "firebase/firestore";
import { Col, Row, Button, Stack, Tabs, Tab } from 'react-bootstrap'
import ListParticipants from './ListParticipants'
import Popup from './Popup';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Chathome from './Chathome';


export default function Main() {
  const navigate = useNavigate();
  const [currentSalon, setCurrentSalon] = useState()
  const { updateDocument, getbyid, currentUser, setCurrentUser, getUserTable } = useContext(DataContext)

  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id")
  //console.log(id)
  useEffect(() => {
    getbyid(id).then(res => setCurrentSalon(res))
  }, [])
  
    
  const nameSalon = currentSalon?.Title
  const MaxPlayer = currentSalon?.MaxPlayer
  const Localisation = currentSalon?.Localisation
  const Organizer = currentSalon?.Organiser
  const PlayerCreator = currentSalon?.PlayerCreator
  const Sport = currentSalon?.Sport
  const startDate = currentSalon?.Date.seconds
  const Participants = currentSalon?.Participants
  const isStarted = currentSalon?.Started
  const showContent = currentSalon?.Participants?.includes(currentUser?.email);
   
  

  const [error, setError] = useState()

  function isTime(time) {
    var t = new Date(1970, 0, 1);
    t.setSeconds(time)

    if (Date.parse(t) - Date.parse(new Date()) < 0)
      return true
    return false
  }

  async function addToRoomsStartedIfNeeded(){
    if (currentSalon && isTime(startDate) && !currentUser.PlayedRooms.some(room => room.id === id && room.SportType === Sport)){
      try {
        const userRef = currentUser.uid;
        await updateDoc(userRef, {PlayedRooms: arrayUnion({id, SportType: Sport})});
      }
      catch (error){
        console.log(error);
      }
    }
  }

  

  function update(id) {
    getbyid(id).then(res => setCurrentSalon(res))
  }

  const [joinData, setjoinData] = useState([])
  
  function getJoinData(team, data) {
    setjoinData(data)
  }

  const [popup, setPopup] = useState(false)
  function CheckJoin(participants, user) { // si le mail d'un utilisateur se trouve dans la liste des participants du salon
    return participants.includes(user);
  }
  
  // EN COURS DE TRAITEMENT  (ADRIAN)
  const handleclickOpen = async (user) => { 
    
    if (CheckJoin(currentSalon.Participants, user)){
      return alert("Already in this room!");
    }
    
    var s = getUserTable(user); // all the informations about the user
    if (currentUser) {
      try {
        
        await updateDocument('Rooms', id, { Participants: arrayUnion(user) });
        setCurrentSalon(prevState => ({
          ...prevState,
          Participants: [...prevState.Participants, user]

        }));
        
        await updateDocument('Users', s.id, { Rooms: arrayUnion(id)}); // EN TRAIN DE LE FAIRE
        setCurrentUser(prevState => ({
          ...prevState,
          Rooms: [...prevState.Rooms, id]
        }));

      } catch (error) {
        //console.log(error)
      }
    }
    else {
      navigate("/login")
    }
  }
  
  
  // EN COURS DE TRAITEMENT  (ADRIAN)
  
  const leaveSalon =  async (user) => { 
    const x = CheckJoin(currentSalon.Participants, user);
    var s = getUserTable(user); // all the information about the user
   // console.log(s);
    if (x) {
      try {
        
        await updateDocument('Rooms', id, { Participants: arrayRemove(user) });
        setCurrentSalon(prevState => {
          const updatedParticipants = prevState.Participants.filter(p => p != user);
          return { ...prevState, Participants: updatedParticipants };
        });
        
        await updateDocument('Users', s.id, {Rooms: arrayRemove(id)});
        setCurrentUser(prevState => {
          const updatedUser = prevState.Rooms.filter(p => p != id);
          return {...prevState, Rooms: updatedUser} ;
        }) // update the collection Users for the s.id user for the field Rooms in this collection
      } 
      catch (error) { }
    } 

    else {
      alert("You're not in this room");
    }
  }; // fin leaveSalon

  const closePopup = (value) => {
    setPopup(value)
  }
  
  function printButton(user, Organiser) {
    if (CheckJoin(Participants, user)) {
      return <div>
        <Button className='leave-button' onClick={() => {leaveSalon(user) }}> Leave </Button>
      </div>;
    }
    
    return (isStarted ?
      <p style={{ color: "white" }}>Room has already started, you can't register anymore</p>
      :
      <div><Button className='join-button' onClick={() => { handleclickOpen(user); }}> Join room </Button></div>
    )
  } 
  
  return (
    <>
      {currentSalon &&
        <>
          <Col>
            <Row >
              <Row> <center><h1 className='mt-5 title-salon'>{nameSalon}</h1></center> </Row>

              <Col>
                {currentSalon && printButton(currentUser?.email, Organizer)}
                {error}
                {currentSalon && popup ? <Popup click={closePopup} sendData={getJoinData} isOragniser={currentUser?.email === Organizer} room={currentSalon} id={id} update={update} /> : <></> /* pop pour rejoindre le tournois */}
              </Col>
            </Row>
            <Row>
              <Col>
                <Stack className='mb-3' direction="horizontal" gap={3}>
                </Stack>
              </Col>
            </Row >
          </Col>

          <h4 className='my-5'>Room Info</h4>

          <Tabs
            defaultActiveKey="Localisation"
            transition={false}
            id="noanim-tab-example"
            className="mb-3"
          >
            <Tab eventKey="Localisation" title="Localisation">
              {Localisation.Region != undefined ? <>
                <h4>Région : {Localisation.Region}</h4>
                <h4>Ville : {Localisation.City} </h4> </> : <h4>{Localisation}</h4>}
            </Tab>
            
            <Tab eventKey="MaxPlayer" title="MaxPlayer">
              <h4> <ReactMarkdown children={MaxPlayer} remarkPlugins={[remarkGfm]} /> </h4>
            </Tab>
            
            <Tab eventKey="Sport" title="Sport">
              <h4> <ReactMarkdown children={Sport} remarkPlugins={[remarkGfm]} /> </h4>
            </Tab>
            
            <Tab eventKey="PlayerCreator" title="PlayerCreator" >
            { <li className=" liperso">
                <img onClick={() => { navigate(`/info?id=${getUserTable(PlayerCreator)?.id}`) }}
              className="imagepersalo" src={getUserTable(PlayerCreator)?.photoURL} alt="" />
              <h5 onClick={() => { navigate(`/info?id=${getUserTable(PlayerCreator)?.id}`) }} className='h5list' > {<><>{getUserTable(PlayerCreator)?.LastName}</><> </><>{getUserTable(PlayerCreator)?.FirstName}</></>}</h5>
            </li>}
            </Tab>
            
            <Tab eventKey="Participants" title="Participants">
               <ListParticipants Object={Participants} isOragniser={currentUser?.email === Organizer} leaveSalon={leaveSalon} /> 
            </Tab>
            
            {showContent ? 
            <Tab eventKey="chat" title="Chat" >
              <Chathome />
            </Tab> : <></>
            }
            <center>
              <progress max="100" value="70"> 70% </progress>
            </center>
          </Tabs>
        </>}
    </>
  )
}
