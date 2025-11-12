import React from 'react'

const About = () => {
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
        </section>
    )
}

export default About