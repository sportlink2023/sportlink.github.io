import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { DataContext } from '../../dataContext'
import RoomNavbar from '../roomComps/RoomNavbar'
import RoomCard from '../roomComps/RoomCard'
import LeftBar from '../roomComps/LeftBar'
import { Container, Row, Col } from 'react-bootstrap'
import "./myhome.css"




export default function MyHome() {

  const navigate = useNavigate() //pour naviguer entre les pages
  const {currentUser, getUserTable, rooms,  deleteDocument, getbyid,getRooms,setRooms} = useContext(DataContext) // on recup des fonctions et données du Context Provider
  const refs = getUserTable(currentUser?.email)?.Rooms //Recupere la liste des ids des rooms d'un utilisateur
  
    

  const data = refs?.map( ref => getRoom(ref) ) //les rooms en eux meme
  const droom = rooms?.map( room => room.id )
  
  const data2 = [] //tableau qui va contenir les rooms crées par l'utilisateur courant
  rooms?.map(room => room.Organiser === currentUser?.email && data2.push(room)) 
  

  

  

  useEffect(() => {
    if (!currentUser){ //si pas de session en cours, on ne peut pas acceder a myHome
      navigate("/login")}
    },[currentUser, navigate])

    
  

  //state pour fonction recherche
  const [searchInput, setSearchInput] = useState("")
 
  
  //fonction pour recherche
  function searchHandle (e){
      var lowerCase = e.target.value.toLowerCase();
      setSearchInput(lowerCase);
  }

  function deleteOuPas(){
    if (droom && rooms) {
      for (let i = 0; i < droom.length; i++) {
        const item = droom?.[i];
        const salle = rooms?.[i];
        const maDate = new Date();
        const secondes = Math.floor(maDate.getTime() / 1000);
        const secondes2 = salle?.Date2?.seconds;
        if (secondes2 <= secondes || salle?.Participants.length === 0) {
          deleteDocument("Rooms", item);
        }
      }
    }
  }

  
  

  useEffect(() => {
    deleteOuPas();
  }, [droom,rooms]);

  async function fetchRooms() {
    const roomsData = await getRooms();
    setRooms(roomsData);
  }
  
  // Utilisation de useEffect pour récupérer les données au chargement de la page
  useEffect(() => {
    fetchRooms();
  }, []);
  

  //on regarde d'abord si l'utilisateur recherche avec la barre de recherche
  const filteredData = data?.filter((el) => { 
    if (searchInput === '') {
        return el
    }
    else {
        return el?.Title.toLowerCase().includes(searchInput)
    }
  })

  const filteredData2 = data2?.filter((el) => {  // on filtre aussi les rooms créer par l'utilisateur courant
    if (searchInput === '') {
        return el
    }
    else {
        return el.Title.toLowerCase().includes(searchInput)
    }
  })


  function isJoined(id){ // HERE A PROBLEM to add the room in the Users Collection in the field Rooms
    if (!currentUser) return false
     else{
        let userData = getUserTable(currentUser.email)
        if(userData){
            return userData.Rooms.includes(id) // un probleme a resoudre
        }
        else {
            return false
        }
     }
  }

  //renvoi les données d'un room à partir d'une id d'un room
  function getRoom(id){
    if(rooms === undefined) return 
    let res
    rooms.map(room =>{ 
        if(room.id === id){
          res = room}
        } )
        return res
  }
     

  return (
    <Container fluid  className="myhome-body">
	  
      <Row>
        <RoomNavbar search = {searchInput} onSearchChange={searchHandle} />
      </Row>
    
      <Row>
        <Col className='left-bar' lg={3} >
          <LeftBar />
        </Col>
      
        <Col className='ms-5'>
          <Container  className="d-flex  mb-4" style = {{ position :"relative", minHeight: "120px", borderRadius : "120px", width : "83%", marginLeft : "0"}}>
              
              <h3 className= "my-4" style={{margin : 'auto'}}> Trouvez tous vos Salons ! </h3>
          
          </Container>
          
          <Row>
            <Col>
              <h3 className='salonsRejoint'> 
                Les Salons que vous avez rejoint 
              </h3>
              
              {filteredData?.length === 0 &&
              <p style={{ color: "gray" }}>
                Nous ne trouvons pas ce salon dans votre profil :&#40;
              </p>
              }
              
              {refs && filteredData?.map(room => 
                <Col key={room.Title}>
                    <div className='roomCard'>
                    <RoomCard  isJoined={true} el={room} />
                    </div>
                </Col>
              )}

            </Col>
              
            <Col>
                
              <h3 className='salonsRejoint'>Les salons que vous avez créer </h3>
              {filteredData2?.length === 0 &&
                <p style={{ color: "gray" }}>
                  Pas de salons ? Créez le vôtre facilement, c'est gratuit
                </p>
              }
              
              {filteredData2?.map(jeu =>
                <Col md="auto" key={jeu.Title}>
                  <div className='roomCard'>
                    <RoomCard isJoined={isJoined(jeu.id)} el={jeu} />
                  </div>
                </Col>
              )}
            </Col>
            
          </Row>
        </Col>
      </Row>
    </Container>

  )
}
