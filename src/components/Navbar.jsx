import React, { useEffect } from 'react'
import OverlayMenu from './OverlayMenu'
import logo from '../assets/logo.png'
import { TfiMenu } from 'react-icons/tfi'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [visible, setVisible] = React.useState(true);
    const [forcevisible, setForcevisible] = React.useState(false);
    const lastScrollY = React.useRef(0);
    const timerId = React.useRef(null);


    useEffect(() => {
        const homesection = document.querySelector('#home');
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setForcevisible(true);
                    setVisible(true);
                }
                else {
                    setForcevisible(false);
                }
            }, { threshold: 0.1 }
        )
        if (homesection) observer.observe(homesection);
        return () => {
            if (homesection) observer.unobserve(homesection);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (forcevisible) {
                setVisible(true);
                return;
            }
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current) {
                setVisible(false);
            } else {
                setVisible(true);

                if (timerId.current) clearTimeout(timerId.current);
                timerId.current = setTimeout(() => {
                    setVisible(false);
                }, 3000);
            }
            lastScrollY.current = currentScrollY;
        }
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (timerId.current) clearTimeout(timerId.current);
        };
    }, [forcevisible]);
    return (
        <>

            <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className='flex items-center space-x-2'>
                    <img src={logo} alt='logo' className='w-8 h-8' />
                    <div className='text-2xl font text-white font-bold '>
                        Akarsh
                    </div>
                </div>
                <div className='block lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2'>
                    <button onClick={() => setMenuOpen(true)}
                        className='text-white text-2xl focus:outline-none'
                        aria-label='openMenu'
                    >
                        <TfiMenu />
                    </button>
                </div>
                <div className='hidden lg:block'>
                    <a href='#contact'
                        className="bg-gradient-to-r from-yellow-500 to-red-500 text-white px-5 py-2 rounded-full font-medium shadow-[0_0_10px_rgba(255,255,100,0.4)] transition-all duration-300 
                        hover:shadow-[0_0_25px_rgba(255,255,100,0.9)] hover:scale-105"

                    >
                        REACH OUT
                    </a>
                </div>

            </nav>
            <OverlayMenu isOpen={menuOpen} onClose={() => {
                setMenuOpen(false);
            }} />
        </>
    )
}

export default Navbar