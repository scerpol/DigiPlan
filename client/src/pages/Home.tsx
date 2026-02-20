import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, CheckCircle2, Layers, PenTool, LayoutTemplate } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { PricingCard } from "@/components/PricingCard";
import { ContactForm } from "@/components/ContactForm";
import { useState, useEffect, useRef } from "react";
import transformationImg1 from "@assets/Assonometria_arredata_1770801124081.jpg";
import transformationImg2 from "@assets/Assonometria_semplice_1770801151848.jpg";
import transformationMainImg from "@assets/Planimetria_semplice_1770801040265.jpg";
import logoImg from "@assets/Sfondo_1770395803934.png";
import teamSketchImg from "@/assets/images/team-sketch.png";

const transformationSlides = [
  {
    img: transformationMainImg,
    position: "center",
    label: "Planimetria semplice",
  },
  {
    img: transformationImg2,
    position: "20% center",
    label: "Spaccato assonometrico",
  },
  {
    img: transformationImg1,
    position: "center",
    label: "Spaccato assonometrico arredato",
  },
];

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeTransformationSlide, setActiveTransformationSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const userTouchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUserScrolling = useRef(false);

  const startAutoScroll = () => {
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    autoScrollTimer.current = setInterval(() => {
      if (isUserScrolling.current) return;
      setActiveTransformationSlide((prev) => {
        const next = (prev + 1) % transformationSlides.length;
        if (carouselRef.current) {
          const cardWidth = carouselRef.current.offsetWidth * 0.85;
          carouselRef.current.scrollTo({ left: next * cardWidth, behavior: 'smooth' });
        }
        return next;
      });
    }, 5000);
  };

  const handleUserTouch = () => {
    isUserScrolling.current = true;
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    if (userTouchTimer.current) clearTimeout(userTouchTimer.current);
    userTouchTimer.current = setTimeout(() => {
      isUserScrolling.current = false;
      startAutoScroll();
    }, 5000);
  };

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'instant' as ScrollBehavior });
    }
    setActiveTransformationSlide(0);
    startAutoScroll();

    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
      if (userTouchTimer.current) clearTimeout(userTouchTimer.current);
    };
  }, []);

  const scrollToPricing = () => {
    document.getElementById('piani')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectPackage = (packageName: string) => {
    // Dispatch custom event for ContactForm
    window.dispatchEvent(new CustomEvent('select-package', { detail: packageName }));
    document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative h-[100dvh] flex flex-col items-center justify-center bg-gradient-to-br from-primary via-[#6a65d8] to-accent text-white overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white blur-[100px]" />
           <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-300 blur-[120px]" />
        </div>

        <div className="relative z-10 px-6 text-center flex-1 flex items-center justify-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col items-center mb-4 md:mb-6">
              <img src={logoImg} alt="DigiPlan logo" className="w-[5.5rem] md:w-[9.8rem] lg:w-[11.2rem] mb-3 md:mb-4" />
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
                Digi<span className="text-white/80">Plan</span>
                <br />
                <span className="text-white/80 text-[28px] md:text-[45px] lg:text-[60px] block" style={{ marginTop: '-5px' }}>service</span>
              </h1>
            </div>
            <p className="text-base md:text-3xl text-white/90 font-light mb-6 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4 md:px-2">Trasformiamo le vecchie planimetrie catastali in rappresentazioni digitali moderne e accattivanti</p>
            
            <motion.button
              onClick={scrollToPricing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-bold shadow-2xl shadow-black/20 hover:shadow-white/20 transition-all flex items-center gap-2 mx-auto"
            >
              Scopri i Piani <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="relative z-10 pb-4 animate-bounce cursor-pointer"
          onClick={() => document.getElementById('chi-siamo')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown className="w-[2.3rem] h-[2.3rem] text-white/50" />
        </motion.div>
      </section>
      {/* --- ABOUT US (Chi Siamo) --- */}
      <section id="chi-siamo" className="py-16 md:py-32 container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle 
              title="Il Nostro Team" 
              subtitle="Esperti tecnici con una visione estetica moderna"
              className="mb-8"
            />
            <div className="prose prose-base md:prose-lg text-muted-foreground mx-auto">
              <p className="mb-4 md:mb-6 text-sm md:text-base">Siamo un collettivo di professionisti composto da geometri e architetti, uniti dalla passione per il design e la precisione tecnica</p>
              <p className="text-sm md:text-base">La nostra missione è semplice: trasformare documenti tecnici obsoleti e poco leggibili in strumenti di comunicazione visiva potenti. Crediamo che ogni proprietà meriti di essere presentata al meglio, con planimetrie chiare, eleganti e immediatamente comprensibili</p>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto">
              {[
                { icon: Layers, label: "Precisione" },
                { icon: PenTool, label: "Design" },
                { icon: CheckCircle2, label: "Affidabilità" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-sm text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      {/* --- TRANSFORMATION EXAMPLES --- */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 mx-auto">
          <SectionTitle 
            title="La Trasformazione" 
            subtitle="Guarda come diamo nuova vita alle planimetrie"
          />

          {/* Desktop layout - three cards side by side */}
          <div className="hidden md:flex gap-6 mt-12">
            {transformationSlides.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex-1 h-[400px] rounded-[2rem] overflow-hidden shadow-lg bg-white"
              >
                <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: item.position }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-5 left-0 right-0 text-center">
                  <span className="text-white font-semibold text-lg">{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile carousel */}
          <div 
            ref={carouselRef}
            className="flex md:hidden gap-4 mt-12 overflow-x-auto pb-4 snap-x snap-mandatory flex-nowrap no-scrollbar"
            onTouchStart={handleUserTouch}
            onScroll={(e) => {
              const container = e.currentTarget;
              const scrollLeft = container.scrollLeft;
              const cardWidth = container.offsetWidth * 0.85;
              const activeIndex = Math.round(scrollLeft / cardWidth);
              setActiveTransformationSlide(activeIndex);
            }}
          >
            {transformationSlides.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative w-[85vw] h-[350px] rounded-[2rem] overflow-hidden shadow-lg bg-white snap-center shrink-0 first:ml-[7.5vw] last:mr-[7.5vw]"
              >
                <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: item.position }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-5 left-0 right-0 text-center">
                  <span className="text-white font-semibold text-lg">{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Carousel Dots - Mobile Only */}
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            {transformationSlides.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeTransformationSlide === i ? 'bg-primary w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
      {/* --- PRICING --- */}
      <section id="piani" className="py-16 md:py-24 container px-4 mx-auto">
        <SectionTitle 
          title="Scegli il tuo Piano" 
          subtitle="Soluzioni flessibili per ogni esigenza immobiliare"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto items-stretch px-4 md:px-0">
          <PricingCard 
            title="Base"
            price={55}
            description="Basato su planimetria catastale esistente"
            delay={0}
            onSelect={() => handleSelectPackage('Base')}
            features={[
              { text: "Planimetria digitale 2D", included: true },
              { text: "Formato PDF", included: true },
              { text: "Consegna in 48 ore", included: true },
              { text: "Recupero planimetria (+10€)", included: false },
              { text: "Opzione 3D (+50€)", included: false },
            ]}
          />
          
          <PricingCard 
            title="Premium"
            price={160}
            description="Realizzata in seguito a rilievo"
            isPopular={true}
            delay={0.1}
            onSelect={() => handleSelectPackage('Premium')}
            features={[
              { text: "Rilievo (Aosta e dintorni)", included: true },
              { text: "Planimetria digitale 2D", included: true },
              { text: "Formato PDF", included: true },
              { text: "Opzione 3D (+50€)", included: false },
              { text: "Rilievi fuori Aosta (da definire)", included: false },
            ]}
          />
        </div>
      </section>
      {/* --- CONTACT --- */}
      <section id="contatti" className="py-16 md:py-24 bg-[#f5f5f7]">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            <div className="lg:col-span-2">
              <SectionTitle 
                title="Parliamone" 
                subtitle="Vuoi rendere più chiara e immediata la tua proposta di vendita? Contattaci per maggiori informazioni"
                align="left"
              />
              
              <div className="space-y-8 mt-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-primary shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">Email</h4>
                    <p className="text-muted-foreground">digiplanservice@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-4">DigiPlan service</h2>
          <p className="text-sm text-gray-500">
            &copy; 2026 DigiPlan service. Tutti i diritti riservati.
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">Termini e Condizioni</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
