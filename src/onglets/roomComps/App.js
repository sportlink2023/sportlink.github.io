import React, { useEffect, useState, useContext } from 'react'
import RoomCard from './RoomCard'
import LeftBar from './LeftBar'
import { Container, Col, Row } from 'react-bootstrap'
import RoomNavbar from './RoomNavbar'
import { useLocation } from 'react-router-dom'
import { DataContext } from '../../dataContext'
import './App.css';

export default function App() {
    const location = useLocation() // to navigate between the pages

    const {sports, rooms, getUserTable, currentUser,getRooms,setRooms } = useContext(DataContext);
    const data = rooms;

    function isJoined(id){
        if (!currentUser) return false
        else {
            const userData = getUserTable(currentUser.email); // les donnees associees a une email
            if (userData) {
                return userData.Rooms.includes(id); // renvoi True si l'user fais partie des participants du salon 
            }
            else{
                return false; // false sinon
            }
        }
    }

    const [searchInput, setSearchInput] = useState("");
    function searchHandle(e){
        var lowerCase = e.target.value.toLowerCase();
        setSearchInput(lowerCase);
    }

    const [dateFilter, setDateFilter] = useState("Date");
    const [platformFilter, setPlatformFilter] = useState("Sports");
    const [formatFilter, setFormatFilter] = useState("Format");
    const [sportFilter, setSportFilter] = useState("Any");
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    // L'application du filtre donne par "Sport" d'un jeu
    useEffect(() => location.state !== null && setSportFilter(location.state.filter), [location.state])
    useEffect(() => {
        const sportFilters = document.querySelectorAll(".sport-filter");
        sportFilters.forEach(filter => (filter.alt === sportFilter) ? filter.classList.add("sport-filter-active") : filter.className = 'me-2 my-3 sport-filter')
    }, [sportFilter, sports]);

    async function fetchRooms() {
        const roomsData = await getRooms();
        setRooms(roomsData);
      }
      
      // Utilisation de useEffect pour récupérer les données au chargement de la page
      useEffect(() => {
        fetchRooms();
      }, []);

    // changement des etats des filtres
    function dateClickHandler(e) {
        setDateFilter(e.target.innerText);
    }
    function platformClickHandler(e){
        setPlatformFilter(e.target.innerText);
    }
    function formatClickHandler(e) {
        setFormatFilter(e.target.innerText)
    }

    function sportClickHandler(e){
        if(e.target.alt === sportFilter){
            setSportFilter("Any");
            e.target.classList.remove("sport-filter-active");
        }
        else{
            setSportFilter(e.target.alt)
        }
    }

    function toDateTime(secs) {
        var t = new Date(1970, 0, 1);
        t.setSeconds(secs.seconds);
        return t;
    }

    function isToday(someDate) {
        const today = new Date()
        return someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear()
    }

    function getMonday() {
        var d = new Date();
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    getMonday(new Date());

    function isThisWeek(date) {

        // get first date of week
        const firstDayOfWeek = getMonday(date.getDay())
        
        // get last date of week
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

        // if the date is between those firstDayOfWeek and lastDayOfWeek variables
        return date >= firstDayOfWeek && date <= lastDayOfWeek;
    }

    // user do his search with the search bar
    const filteredData = data?.filter((el) => {
        if (searchInput === '') {
            return el;
        }
        else {
            return el.Title.toLowerCase().includes(searchInput);
        }
    })

    // date filter

    const dateFilteredData = filteredData?.filter(el => {
        if (dateFilter === 'Date') { 
            return el
        }
        if (dateFilter) { 
            if (dateFilter === "Today") {   
                return isToday(toDateTime(el.Date))
            }
            else { //sinon on renvoi les rooms prevu cette semaine
                return isThisWeek(toDateTime(el.Date))
            }
        }
    })

    // region filter
    const regionFilteredData = dateFilteredData?.filter(el => {

        if (selectedRegion === '') { //si pas de filtre on renvoi tout les rooms
            return el
        }
        else {
            if (el.Localisation?.Region?.includes(selectedRegion) === undefined || !el.Localisation?.Region?.includes(selectedRegion)) {
                return false;
            }
            else {
                return true
            } //si il y a un filtre, on renvoi les rooms filtrés
        }

    })

    function regionClickHandler(e) {
        setSelectedRegion(e)
    }
    function cityClickHandler(e) {
        setSelectedCity(e)
    }

    const cityFilteredData = regionFilteredData?.filter(el => {
        if (selectedCity === '') {  
            return el
        }
        else {
            if (el.Localisation?.City?.includes(selectedCity) === undefined || !el.Localisation?.City?.includes(selectedCity)) {
                return false;
            }
            else {
                return true
            }
        }
    })

    const fullFilteredData = cityFilteredData?.filter(el => {
        console.log(platformFilter)
        console.log(el)
        if (platformFilter === "Sports") {  //si pas de filtre on renvoi tout les rooms
            return el
        }
        else {
            return el.Sport.includes(platformFilter) //si il y a un filtre, on renvoi les rooms filtrés
        }
    })

    return (
        <Container fluid className = 'room'>
            <Row>
                <RoomNavbar search = {searchInput} onSearchChange={searchHandle} />
            </Row>
            <Row className = 'room-parentrow' style = {{position: 'relative'}}>
                <Col lg = {3} >
                    <LeftBar date = {dateFilter} platform = {platformFilter} format = {formatFilter} dateHandler={dateClickHandler} platformHandler={platformClickHandler} formatHandler = {formatClickHandler} sportHandler = {sportClickHandler} cityHandler = {cityClickHandler} regionHandler = {regionClickHandler} />
                </Col>
                <Col className = 'order-1 order-lg-0 ms-4'>
                    <Container>
                        <Row>
                            <Container className = 'd-flex mb-4' style = {{position: "relative", minHeight: "120px", overflow: "visible", borderRadius: "25px"}} >
                            <h3 className="my-4 my-h3" style={{ margin: 'auto', textAlign: "center",fontSize:'38px', color: 'white', width: "45%"}}>Plusieurs Salons vous attendent !</h3>
                            </Container>
                            {fullFilteredData?.length === 0 && <p style = {{color: "gray"}}> Vous ne trouvez pas de chambre qui vous convienne? Creez la votre facilement !</p>}
                            {sports && rooms && (fullFilteredData?.map(room => 
                                <Col key = {room.Title}>
                                    <div className='roomCard'>    
                                        <RoomCard isJoined = {isJoined(room.id)} el = {room} />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    )
}