"use client";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Galaxy from '@/components/Galaxy';
// import LiquidEther from '@/components/LiquidEther';
import LightPillar from '@/components/LightPillar';
import { 
  ArrowUpRight, 
  Instagram, 
  MessageCircle, 
  Sparkles, 
  Sun, 
  Brain, 
  Heart, 
  Zap,
  CheckCircle2 
} from 'lucide-react';

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState('Manual Personal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    const offset = 0; // Aligned to section top
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    const startPosition = window.scrollY;
    const distance = offsetPosition - startPosition;
    const duration = 1000; // Slower, more organic
    let start: number | null = null;

    function animation(currentTime: number) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // easeInOutQuart for very smooth organic feel
      const ease = progress < 0.5 
        ? 8 * progress * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 4) / 2;

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  };

  return (
    <main className="relative min-h-screen text-white overflow-hidden selection:bg-emyka">
        {/* 1. NAVIGATION (Apple Liquid Glass Effect)
          Variant notes: to try stronger glass, replace `backdrop-blur-[72px]` with `backdrop-blur-[96px]` and
          `bg-white/[0.20]` with `bg-white/[0.24]`. For subtler glass, reduce blur to `backdrop-blur-[40px]`.
        */}
        <nav className="fixed top-8 left-0 right-0 z-50 px-6">
          <div
            className="max-w-6xl mx-auto liquid-glass rounded-full px-8 py-4 flex justify-between items-center transition-colors duration-200"
          >
            <div className="font-luxury text-sm tracking-widest text-white">EMYKA ASTRAL</div>
            <div className="hidden md:flex space-x-12 text-[10px] uppercase tracking-[0.2em] font-medium text-white/80">
              <a href="#dolor" onClick={(e) => handleNavClick(e, 'dolor')} className="hover:text-emyka transition cursor-pointer">Origen</a>
              <a href="#solucion" onClick={(e) => handleNavClick(e, 'solucion')} className="hover:text-emyka transition cursor-pointer">Manual</a>
              <a href="#precio" onClick={(e) => handleNavClick(e, 'precio')} className="hover:text-emyka transition cursor-pointer">Acceso</a>
            </div>
            <div className="flex items-center space-x-5">
              <Instagram className="w-4 h-4 text-white/80 hover:text-white cursor-pointer" aria-hidden="true" />
              <button className="glass-button text-[10px] font-bold px-7 py-2.5 uppercase tracking-widest flex items-center group transition-all active:scale-95">
                WhatsApp <ArrowUpRight className="ml-2 w-3 h-3 group-hover:rotate-45 transition-transform" />
              </button>
            </div>
          </div>
        </nav>

        {/* 2. HERO SECTION (Márgenes optimizados y Apple Look) */}
        <section className="relative min-h-screen">
          <Galaxy
            mouseRepulsion
            mouseInteraction
            density={1}
            glowIntensity={0.3}
            saturation={1}
            hueShift={140}
            twinkleIntensity={0.3}
            rotationSpeed={0.1}
            repulsionStrength={2}
            autoCenterRepulsion={0}
            starSpeed={0.5}
            speed={1}
          >
            <div className="relative z-10 flex items-center min-h-screen pt-32 pb-20">
              <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-20 w-full grid lg:grid-cols-2 items-center gap-16">
                
                <div className="relative z-10 max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <h1 className="text-5xl md:text-8xl font-bold leading-[0.85] tracking-tighter mb-10">
                      Descubre por <br /> qué eres <br /> 
                        <span style={{ color: '#980d6b' }} className="drop-shadow-[0_0_40px_rgba(152,13,107,0.5)] flex items-center">
                        como eres <Sparkles color="#980d6b" className="ml-5 w-10 h-10 md:w-16 md:h-16 inline-block" />
                      </span>
                    </h1>
                    
                    <p className="text-gray-400 text-lg md:text-xl font-light max-w-md leading-relaxed mb-12">
                      Una lectura <span className="text-white font-medium italic underline decoration-emyka underline-offset-8">personalizada</span> basada en tu ADN cósmico para entender tu mente, amor y metas.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                      <motion.button 
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="glass-button px-12 py-6 text-white font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center transition-all duration-200 active:scale-95"
                        >
                          <ArrowUpRight className="mr-3 w-4 h-4" /> Quiero mis Guías — S/ 9.90
                        </motion.button>
                    </div>
                  </motion.div>
                </div>

                <div className="relative flex justify-center lg:justify-end">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-emyka/20 blur-[150px] rounded-full" />
                    <img 
                      src="/emyka-avatar.png" 
                      alt="Emyka Avatar" 
                      className="w-full max-w-[480px] lg:max-w-[520px] object-contain drop-shadow-[0_20px_100px_rgba(0,0,0,0.8)] ml-[-60px] lg:ml-[-120px]"
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-10 right-0 lg:-right-5 bg-white/[0.02] hover:bg-black/04 backdrop-blur-[12px] border border-white/6 p-8 rounded-[2.5rem] max-w-[300px] hidden xl:block shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-colors duration-200"
                    style={{ WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}
                  >
                    <span className="text-[10px] text-emyka uppercase tracking-[0.3em] font-bold block mb-4">Detalles del Manual</span>
                    <h3 className="font-luxury text-lg mb-4 text-white uppercase tracking-widest leading-tight">Instrucciones de ti misma</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-6 font-light">
                      Cada guía representa una fusión de psicología moderna, astrología técnica y autodescubrimiento profundo.
                    </p>
                    <div className="flex justify-between items-center border-t border-white/10 pt-5">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold italic">S/ 9.90 Pago Único</span>
                      <ArrowUpRight className="w-5 h-5 text-emyka" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </Galaxy>
        </section>

        {/* 🟣 SECCIÓN 2 — DOLOR (Personaje central con cápsulas alrededor) */}
        <section id="dolor" className="relative pt-28 pb-32 w-full overflow-hidden min-h-screen">
          <div className="absolute inset-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_center,_#1a052b_0%,_#000000_100%)]">
            <LightPillar
              topColor="#5227FF"
              bottomColor="#FF9FFC"
              intensity={1.2}
              rotationSpeed={0.3}
              glowAmount={0.004}
              pillarWidth={4.5}
              pillarHeight={0.6}
              noiseIntensity={0.5}
              pillarRotation={25}
              interactive={false}
              mixBlendMode="screen"
              quality="high"
            />
          </div>
          <div className="max-w-6xl mx-auto relative z-10 px-8">
            <h2 className="text-4xl md:text-6xl font-luxury text-center mb-12">Si sientes que...</h2>

            <div className="relative w-full flex justify-center items-center py-12">
                <div className="relative w-full max-w-4xl h-[500px]">
                {/* Center avatar */}
                <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 z-20">
                  <img src="/emyka-avatar_2.png" alt="Emyka Avatar" className="w-full max-w-[260px] md:max-w-[360px] object-contain drop-shadow-[0_22px_70px_rgba(0,0,0,0.5)]" />
                </div>

                {/* Capsules arranged in a circle around the avatar */}
                {(function renderCapsules() {
                  const capsuleItems = [
                    { text: "Repites el mismo tipo de pareja y no sabes por qué", color: '#980d6b', rgb: '152,13,107' },
                    { text: "Te autosaboteas cuando algo va bien", color: '#5d09bc', rgb: '93,9,188' },
                    { text: "Dudas mucho de ti misma", color: '#9011d2', rgb: '144,17,210' },
                    { text: "Reaccionas impulsivamente y luego te arrepientes", color: '#b613e9', rgb: '182,19,233' },
                    { text: "Sientes que nadie te entiende del todo", color: '#610884', rgb: '97,8,132' }
                  ];

                  const radius = 32; // percent distance from center
                  const shiftLeft = -10; // global left shift in percent to move all capsules left
                  return capsuleItems.map((item, i) => {
                    const angle = (i / capsuleItems.length) * Math.PI * 2 - Math.PI / 2; // start at top
                    // per-item fine adjustments (move specific capsules)
                    let extraTop = 0;
                    let extraLeft = 0;
                    if (i === 0) {
                      extraTop = 20; 
                      extraLeft = -35; 
                    }
                    if (i === 1) {
                      extraTop = 5; 
                      extraLeft = -15; 
                    }
                    if (i === 2) {
                      extraTop = -15;
                      extraLeft = -5;
                    }
                    if (i === 3) {
                      extraTop = -10;
                    }
                    if (i === 4) {
                      extraTop = -20;
                    }
                    const top = 48 + Math.sin(angle) * (radius * 0.9) + extraTop; // Base top 48% to match avatar
                    const left = 50 + Math.cos(angle) * radius + shiftLeft + extraLeft;
                    // zIndex: items lower on the screen should appear above (simulate depth)
                    let zIndex = Math.round(40 + Math.sin(angle) * 30);
                    // Ensure the 'pareja' capsule appears in front of avatar
                    if (/pareja|parejas|pareja/i.test(item.text)) zIndex = 120;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.12 * i }}
                        whileHover={{ scale: 1.04 }}
                        className={`liquid-glass absolute p-5 rounded-2xl max-w-xs text-center text-white text-base`}
                        style={{
                          top: `${top}%`,
                          left: `${left}%`,
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: `rgba(${item.rgb}, 0.08)`,
                          border: `1px solid rgba(${item.rgb}, 0.18)`,
                          boxShadow: `0 10px 30px rgba(${item.rgb}, 0.15)`,
                          zIndex
                        }}
                      >
                        <p className="font-light leading-tight">{item.text}</p>
                      </motion.div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </section>

        {/* 🟣 SECCIÓN 3 — SOLUCIÓN (Contenedor centralizado) */}
        <section id="solucion" className="py-32 px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-luxury mb-8 tracking-tighter">Por eso creé tu <br/><span className="text-emyka drop-shadow-sm italic underline decoration-white/10 underline-offset-8">“manual personal”</span></h2>
            <p className="text-gray-400 mb-20 max-w-2xl mx-auto text-lg font-light leading-relaxed">Soy Emyka, astróloga psicológica 💜 y convertí la astrología en algo simple y práctico para tu día a día.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 items-center">
              {/* Card 1: Carta Astral (Left) */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="relative h-[550px] rounded-[3rem] overflow-hidden border border-white/5 group transition-all duration-500 hover:border-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 to-purple-900/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-between p-8 text-center pt-24 pb-12">
                   <div>
                      <Sparkles className="w-16 h-16 text-white/40 mb-6 mx-auto" />
                      <h3 className="font-luxury text-3xl text-white mb-2">Carta Astral</h3>
                      <p className="text-white/40 text-sm max-w-[200px] mx-auto">Tu mapa del cielo al nacer.</p>
                   </div>
                   <button 
                     onClick={(e) => handleNavClick(e, 'precio')} 
                     className="glass-button w-full py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10"
                   >
                      Lo Quiero
                   </button>
                </div>
              </motion.div>

              {/* Card 2: THE SERVICE - Manual Personal (Center - Main Focus) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="relative h-auto min-h-[650px] rounded-[3rem] overflow-hidden border border-[#980d6b]/30 group cursor-pointer shadow-[0_0_50px_rgba(152,13,107,0.15)] z-10"
              >
                {/* Background Gradient & Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#2e094f] via-[#1a052b] to-[#000000] opacity-90" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay" />
                
                {/* Glow Effect */}
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#980d6b]/20 blur-[100px] rounded-full" />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#5227FF]/20 blur-[100px] rounded-full" />

                <div className="relative h-full flex flex-col items-center justify-start pt-12 px-8 text-center z-10">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#FF9FFC] font-bold mb-3 border border-[#FF9FFC]/20 px-4 py-1 rounded-full bg-[#FF9FFC]/5">Tu Manual Personal</span>
                  <h3 className="font-luxury text-4xl mb-2 tracking-wide text-white drop-shadow-lg">¿Qué recibes?</h3>
                  <p className="text-white/50 text-xs mb-10 font-light max-w-xs">La traducción completa de tu ADN astral</p>
                  
                  {/* The 4 Pillars Grid */}
                  <div className="grid grid-cols-1 gap-5 w-full text-left">
                    {[
                      { icon: Sun, title: "Sol", label: "Identidad y Propósito", desc: "¿Quién eres y cuál es tu talento?", color: "text-yellow-400" },
                      { icon: Heart, title: "Venus", label: "Amor y Vínculos", desc: "¿Por qué eliges a quien eliges?", color: "text-pink-400" },
                      { icon: Brain, title: "Mercurio", label: "Mente y Decisión", desc: "¿Cómo dejar de sobrepensar?", color: "text-blue-400" },
                      { icon: Zap, title: "Marte", label: "Acción y Metas", desc: "¿Cómo lograr disciplina real?", color: "text-orange-400" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                        <div className={`p-2 rounded-lg bg-white/5 ${item.color} bg-opacity-10 mt-1`}>
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${item.color}`}>{item.title}</span>
                            <span className="text-white/90 font-luxury text-sm">{item.label}</span>
                          </div>
                          <p className="text-white/40 text-[11px] leading-snug mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto mb-8 pt-6 w-full">
                     <button 
                        onClick={(e) => handleNavClick(e, 'precio')}
                        className="w-full glass-button py-4 text-[10px] font-bold uppercase tracking-[0.2em] bg-[#980d6b] hover:bg-[#b01e7d] transition-colors duration-500 shadow-[0_0_20px_rgba(152,13,107,0.4)]"
                     >
                        Lo Quiero
                     </button>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Revolución Solar (Right) */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="relative h-[550px] rounded-[3rem] overflow-hidden border border-white/5 group transition-all duration-500 hover:border-white/20"
              >
                 <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 to-purple-900/40" />
                 <div className="absolute inset-0 flex flex-col items-center justify-between p-8 text-center pt-24 pb-12">
                   <div>
                      <Sun className="w-16 h-16 text-white/40 mb-6 mx-auto" />
                      <h3 className="font-luxury text-3xl text-white mb-2">Rev. Solar</h3>
                      <p className="text-white/40 text-sm max-w-[200px] mx-auto">Tu pronóstico anual y energía del año.</p>
                   </div>
                   <button 
                      onClick={(e) => handleNavClick(e, 'precio')}
                      className="glass-button w-full py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10"
                   >
                      Lo Quiero
                   </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 🟣 SECCIÓN 4 — CHECKOUT FORM */}
        <section id="precio" className="py-24 px-8 bg-[#0a0a0a]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-luxury text-center mb-12">Configura tu <span className="text-emyka">Pedido</span></h2>
            
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
              <form className="space-y-6" onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  const form = e.target as HTMLFormElement;
                  const formData = {
                    full_name: (form.querySelector('input[placeholder="Ej. María Pérez"]') as HTMLInputElement).value,
                    birth_date: (form.querySelector('input[type="date"]') as HTMLInputElement).value,
                    birth_place: (form.querySelector('input[placeholder="Ciudad, País"]') as HTMLInputElement).value,
                    birth_time: (form.querySelector('input[type="time"]') as HTMLInputElement).value || "00:00",
                    service_type: selectedPlan,
                    email: (form.querySelector('input[type="email"]') as HTMLInputElement).value,
                    phone: (form.querySelector('input[type="tel"]') as HTMLInputElement).value
                  };

                  try {
                    const res = await fetch('/api/orders', {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify(formData)
                    });
                    if(res.ok) {
                      alert("¡Pedido recibido! Emyka te contactará pronto. ✨");
                      form.reset();
                    }
                  } catch(err) {
                    console.error(err);
                    alert("Hubo un error al enviar tu pedido. Intenta nuevamente.");
                  } finally {
                    setIsSubmitting(false);
                  }
              }}>
                 {/* Datos Personales */}
                 <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Datos de Nacimiento</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[10px] text-white/60 uppercase tracking-wider pl-3">Nombre Completo</label>
                          <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-emyka/50 transition-colors placeholder:text-white/20" placeholder="Ej. María Pérez" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] text-white/60 uppercase tracking-wider pl-3">Fecha de Nacimiento</label>
                          <input type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-emyka/50 transition-colors" />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[10px] text-white/60 uppercase tracking-wider pl-3">Lugar de Nacimiento</label>
                          <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-emyka/50 transition-colors placeholder:text-white/20" placeholder="Ciudad, País" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] text-white/60 uppercase tracking-wider pl-3">Hora (Exacta o Aprox)</label>
                          <input type="time" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-emyka/50 transition-colors" />
                       </div>
                    </div>
                 </div>

                 {/* Selección de Servicio */}
                 <div className="pt-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Elige tu Guía</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                       {['Carta Astral', 'Manual Personal', 'Rev. Solar'].map((plan) => (
                          <label key={plan} className="cursor-pointer group">
                             <input 
                               type="radio" 
                               name="plan" 
                               value={plan}
                               checked={selectedPlan === plan}
                               onChange={() => setSelectedPlan(plan)}
                               className="peer sr-only" 
                             />
                             <div className="border border-white/10 rounded-2xl p-4 text-center hover:bg-white/5 peer-checked:bg-[#980d6b] peer-checked:border-[#980d6b] peer-checked:shadow-[0_0_25px_rgba(152,13,107,0.6)] transition-all duration-300">
                                <span className={`text-sm font-bold tracking-wide transition-colors ${selectedPlan === plan ? 'text-white' : 'text-white/60 group-hover:text-white/80'}`}>{plan}</span>
                             </div>
                          </label>
                       ))}
                    </div>
                 </div>

                 {/* Contacto */}
                 <div className="pt-6 pb-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Envío Digital</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-emyka/50 transition-colors placeholder:text-white/20" placeholder="Correo Electrónico" />
                       <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:border-emyka/50 transition-colors placeholder:text-white/20" placeholder="Número de WhatsApp" />
                    </div>
                 </div>

                 <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#980d6b] to-[#5e1247] rounded-full py-4 font-bold text-white tracking-[0.2em] text-sm hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(152,13,107,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? "ENVIANDO..." : "LO QUIERO AHORA"}
                 </button>
                 
                 <p className="text-center text-[10px] text-gray-500 uppercase tracking-widest mt-4">
                    Pagos seguros vía Tarjeta o Transferencia
                 </p>
              </form>
            </div>

            <p className="font-luxury text-3xl my-14 text-center text-emyka tracking-[0.3em] opacity-80">Con cariño, Emyka ✨</p>
          </div>
        </section>

        <footer className="py-16 text-center border-t border-white/5 opacity-40">
          <p className="text-[9px] tracking-[0.6em] uppercase font-bold text-gray-500 italic">Emyka Astral • Galoper Branding Studio © 2026</p>
        </footer>
    </main>
  );
}
