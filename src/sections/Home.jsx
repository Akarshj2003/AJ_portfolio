import React, { useMemo } from 'react'
import Particles from '../components/Particles'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import avatar from '../assets/avatar.png'

const icons = [
  { icon: FaGithub, label: 'GitHub', link: 'https://github.com/Akarshj2003' },
  { icon: FaLinkedin, label: 'LinkedIn', link: 'https://www.linkedin.com/in/akarshj2003' }
]
const glowVarients = {
  initial: { scale: 1, y: 0, 
    filter: "drop-shadow(0 0 0px #0000) drop-shadow(0 0 0px #0000) drop-shadow(0 0 0px #0000)"
   },
  hover: {
    scale: 1.2, y: -4,
    filter:
      "drop-shadow(0 0 10px #000000) drop-shadow(0 0 20px #00f4ff) drop-shadow(0 0 55px #00f4ff)",
    transition: { type: 'spring', stiffness: 300, damping: 15 }
  },
  tap: {
    scale: 0.95, y: 0,
    transition: { duration: 0.08 }
  }
}


const Home = () => {
  const roles = useMemo(() => ['Software Developer', 'Web Developer', 'AI Application Developer'], [])

  const [index, setIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    const current = roles[index];
    const timeout = setTimeout(() => {
      if (!deleting && subIndex < current.length) setSubIndex(v => v + 1);
      else if (!deleting && subIndex === current.length) setTimeout(() => setDeleting(true), 1200);
      else if (deleting && subIndex > 0) setSubIndex(v => v - 1);
      else if (deleting && subIndex === 0) {
        setDeleting(false);
        setIndex((prev) => (prev + 1) % roles.length);
      }
    }, deleting ? 40 : 60);
    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, roles]);

  return (
    <section
      id='home'
      className='w-full h-screen relative bg-black overflow-hidden'
    >
      <Particles />
      <div className='absolute inset-0'>

        <div
          className=' absolute -top-1 -left-32
      w-[70vw] sm:w-[50vw] md:w-[40vw]
      h-[70vw] sm:h-[50vw] md:h-[40vw]
      max-w-[500px] max-h-[500px]
      rounded-full
      bg-gradient-to-r from-[#302b63] via-[#ffc922] to-[#00f4ff]
      opacity-30 sm:opacity-20 md:opacity-10
      blur-[120px] sm:blur-[150px] md:blur-[180px]
      animate-pulse
      '
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className=' absolute bottom-0 right-0
      w-[70vw] sm:w-[50vw] md:w-[40vw]
      h-[70vw] sm:h-[50vw] md:h-[40vw]
      max-w-[500px] max-h-[500px]
      rounded-full
      bg-gradient-to-r from-[#302b63] via-[#ffc922] to-[#00f4ff]
      opacity-30 sm:opacity-20 md:opacity-10
      blur-[120px] sm:blur-[150px] md:blur-[180px]
      animate-pulse delay-800
      '
          style={{ animationDuration: '8s' }}
        ></div>

      </div>

      <div className='relative z-10 h-full w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 '>
        <div className='flex flex-col justify-center h-full text-center lg:text-left relative'>
          <div
            className='w-full lg:pr-24 mx-auto max-w-3xl'>
            <motion.div
              className='mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-wide min-h-[1.6em]  '
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span>
                {roles[index].substring(0, subIndex)}
              </span>
              <span
                className='border-r-2 border-white ml-1 animate-blink'>

              </span>
            </motion.div>
            <motion.h1
              className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text 
                bg-gradient-to-r from-[#00f4ff] to-[#302b63] via-[#ffc922] drop-shadow-lg'
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Hello I'm
              <br />
              <span className='text-white font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl lg:whitespace-nowrap'>
                Akarsh J
              </span>
            </motion.h1>
            <motion.p
              className='mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A software developer driven by curiosity, precision, and the power of intelligent systems.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {/* VIEW MY WORK */}
              <a
                href="#projects"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#93c1c1] via-[#00f4ff]  to-[#85a9a9]
                text-black font-semibold shadow-lg hover:shadow-[0_0_20px_#ffc922] hover:scale-105 transition-transform duration-300"
              >
                VIEW MY WORK
              </a>

              {/* MY RESUME */}
              <a
                href={`${import.meta.env.BASE_URL}resume.pdf`}
                download
                className="px-6 py-3 rounded-full border-2 border-[#00f4ff] text-white font-semibold hover:bg-[#00f4ff]/10 hover:shadow-[0_0_15px_#00f4ff] hover:scale-105 transition-transform duration-300"
              >
                MY RESUME
              </a>
            </motion.div>
            <div
              className='mt-10 flex gap-6 justify-center text-2xl md:text-3xl lg:justify-start'
            >
              {icons.map(({ icon: Icon, label, link }) => (
                <motion.a
                  href={link}
                  key={label}
                  target='_blank'
                  aria-label={label}
                  rel="noopener noreferrer"
                  variants={glowVarients}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className='text-gray-300'
                >
                  <Icon />

                </motion.a>
              ))}

            </div>

          </div>

        </div>

          <div
          className='relative hidden lg:block'>
            <motion.div 
            className='absolute top-[8%] pointer-events-none'
            style={
              {right:"5vh",
                width:"min(20vw,410px)",
                height:"min(80vh,760px)",
                borderRadius:"50%",
                filter:"blur(40px)",opacity:"0.22",
                background:"conic-gradient(from 0deg ,#00f4ff, #00f4ff,#00f4ff , #00f4ff )"
              }
            }
            initial={{opacity:0,scale:0.98,y:40}}
            animate={{opacity:0.22,scale:1,}}
            transition={{duration:1,delay:0.6}}

            />
            <motion.img src={avatar} alt='aka'
            className='absolute top-1/2 -translate-y-1/2 object-contain select-none '
            style={
              {
                right:"-30px",width:"min(45w,780px)",maxHeight:"90vh"

              }
            }
            initial={{opacity:0,scale:0.98,y:40}}
            animate={{
              opacity:1,
              scale:1,
              y:[0,-10,0],
              

            }}
            transition={{
              opacity:{duration:0.8,delay:0.2},
              y:{duration:4,delay:1,repeat:Infinity,repeatType:"mirror",ease:"easeInOut"},
            }}

            />
          </div>

      </div>

    </section>
  )
}

export default Home