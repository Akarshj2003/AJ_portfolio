import React from 'react'
import {motion} from 'framer-motion'
import Profile from "../assets/Profile.jpg"

const About = () => {

    const stack=[
        {label: "Highest Education",value:"B-Tech(CSE)"},
        {label: "Speciality" , value : "AI & ML"},
        {label: "Focus" , value: "Smart & Dynamic Systems"},

    ];

    const glows=[
        "-top-10 -left-10 w-[360px] h-[360px] opacity-20 blur-[120px]",
        "bottem-0 right-10 w-[420px] h-[420px] opacity-15 blur-[140px] delay-300",
        "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] opacity-10 blur-[110px]"
    ]


    return (
        <section 
        id='about'
        className='min-h-screen w-full flex items-center justify-center relative bg-black text-white overflow-hidden'>
            <div className='absolute inset-0 pointer-events-none'>
                {glows.map((c,i)=>(
                    <div key={i} className={`absolute rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] animate-pulse ${c}`}
                    style={{animationDuration:"8s"}}/>
                ))}
            </div>
            <div
            className='relative z-10 max-w-6xl w-full mx-auto px-10 lg:px-12 py-20 flex flex-col gap-12'
            >
                <motion.div
                className="flex flex-col md:flex-row items-center md:items-stretch gap-8"
                initial={{opacity:0,y:25}}
                whileInView={{opacity:1,y:0}}
                transition={{duration:0.6}}
                viewport={{once:true,amount:0.4}}
                >
                    <motion.div
                    className='
                    relative w-40 h-40 md:h-[200px] md:w-[200px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#1cd8d2]/20 to-[#302b63]/20 border border-[#1cd8d2]/20 '
                    >
                        <img src= {Profile} alt="profile"
                        className='absolute inset-0'/>
                    </motion.div>
                    <div
                    className='flex-1 flex flex-col justify-center md:text-left'
                    >
                        <h2
                        className='text-4xl sm:text-5xl form-extrabold teacking-tight bg-clip-text text-transparent
                        bg-gradient-to-r  from-[#ffc922] to-[#00f4ff] '
                        >
                            Akarsh J
                        </h2>
                        <p className='mt-2 text-lg sm:text-xl text-white/90 font-semibold'>
                            software developer
                        </p>
                        <p
                        className='mt-4 text-gray-300 leading-relaxed text-base sm:text-lg max-w-2xl md:max-w-3xl '
                        >
                            I'm a full-stack software developer focused on building responsive, accessible web apps with React, Node.js and TypeScript. I enjoy crafting polished UIs, optimizing performance, and collaborating on open-source projects — always learning and shipping clean, maintainable code.
                        </p>
                        <div className='mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl'>
                            {stack.map((it,i)=>(
                                <motion.div
                                key={i} className='rounded-xl border border-white/5 bg-white/8 px-4 py-3 text-center '
                                initial={{opacity:0 ,y:10}}
                                whileInView={{opacity:1 ,y:0}}
                                transition={{delay:0.05*i , duration:0.4}}
                                viewport={{once:true, amount:0.3}}>
                                    <div className='text-sm text-gray-400'>
                                        {it.label}
                                    </div>
                                    <div className='text-base font-semibold'>
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