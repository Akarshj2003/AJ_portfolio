import './App.css'
import React from 'react'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar.jsx'
import Particles from './components/Particles.jsx'
import Projects from './Projects.jsx'
import About from './sections/About.jsx'
import Contacts from './sections/Contacts.jsx'
import Footer from './sections/Footer.jsx'
import Home from './sections/Home.jsx'
import Skills from './sections/Skills.jsx'
import IntroAnimation from './components/IntroAnimation.jsx'
import ChatToggleButton from './components/ChatToggleButton.jsx'
import ChatWindow from './components/ChatWindow.jsx'


function App() {

  const [introDone ,setIntroDone]=React.useState(false);
  const [isChatOpen, setIsChatOpen] =React.useState(false);

  return (
    <>
    {!introDone && <IntroAnimation onFinish={()=>setIntroDone(true)}/>}
    
    {introDone && (

   <div  className="relative gradient text-white overflow-x-hidden scroll-smooth" >
   {/* <Particles/>*/}
    <Cursor/>

    <Navbar/>
    <Home/>
    <About/>
    <Skills/>
    <Projects/>
    <Contacts/>
    <Footer/>
    {!isChatOpen && (
      <ChatToggleButton onOpen={() => setIsChatOpen(true)} />
    )}
    {isChatOpen && (
      <ChatWindow onClose={() => setIsChatOpen(false)} />
    )}

   </div>
   )}
   </>
  )
}

export default App
