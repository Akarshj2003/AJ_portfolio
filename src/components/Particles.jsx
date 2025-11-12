import React, { useEffect, useRef } from 'react'

function Particles() {

    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let Particles = [];
        const paryicleCount = 50;
        const colors = ['#ffc922','#ffffffff'];

        const mouse = {
            x: null,
            y: null,
            radious: 100,
        };
        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radious = Math.random() * 2 + 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.speedX = (Math.random()- 0.5) * 0.2;
                this.speedY = (Math.random()- 0.5) * 0.2;
            }

            drow() {
                ctx.beginPath();
                ctx.arc(this.x,this.y,this.radious,0,Math.PI * 2);
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;


                if(this.x < 0) this.x = canvas.width;
                if(this.x > canvas.width) this.x = 0;
                if(this.y < 0) this.y = canvas.height;
                if(this.y > canvas.height) this.y = 0;

                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radious ){
                        const angle = Math.atan2(dy, dx);
                        const force = (mouse.radious - distance) / mouse.radious;
                        const moveX = Math.cos(angle) * force * 3;
                        const moveY = Math.sin(angle) * force * 3;

                        this.x -= moveX;
                        this.y -= moveY;
                    }

                this.drow();
            }

        }
        function createParticles() {
            Particles = [];
            for (let i = 0; i < paryicleCount; i++) {
                Particles.push(new Particle());
            }
        }

        function handleResize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createParticles();
        }
        handleResize();
        window.addEventListener('resize', handleResize);

        let animationId;

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            Particles.forEach(particle => particle.update());
            animationId = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        }


    }, []);

  return (
    <canvas
        ref={canvasRef}
    className='fixed top-0 left-0 w-full h-full pointer-events-none z-0'>


    </canvas>
  )
}

export default Particles