import React from 'react'
import { motion, useAnimation } from 'framer-motion'
import Profile from "../assets/Profile.jpg"
import Profile2 from "../assets/Profile2.jpg"

const About = () => {
    const stack = [
        { label: "Education", value: "B.Tech (CSE)" },
        { label: "Focus", value: "Full-Stack & AI" },
        { label: "Passion", value: "Fast & Clean Web Apps" },
    ];

    const glows = [
        "-top-10 -left-10 w-[360px] h-[360px] opacity-20 blur-[120px]",
        "bottom-0 right-10 w-[420px] h-[420px] opacity-15 blur-[140px] delay-300",
        "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] opacity-10 blur-[110px]"
    ]
    const controls = useAnimation();

    const handleMouseEnter = () => {
        controls.start({ rotateY: 180 });
    };

    const handleMouseLeave = () => {
        controls.start({ rotateY: 0 });
    };

    return (
        <section 
            id='about'
            className='min-h-screen w-full flex items-center justify-center relative bg-black text-white overflow-hidden py-20'
        >
            <div className='absolute inset-0 pointer-events-none'>
                {glows.map((c, i) => (
                    <div 
                        key={i} 
                        className={`absolute rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] animate-pulse ${c}`}
                        style={{ animationDuration: "8s" }}
                    />
                ))}
            </div>

            <div className='relative z-10 max-w-6xl w-full mx-auto px-6 sm:px-10 lg:px-12 flex flex-col gap-12'>
                <motion.div
                    className="flex flex-col md:flex-row items-center md:items-stretch gap-8 sm:gap-12"
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, amount: 0.4 }}
                >
                    {/* Interactive 3D Flipping Photo Card */}
                    <motion.div
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className='relative w-44 h-44 sm:w-48 sm:h-48 md:h-[220px] md:w-[220px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#1cd8d2]/20 to-[#302b63]/20 border border-[#1cd8d2]/30 cursor-pointer shrink-0'
                        style={{ perspective: 1000 }}
                    >
                        <motion.div
                            initial={{ rotateY: 0 }}
                            animate={controls}
                            transition={{
                                type: "spring",
                                stiffness: 90,
                                damping: 12,
                                duration: 0.8,
                            }}
                            className='relative w-full h-full'
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            <img
                                src={Profile}
                                alt='Akarsh J Profile'
                                className='absolute inset-0 object-cover w-full h-full'
                                style={{ backfaceVisibility: "hidden" }}
                            />
                            <img
                                src={Profile2}
                                alt='Akarsh J Alt Profile'
                                className='absolute inset-0 object-cover w-full h-full'
                                style={{
                                    backfaceVisibility: "hidden",
                                    transform: "rotateY(180deg)"
                                }}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Bio & Highlights */}
                    <div className='flex-1 flex flex-col justify-center text-center md:text-left'>
                        <h2 className='text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#00f4ff] to-[#ffc922]'>
                            Akarsh J
                        </h2>
                        
                        <p className='mt-2 text-base sm:text-lg text-cyan-300 font-semibold tracking-wide'>
                            Software Developer &amp; AI Builder
                        </p>

                        <p className='mt-4 text-gray-300 leading-relaxed text-sm sm:text-base max-w-2xl'>
                            Hey! I'm Akarsh — a full-stack developer passionate about building clean, responsive web apps and practical AI tools. I enjoy taking complex technical problems and turning them into simple, fast, and delightful software that people love using.
                        </p>

                        {/* Quick Highlights Grid */}
                        <div className='mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto md:mx-0'>
                            {stack.map((it, i) => (
                                <motion.div
                                    key={i} 
                                    className='rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center'
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * i, duration: 0.4 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                >
                                    <div className='text-xs text-gray-400 font-mono'>
                                        {it.label}
                                    </div>
                                    <div className='text-sm sm:text-base font-bold text-white mt-0.5'>
                                        {it.value}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default About