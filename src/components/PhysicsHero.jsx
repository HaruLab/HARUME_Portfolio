import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const PhysicsHero = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Handle potential import variations (ESM vs CJS)
    const M = Matter.default || Matter;
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Body } = M;

    // Initialize engine on client only
    if (!engineRef.current) {
      engineRef.current = Engine.create({
        enableSleeping: false
      });
    }

    const engine = engineRef.current;
    const world = engine.world;
    
    // Set gravity
    world.gravity.y = 0.5;

    const cw = window.innerWidth;
    const ch = window.innerHeight;

    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio,
      }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Walls
    const wallOptions = { 
      isStatic: true, 
      render: { visible: false } 
    };
    // Make walls very large to handle resizing without needing to scale them
    const ground = Bodies.rectangle(cw / 2, ch + 50, 10000, 100, wallOptions);
    const leftWall = Bodies.rectangle(-50, ch / 2, 100, 10000, wallOptions);
    const rightWall = Bodies.rectangle(cw + 50, ch / 2, 100, 10000, wallOptions);
    const ceiling = Bodies.rectangle(cw / 2, -1000, 10000, 100, wallOptions);

    Composite.add(world, [ground, leftWall, rightWall, ceiling]);

    // Create Balls
    const items = [];
    const labels = ['MOTION', 'DESIGN', '3D', 'APP', 'WEB', 'UI/UX', 'LOFI', 'TECH', 'CREATIVE', 'ART'];
    const count = 20;

    for (let i = 0; i < count; i++) {
        const radius = 35 + Math.random() * 30;
        const x = Math.random() * cw;
        const y = -ch * Math.random();
        
        const ball = Bodies.circle(x, y, radius, {
            friction: 0.05,
            restitution: 0.9,
            frictionAir: 0.005,
            render: {
                fillStyle: i % 2 === 0 ? '#3dcfd4' : '#ffffff',
                opacity: 0.6,
                text: labels[i % labels.length]
            }
        });
        items.push(ball);
    }

    Composite.add(world, items);

    // Custom Rendering for Glass Effect
    Events.on(render, 'afterRender', () => {
        const context = render.context;
        const bodies = Composite.allBodies(world);

        bodies.forEach(body => {
            if (body.isStatic) return;

            const { x, y } = body.position;
            const radius = body.circleRadius;
            
            if (!radius) return;

            // Save context
            context.save();
            context.translate(x, y);
            context.rotate(body.angle);

            // Glass Fill (Gradient)
            const gradient = context.createRadialGradient(
                -radius * 0.3, -radius * 0.3, radius * 0.1,
                0, 0, radius
            );
            
            const baseColor = body.render.fillStyle;
            gradient.addColorStop(0, '#ffffff'); // Shine
            gradient.addColorStop(0.2, baseColor);
            gradient.addColorStop(1, baseColor + 'cc'); // Slight transparency at edge

            context.beginPath();
            context.arc(0, 0, radius, 0, Math.PI * 2);
            
            // Blur/Glow
            context.shadowBlur = 10;
            context.shadowColor = baseColor + '33';
            
            context.fillStyle = gradient;
            context.fill();

            // Highlight stroke
            context.strokeStyle = 'rgba(255,255,255,0.4)';
            context.lineWidth = 2;
            context.stroke();

            // Inner Highlight
            context.beginPath();
            context.arc(-radius * 0.3, -radius * 0.3, radius * 0.3, 0, Math.PI * 2);
            context.fillStyle = 'rgba(255,255,255,0.2)';
            context.fill();

            // Add Label
            if (body.render.text) {
                context.rotate(-body.angle); // Keep text upright
                context.fillStyle = body.render.fillStyle === '#ffffff' ? '#000000' : '#ffffff';
                context.font = `bold ${radius * 0.3}px Outfit`;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(body.render.text, 0, 0);
            }

            context.restore();
        });
    });

    // Mouse Interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    // Click to burst
    Events.on(mouseConstraint, 'mousedown', (event) => {
        if (!mouseConstraint.body) {
            const bodies = Composite.allBodies(world);
            bodies.forEach(body => {
                if (body.isStatic) return;
                const forceMagnitude = 0.05 * body.mass;
                const deltaVector = {
                    x: body.position.x - mouse.position.x,
                    y: body.position.y - mouse.position.y
                };
                const distance = Math.sqrt(deltaVector.x * deltaVector.x + deltaVector.y * deltaVector.y);
                if (distance < 300) {
                    const force = {
                        x: (deltaVector.x / distance) * forceMagnitude * (300 / distance),
                        y: (deltaVector.y / distance) * forceMagnitude * (300 / distance)
                    };
                    Body.applyForce(body, body.position, force);
                }
            });
        }
    });

    // Handle Resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      render.canvas.width = newWidth;
      render.canvas.height = newHeight;
      render.options.width = newWidth;
      render.options.height = newHeight;

      Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 50 });
      Body.setPosition(rightWall, { x: newWidth + 50, y: newHeight / 2 });
      // Update sizes of walls
      // Ground
    };

    window.addEventListener('resize', handleResize);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      Composite.clear(world, false);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#F8F9FA] overflow-hidden">
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-0 pointer-events-auto"
      />
      
      {/* Overlay Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none select-none">
        <h1 
          className="text-7xl md:text-[10rem] font-black tracking-tighter text-black mix-blend-multiply opacity-10"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          PHYSICS
        </h1>
        <p className="text-xs md:text-sm font-bold tracking-[1em] text-black/40 uppercase mt-[-2rem] md:mt-[-4rem]">
          Interactive Playground
        </p>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none text-center">
            <h2 className="text-4xl md:text-6xl font-black text-black">HARUME</h2>
            <p className="text-sm text-gray-400 font-medium tracking-widest mt-2">MOTION & DESIGN</p>
      </div>
    </div>
  );
};

export default PhysicsHero;
