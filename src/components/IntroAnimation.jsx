import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import logoIntro from '../assets/logoIntro.mp4';
import introMusic from '../assets/logoBGM.mp3'

function IntroAnimation({ onFinish }) {

    const hallo = useMemo(() => [
        "Hello",
        "Hola",
        "Bonjour",
        "Olá",
        "Здравствуйте",
        "你好",
        "안녕하세요",
        "Hello",
        "مرحبا",
        "Hei",
        "שלום",
        "こんにちは",
        "नमस्ते",
        "നമസ്കാരം"
    ], [])
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const [phase, setPhase] = useState('video');
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);


    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.onended = () => {
                setTimeout(() => setPhase('text'), 0);
            };
        }
    }, []);

    useEffect(() => {
        if (phase != 'text') return;

        if (index < hallo.length - 2) {
            const id = setInterval(() => setIndex((i) => i + 1), 180);
            return () => clearInterval(id);
        }
        else if (index < hallo.length - 1) {
            const id = setInterval(() => setIndex((i) => i + 1), 400);
            return () => clearInterval(id);
        }
        else {
            const timeout = setTimeout(() => {
                setVisible(false);
                setTimeout(() => {
                    onFinish();
                }, 400)
            }, 400);
            return () => clearTimeout(timeout);
        }

    }, [index, hallo.length, phase, onFinish]);

    return (
        <AnimatePresence onExitComplete={onFinish}>
            {visible && (
                <motion.div
                    className='fixed inset-0 z-9999 flex items-center justify-center bg-black text-white overflow-hidden'
                    initial={{ y: 0 }}
                    exit={{
                        y: "-100%",
                        transition: {
                            duration: 1.2,
                            ease: [0.22, 1, 0.36, 1]
                        },
                    }}
                >
                    {/* Skip Intro Button */}
                    <button
                        onClick={onFinish}
                        className="absolute top-6 right-6 z-50 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-mono text-xs tracking-wider backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95"
                    >
                        SKIP ⇥
                    </button>

                    {phase === 'video' && (
                        <motion.video
                            ref={videoRef}
                            src={logoIntro}
                            autoPlay
                            muted
                            className="w-[60%] h-auto object-contain"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                    )}

                    {phase === 'text'  && (
                        <motion.h1
                            key={index}
                            className='text-5xl md:text-7xl lg:text-8xl fond-bold '
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 1.2 }}
                            transition={{ duration: 0.12 }}
                        >
                            {hallo[index]}
                        </motion.h1>
                    )}

                </motion.div>
            )}
        </AnimatePresence>

    )
}

export default IntroAnimation