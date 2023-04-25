
import { Button, Navbar, Container, Nav } from 'react-bootstrap'
import React, { useEffect, useContext, useState } from 'react';
import { DataContext } from "../../dataContext"
import { ReactComponent as LogoSvg } from '../homeComps/utils/logo.svg';
import { signOut, updateProfile } from 'firebase/auth'
import { auth, storage } from '../../firebase-config';
import "./index.css";
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import  fad from "./1234.jpg"
import "../signUpComps/addAvatar.png"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


export default function Profil() {
  const { currentUser, getUserTable, updateDocument, } = useContext(DataContext)
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState()
  //const id = searchParams.get("id")
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  //const {id} = auth.currentUser;
     const {id} =  auth.lastNotifiedUid;
  console.log(currentUser.uid)


  useEffect(() => {
    if (!currentUser) { //si pas de session en cours, on ne peut pas acceder a myHome
      navigate("/login")
    }
  }, [currentUser])

  async function logout() {
    try {
      await signOut(auth)
    }
    catch {
      alert("Can't logout, please try again later")
    }
  }
  let cUser = getUserTable(currentUser?.email)

  const handleChangef = async (e) => {    
    e.preventDefault();
    const date = new Date().getTime();
    const storageRef = ref(storage, `${cUser?.LastName + date}`);
    await uploadBytesResumable(storageRef, e.target.files[0]).then(() => {
      getDownloadURL(storageRef).then(async (downloadURL) => {
        try {
          //Update profile
          await updateProfile(currentUser, {
            displayName,
            photoURL: downloadURL,
          })
         await updateDocument('Users', currentUser.uid, { photoURL:downloadURL });
          window.location.reload(false)

        } catch (err) {
          console.log(err);
          setErr(true);
          setLoading(false);
        }
      });
    })
  }
  return (
    <>
      <Navbar variant="dark" style={{ backgroundColor: 'black' }} expand='lg'>
        <Container fluid className='ms-0 me-5' >
          <Navbar.Brand href="/myhome" >
            <LogoSvg className="d-inline-block align-top" width="230" height="120" style={{ position: 'relative', left: '10%' }} />
          </Navbar.Brand>

          <Button variant='danger' onClick={logout}>
            Logout
          </Button>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Container>
      </Navbar>

      <div className='profilBody' >
        <div className='profilMyProfil'>
          <h1>My Profil</h1>
        </div>
        <label className='imagelabel' htmlFor="file">
          <img className='imagep' src={cUser?.photoURL} alt="" />
          <input style={{ display: "none" }} type="file" id="file" onChange={handleChangef} />
          <img htmlFor="file" className='imagch' src={fad} alt="" />        
        </label>
       
        <h1 className='profilChild1'>Lastname : {getUserTable(currentUser?.email)?.LastName}</h1>
        <h1 className='profilChild1'>FirstName : {cUser?.FirstName}</h1>
        <h1 className='profilChild1'>Pseudo : {cUser?.Pseudo}</h1>
        <h1 className='profilChild1'>Email : {currentUser?.email}</h1>
        <h1 className='profilChild1'>Room Played : {cUser?.Rooms.length}</h1>

        <div>
          <Link to="/contactus">You have a problem with your account ?</Link>
        </div>

      </div>


      <Navbar className='footer-elements' style={{ backgroundColor: '#363636', display: 'flex', justifyContent: 'center' }}>

        <Nav.Item className='me-5'>
          <a className='m-2 text-white '>Privacy Policy</a>
        </Nav.Item>

        <Nav.Item className='me-5 text-white'>
          <a className='m-2 text-white '> Terms and Conditions </a>
        </Nav.Item>

      </Navbar>


      <Navbar className='footer-elements' style={{ backgroundColor: '#363636', display: 'flex', justifyContent: 'center' }}>
        <Nav.Item className='me-5 text-black'>
          © 2023 SportLink
        </Nav.Item>
      </Navbar>

    </>
  )
}
