import React , {useState,useContext} from 'react'
import './Salon.css'
import { DataContext } from '../../../dataContext'
import { arrayUnion,arrayRemove} from "firebase/firestore";

function Popup({format, click,room,id,update}) {


    const len = parseInt(format[0])
const list = [...Array(len).keys()].map(x => ++x);


function handleclickClose(){
    click(false)
}


const {updateDocument,users}=useContext(DataContext)

const [data, setData] = useState([]) // object qui contien les info de l'equipe 
  function handleChange(e){
      let x = e.target.getAttribute("data-indice")
      let temp = data
      
      if (e.target.getAttribute("data-type") === 'sportrtag') {	
      
        let newData = {...data[x], sportrtag : e.target.value }
        temp[x] = newData       
        setData(temp) }
          
      else {
  
        let newData = {...data[x], email : e.target.value }
          temp[x]= newData        
        setData(temp)
      }
      
  }
  const [teamName, setteamName]=useState()
  function getTeam(e){
    setteamName(e.target.value)
  }
  //fonction qui perme de remonter les information du formulaire vers le parent 
  function send(){
      const t = room.Teams
      t[teamName] = data
    updateDocument("Rooms", id, {Teams : t})    
    updateDocument("Rooms", id, {Participants:arrayUnion(...[teamName])}
    )
    
    
    click(false) // ferme le popup
    update(id)
    addRoom(t)
  }

  function addRoom(curTeam){
    // let teams=currentRoom.Teams
    let teams=curTeam
    for (const [key1, value1] of Object.entries(teams)) {
      for (const [key2, value2] of Object.entries(teams[key1])) {
        addRoomToHistoric(value2.email)
      }
    }
  }



  function addRoomToHistoric(email){
    if (users===undefined) return
    users.map(user=>{
      if (user.Email===email){
         updateDocument('Users',user.id,{Rooms : arrayUnion(...[id]) })

      }
    })
  }


 


  return (
    <div className='App'>
        <div className='popup'>
            <div className='popup-header'><p>Inscription</p><button onClick={handleclickClose}>X</button></div>
            {len != 1 ? <input type="text"placeholder='Team name' onChange={getTeam}/> :<input type="text"placeholder='User name' onChange={getTeam}/>}
            {list.map(el => <div key={el-1} ><input type="text" data-type="mail" data-indice = {el-1} placeholder={"Player"+el.toString()+" Mail"} onChange={handleChange}/> 
            <input type="text" data-type="sportrtag" data-indice = {el-1} placeholder={"Player"+el.toString()+" Sportrtag"} onChange={handleChange}/></div>)}
            <div><button onClick={send}>Confirm</button></div>
        </div>
    </div>
  )
}

export default Popup
