import { Check, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  features: PricingFeature[];
  isPopular?: boolean;
  onSelect: () => void;
  delay?: number;
}

export function PricingCard({ 
  title, 
  price, 
  description, 
  features, 
  isPopular = false,
  onSelect,
  delay = 0 
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative p-6 md:p-8 rounded-[2rem] border transition-all duration-300 bg-white border-border/50 shadow-lg hover:border-primary/20 hover:shadow-xl ml-0 mr-0 md:ml-[45px] md:mr-[45px]"
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold shadow-lg shadow-primary/30">
          Più Scelto
        </div>
      )}
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">€{price}</span>
            <span className="text-muted-foreground">/planimetria</span>
          </div>

        </div>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, i) => (
          <li key={i} className={`flex items-start gap-3 text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
            <div className={`mt-0.5 rounded-full p-0.5 ${feature.included ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
              {feature.included ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <Plus className="w-3.5 h-3.5" strokeWidth={3} />}              
            </div>
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        className={`
          w-full py-3.5 rounded-xl font-semibold transition-all duration-300
          ${isPopular
            ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5'
            : 'bg-secondary text-gray-900 hover:bg-gray-200'
          }
        `}
      >
        Scopri di più
      </button>
    </motion.div>
  );
}
