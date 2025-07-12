import React, { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
}

const NeuralNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const initNodes = () => {
      const nodeCount = 100;
      nodesRef.current = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: 0.2 + Math.random() * 0.5,
      }));
    };

    const drawNode = (node: Node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
      
      // Enhanced glow effect
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 10);
      gradient.addColorStop(0, `rgba(238, 198, 67, ${node.opacity})`);
      gradient.addColorStop(0.3, `rgba(238, 198, 67, ${node.opacity * 0.6})`);
      gradient.addColorStop(1, `rgba(238, 198, 67, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Core node
      ctx.beginPath();
      ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(238, 198, 67, ${Math.min(1, node.opacity * 1.5)})`;
      ctx.fill();
    };

    const drawConnection = (node1: Node, node2: Node, distance: number) => {
      const maxDistance = 120;
      const opacity = Math.max(0, 1 - distance / maxDistance) * 0.4;
      
      const gradient = ctx.createLinearGradient(node1.x, node1.y, node2.x, node2.y);
      gradient.addColorStop(0, `rgba(238, 198, 67, ${opacity * node1.opacity})`);
      gradient.addColorStop(0.5, `rgba(238, 198, 67, ${opacity * Math.max(node1.opacity, node2.opacity)})`);
      gradient.addColorStop(1, `rgba(238, 198, 67, ${opacity * node2.opacity})`);
      
      ctx.beginPath();
      ctx.moveTo(node1.x, node1.y);
      ctx.lineTo(node2.x, node2.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    };

    const drawMouseConnections = () => {
      const maxDistance = 150;
      nodesRef.current.forEach(node => {
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = Math.max(0, 1 - distance / maxDistance) * 0.6;
          const gradient = ctx.createLinearGradient(node.x, node.y, mouseRef.current.x, mouseRef.current.y);
          gradient.addColorStop(0, `rgba(238, 198, 67, ${opacity * node.opacity})`);
          gradient.addColorStop(1, `rgba(238, 198, 67, ${opacity})`);
          
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      nodesRef.current.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
        if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;
        
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
        
        drawNode(node);
      });
      
      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const node1 = nodesRef.current[i];
          const node2 = nodesRef.current[j];
          const dx = node1.x - node2.x;
          const dy = node1.y - node2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            drawConnection(node1, node2, distance);
          }
        }
      }
      
      drawMouseConnections();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleResize = () => {
      resizeCanvas();
      initNodes();
    };

    resizeCanvas();
    initNodes();
    
    // Add a small delay to ensure everything is loaded
    setTimeout(() => {
      setIsLoaded(true);
      animate();
    }, 100);

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ background: 'transparent' }}
    />
  );
};

const Hero = () => {
  const scrollToOffers = () => {
    const offersSection = document.getElementById('offers');
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden font-heebo pt-16 md:pt-16" dir="rtl">
      {/* Premium Background - Always visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#101933] via-[#0d1528] to-[#0a111f]"></div>
      
      {/* Neural Network Animation */}
      <div className="absolute inset-0 z-0">
        <NeuralNetwork />
      </div>

      {/* Ambient Gradient Overlays */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#eec643]/10 to-transparent rounded-full blur-3xl animate-premium-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-[#eec643]/8 to-transparent rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 text-center px-4 md:px-6 max-w-5xl mx-auto">
        <div className="space-y-6 md:space-y-8">
          {/* Main Headline */}
          <div className="animate-premium-fade-in">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight">
              <span className="block premium-text-gradient mb-2 md:mb-4">איך להפוך את ה-AI לשותף</span>
              <span className="block premium-accent-gradient md:animate-premium-glow-pulse">שמוציא את הגאונות שלכם,</span>
              <span className="block premium-text-gradient mt-2 md:mt-4">גם בלי להיות טכנולוגים</span>
            </h1>
          </div>

          {/* Sub-headline */}
          <div className="animate-premium-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="glassmorphism-dark rounded-2xl p-6 md:p-8 lg:p-10 max-w-4xl mx-auto border border-[#eec643]/20">
              <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl premium-text-gradient font-normal leading-relaxed">
                גלו את השיטות לעבודה נכונה עם כלי AI, שיזניקו את היכולות שלכם ויאפשרו לכם ליצור ברמה שלא הכרתם.
              </h2>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-premium-fade-in" style={{ animationDelay: '0.6s' }}>
            <button 
              onClick={scrollToOffers}
              className="premium-button-primary text-base md:text-lg lg:text-xl px-6 md:px-8 py-3 md:py-4 group hover:scale-105 transition-transform duration-300"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                הראה לי איך להפוך גאונות לתוצאות
                <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-16 md:top-20 right-6 md:right-10 w-2 h-2 premium-accent-gradient rounded-full animate-premium-glow-pulse opacity-60 hidden lg:block"></div>
        <div className="absolute bottom-24 md:bottom-32 left-10 md:left-16 w-3 h-3 premium-accent-gradient rounded-full animate-premium-glow-pulse opacity-40 hidden lg:block" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-12 md:left-20 w-1 h-1 premium-accent-gradient rounded-full animate-premium-glow-pulse opacity-80 hidden lg:block" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="glassmorphism rounded-full p-2 md:p-3 animate-bounce">
          <svg className="w-5 h-5 md:w-6 md:h-6 premium-accent-gradient" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;