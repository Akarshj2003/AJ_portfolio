import './App.css'
import React from 'react'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar.jsx'
import Particles from './components/Particles.jsx'
import Projects from './sections/Projects.jsx'
import About from './sections/About.jsx'
import Contacts from './sections/Contacts.jsx'
import Footer from './sections/Footer.jsx'
import Home from './sections/Home.jsx'
import Skills from './sections/Skills.jsx'
import IntroAnimation from './components/IntroAnimation.jsx'
import ChatToggleButton from './components/ChatToggleButton.jsx'
import ChatWindow from './components/ChatWindow.jsx'


function App() {
  // Intro cooldown: only replay if 4 hours have passed since last visit
  const [introDone, setIntroDone] = React.useState(() => {
    try {
      const lastSeen = localStorage.getItem('aj_portfolio_intro_last_seen');
      if (lastSeen) {
        const hoursPassed = (Date.now() - parseInt(lastSeen, 10)) / (1000 * 60 * 60);
        if (hoursPassed < 4) {
          return true; // Skip intro on refresh within 4 hours
        }
      }
    } catch {
      // Fallback to false if localStorage is blocked
    }
    return false;
  });

  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const handleIntroFinish = () => {
    try {
      localStorage.setItem('aj_portfolio_intro_last_seen', Date.now().toString());
    } catch {
      // Ignore storage errors
    }
    setIntroDone(true);
  };

  return (
    <>
    {!introDone && <IntroAnimation onFinish={handleIntroFinish} />}
    
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
