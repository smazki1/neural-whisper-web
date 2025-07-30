import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Zap, 
  Star, 
  CheckCircle, 
  Crown, 
  Rocket, 
  Shield,
  ArrowRight,
  Play,
  Award,
  BarChart3,
  Lightbulb,
  Gauge,
  Map,
  Megaphone,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import heroBackground from '@/assets/backgrounds/hero/hero-background-01.png';

const AIStrategyCourse = () => {
  const [isContactModalOpen, setIsContactModalOpen] = React.useState(false);

  // Floating Elements Animation
  const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotate: [0, 1, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    >
      {children}
    </motion.div>
  );

  const Sparkle = ({ size = 4, delay = 0 }: { size?: number; delay?: number }) => (
    <motion.div
      className={`absolute w-${size} h-${size} bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full opacity-70`}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white font-heebo" dir="rtl">
      <Navbar onContactClick={() => setIsContactModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 opacity-95"
            style={{
              backgroundImage: `url(${heroBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Neural Network Overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 1000 1000">
              <defs>
                <pattern id="neural" patternUnits="userSpaceOnUse" width="100" height="100">
                  <circle cx="20" cy="20" r="2" fill="#fbbf24" opacity="0.3"/>
                  <circle cx="80" cy="20" r="2" fill="#3b82f6" opacity="0.3"/>
                  <circle cx="50" cy="80" r="2" fill="#7c3aed" opacity="0.3"/>
                  <line x1="20" y1="20" x2="80" y2="20" stroke="#fbbf24" strokeWidth="1" opacity="0.2"/>
                  <line x1="50" y1="80" x2="20" y2="20" stroke="#3b82f6" strokeWidth="1" opacity="0.2"/>
                  <line x1="50" y1="80" x2="80" y2="20" stroke="#7c3aed" strokeWidth="1" opacity="0.2"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#neural)"/>
            </svg>
          </div>
          {/* Floating Sparkles */}
          <Sparkle size={2} delay={0} />
          <Sparkle size={3} delay={1.5} />
          <Sparkle size={1} delay={3} />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                AI Strategist
              </span>
            </h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 mb-8"
            >
              <span className="text-xl md:text-2xl text-gray-300">
                קורס אסטרטגי ב-
                <span className="text-yellow-400 font-bold mx-2">3 מפגשים</span>
                לבעלי עסקים
              </span>
            </motion.div>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              הפכו ל-AI Strategist והובילו את העסק שלכם לעידן החדש
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="px-12 py-6 text-xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-full shadow-2xl border-2 border-yellow-400"
                onClick={() => setIsContactModalOpen(true)}
              >
                <Crown className="ml-2 h-6 w-6" />
                הפכו לאסטרטגים
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Transformation Path */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              מסלול ההתקדמות
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              מיודע טכני לאסטרטג עסקי למוביל שוק
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "יודע להשתמש",
                subtitle: "המצב הנוכחי",
                icon: <Users className="h-12 w-12" />,
                color: "from-gray-500 to-gray-600",
                description: "שימוש בסיסי בכלי AI ליצירת תוכן ומשימות יומיומיות",
                metrics: ["יעילות +30%", "זמן חיסכון", "כלים בסיסיים"]
              },
              {
                title: "חושב אסטרטגית",
                subtitle: "אחרי המפגש הראשון",
                icon: <Brain className="h-12 w-12" />,
                color: "from-blue-500 to-blue-600",
                description: "הבנה עמוקה של היכן ואיך להשתמש ב-AI לצמיחה עסקית",
                metrics: ["ROI +150%", "תובנות עמוקות", "יתרון תחרותי"]
              },
              {
                title: "מוביל שוק",
                subtitle: "בסיום הקורס",
                icon: <Crown className="h-12 w-12" />,
                color: "from-yellow-500 to-yellow-600",
                description: "מערכות אוטומטיות שמזהות הזדמנויות ומובילות החדשנות",
                metrics: ["צמיחה +300%", "הובלת טרנדים", "דומיננטיות"]
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className={`bg-gradient-to-br ${step.color} p-8 rounded-3xl shadow-2xl backdrop-blur-lg border border-white/10 h-full`}>
                  <div className="text-center mb-6">
                    <div className="inline-block p-4 rounded-full bg-white/10 mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-white/80">{step.subtitle}</p>
                  </div>
                  <p className="text-center mb-6 text-white/90">{step.description}</p>
                  <div className="space-y-2">
                    {step.metrics.map((metric, i) => (
                      <div key={i} className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-400 ml-2" />
                        <span className="text-sm">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -left-6 transform -translate-y-1/2 text-4xl text-yellow-400">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategy Timeline */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-yellow-500 bg-clip-text text-transparent">
              מסלול האסטרטגיה
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              3 מפגשים אסטרטגיים עם פלטים קונקרטיים
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 transform -translate-y-1/2 hidden md:block" />
            
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  number: "01",
                  title: "אסטרטגיית שוק ומיקום תחרותי",
                  duration: "3 שעות",
                  icon: <Map className="h-8 w-8" />,
                  color: "from-blue-600 to-blue-700",
                  outputs: [
                    "מפת אסטרטגיה עסקית מלאה",
                    "דוח הזדמנויות אישי",
                    "מטריקס תחרותיות"
                  ],
                  focus: "ניתוח נישה, זיהוי הזדמנויות, מיפוי טרנדים עתידיים"
                },
                {
                  number: "02", 
                  title: "מיתוג ומסרים אסטרטגיים",
                  duration: "3 שעות",
                  icon: <Megaphone className="h-8 w-8" />,
                  color: "from-purple-600 to-purple-700",
                  outputs: [
                    "מדריך מותג מלא",
                    "בנק מסרים לכל מצב",
                    "3 הצעות ערך מותאמות"
                  ],
                  focus: "פיתוח קול מותג, אסטרטגיית מסרים, הצעות ערך חדשניות"
                },
                {
                  number: "03",
                  title: "מערכות שיווק ואופטימיזציה", 
                  duration: "3 שעות",
                  icon: <Settings className="h-8 w-8" />,
                  color: "from-yellow-600 to-yellow-700",
                  outputs: [
                    "מערכת שיווק אוטומטית מלאה",
                    "מדריך אופטימיזציה",
                    "דאשבורד מדידת ROI"
                  ],
                  focus: "יצירת תוכן מערכתי, אופטימיזציית המרות, מערכות לידים"
                }
              ].map((session, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.3 }}
                  className="relative z-10"
                >
                  <div className={`bg-gradient-to-br ${session.color} p-8 rounded-3xl shadow-2xl backdrop-blur-lg border border-white/10 relative overflow-hidden group hover:scale-105 transition-transform duration-300`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                      <div className="absolute top-4 right-4 text-6xl font-bold text-white/20">
                        {session.number}
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center mb-6">
                        <div className="p-3 rounded-full bg-white/20 ml-4">
                          {session.icon}
                        </div>
                        <div>
                          <div className="text-sm text-white/80 mb-1">מפגש {session.number}</div>
                          <div className="text-sm text-yellow-300">{session.duration}</div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4 leading-tight">{session.title}</h3>
                      <p className="text-white/90 mb-6 text-sm leading-relaxed">{session.focus}</p>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-yellow-300">פלטי המפגש:</h4>
                        {session.outputs.map((output, i) => (
                          <div key={i} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-400 ml-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-white/90">{output}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Packages */}
      <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              חבילות הערך
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              מה תקבלו מעבר לידע - כלים ומערכות פעילות
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "כלים אסטרטגיים",
                icon: <Target className="h-12 w-12" />,
                roi: "500%",
                items: [
                  "500+ פרומפטים מתקדמים",
                  "דאשבורד ניהול אסטרטגיה",
                  "תבניות לבניית מערכות",
                  "גישה לכלים פרימיום"
                ]
              },
              {
                title: "ליווי והטמעה",
                icon: <Shield className="h-12 w-12" />,
                roi: "300%",
                items: [
                  "3 חודשי ליווי אישי",
                  "6 חודשי עדכונים",
                  "קבוצה סגורה VIP",
                  "זום חודשי לטרנדים"
                ]
              },
              {
                title: "מערכות אוטומטיות",
                icon: <Zap className="h-12 w-8" />,
                roi: "800%",
                items: [
                  "מערכת שיווק מלאה",
                  "אופטימיזציה אוטומטית",
                  "מדידת ROI בזמן אמת",
                  "זיהוי הזדמנויות חכם"
                ]
              }
            ].map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:border-yellow-400/50 transition-all duration-300 h-full">
                  <div className="text-center mb-6">
                    <div className="inline-block p-4 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 mb-4">
                      {pkg.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                    <div className="text-4xl font-bold text-yellow-400 mb-2">+{pkg.roi}</div>
                    <div className="text-sm text-gray-400">צפוי ROI</div>
                  </div>
                  
                  <div className="space-y-3">
                    {pkg.items.map((item, i) => (
                      <div key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 ml-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Wheel */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              גלגל ההצלחה
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              מה קורה אחרי הקורס - התקדמות חודש אחר חודש
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Timeline */}
              <div className="space-y-8">
                {[
                  {
                    month: "חודש 1",
                    title: "יישום האסטרטגיה",
                    metric: "30-50%",
                    description: "שיפור ביעילות השיווק",
                    color: "from-blue-500 to-blue-600"
                  },
                  {
                    month: "חודש 2-3",
                    title: "אופטימיזציה והתאמה",
                    metric: "70-100%",
                    description: "שיפור במטריקות מפתח", 
                    color: "from-purple-500 to-purple-600"
                  },
                  {
                    month: "חודש 4-6",
                    title: "חדשנות והובלה",
                    metric: "180%+",
                    description: "הפיכה ל-AI Business Leader",
                    color: "from-yellow-500 to-yellow-600"
                  }
                ].map((phase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.3 }}
                    className="relative"
                  >
                    <div className={`bg-gradient-to-r ${phase.color} p-6 rounded-2xl backdrop-blur-lg border border-white/10`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-white/80">{phase.month}</div>
                        <div className="text-2xl font-bold text-white">{phase.metric}</div>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{phase.title}</h3>
                      <p className="text-white/90">{phase.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Visual Wheel */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="w-80 h-80 mx-auto relative"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/20 via-blue-500/20 to-purple-500/20 border-4 border-yellow-400/30" />
                  {[...Array(6)].map((_, i) => {
                    const angle = (i * 60) - 90;
                    const x = 120 * Math.cos(angle * Math.PI / 180);
                    const y = 120 * Math.sin(angle * Math.PI / 180);
                    return (
                      <motion.div
                        key={i}
                        className="absolute w-6 h-6 bg-yellow-400 rounded-full shadow-lg"
                        style={{
                          left: `calc(50% + ${x}px - 12px)`,
                          top: `calc(50% + ${y}px - 12px)`,
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3
                        }}
                      />
                    );
                  })}
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">6</div>
                    <div className="text-sm text-gray-300">חודשים</div>
                    <div className="text-xs text-gray-400">התקדמות</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-yellow-500 bg-clip-text text-transparent">
              השקעה אסטרטגית
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              תשואה מובטחת על ההשקעה בידע האסטרטגי
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl shadow-2xl border border-yellow-400/30 relative overflow-hidden"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-purple-500/10 rounded-3xl" />
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-block px-6 py-2 bg-yellow-400/20 rounded-full mb-4">
                    <span className="text-yellow-400 font-semibold">מוגבל ל-8 משתתפים בלבד</span>
                  </div>
                  <div className="text-6xl font-bold text-yellow-400 mb-4">₪3,497</div>
                  <div className="text-gray-400 mb-2">תשלום חד-פעמי</div>
                  <div className="text-lg text-gray-300">או 3 תשלומים של ₪1,297</div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-yellow-400 mb-3">כלול בקורס:</h4>
                    {[
                      "9 שעות אסטרטגיה עסקית",
                      "כל האסטרטגיות והכלים",
                      "מערכות אוטומטיות מלאות",
                      "500+ פרומפטים מתקדמים"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-400 ml-2" />
                        <span className="text-gray-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-yellow-400 mb-3">ליווי והטמעה:</h4>
                    {[
                      "3 חודשי ליווי אישי",
                      "6 חודשי עדכונים",
                      "קבוצה סגורה VIP",
                      "גישה לכלים פרימיום"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-400 ml-2" />
                        <span className="text-gray-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-green-400 ml-2" />
                    <span className="text-xl font-semibold text-green-400">אחריות מלאה</span>
                  </div>
                  <p className="text-center text-gray-300">
                    30 יום אחריות מלאה - אם לא תרגישו שקיבלתם ערך של לפחות פי 10 מההשקעה, תקבלו החזר כספי מלא
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-center"
                >
                  <Button 
                    className="w-full py-6 text-xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-full shadow-2xl"
                    onClick={() => setIsContactModalOpen(true)}
                  >
                    <Rocket className="ml-2 h-6 w-6" />
                    הצטרפו עכשיו - מקומות מוגבלים
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-6xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              הגיע הזמן להוביל
            </h2>
            <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
              בעוד שאחרים עדיין מנסים להבין את AI, אתם כבר תהיו צעד אחד קדימה עם אסטרטגיה עסקית מנצחת
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="px-16 py-8 text-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold rounded-full shadow-2xl border-2 border-yellow-400"
                onClick={() => setIsContactModalOpen(true)}
              >
                <Crown className="ml-3 h-8 w-8" />
                הפכו ל-AI Strategist עכשיו
                <ArrowRight className="mr-3 h-8 w-8" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
};

export default AIStrategyCourse;