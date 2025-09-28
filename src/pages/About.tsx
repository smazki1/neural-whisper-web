import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Coffee, Code, Palette, Moon, Sun, Mail, Phone, MapPin, Users, Target, Award } from "lucide-react";
import aviPhoto from "@/assets/avi-fried-photo.jpg";
import { Helmet } from "react-helmet-async";

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>About • loveabel.dev - Where Code Meets Heart</title>
        <meta name="description" content="The personal story behind loveabel.dev - a journey of passion, struggle, and the love for creating beautiful digital experiences that matter." />
        <meta name="keywords" content="loveabel.dev, web development, design, personal story, developer journey" />
        <meta property="og:title" content="About • loveabel.dev" />
        <meta property="og:description" content="The personal story behind loveabel.dev" />
        <meta property="og:image" content={aviPhoto} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6">
          <motion.div 
            className="max-w-7xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              {/* Content - Left Side */}
              <motion.div 
                variants={fadeInUp} 
                className="lg:col-span-7 space-y-8"
              >
                <div className="space-y-6">
                  <div className="inline-block">
                    <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-medium">
                      Hello, I'm
                    </span>
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[0.9]">
                    The human
                    <br />
                    <span className="font-medium bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                      behind the code
                    </span>
                  </h1>
                </div>

                <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">
                  <p className="text-xl">
                    I used to believe that perfect code was enough. That clean functions and elegant algorithms would speak for themselves.
                  </p>
                  
                  <p>
                    I was wrong.
                  </p>
                  
                  <p>
                    The most beautiful code in the world means nothing if it doesn't solve real problems for real people. If it doesn't make someone's day a little easier, their work a little more joyful, their dreams a little more attainable.
                  </p>
                </div>

                <div className="pt-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-[1px] bg-primary/40"></div>
                    <span className="text-sm text-muted-foreground font-medium tracking-wide">My journey begins with a question</span>
                  </div>
                </div>
              </motion.div>

              {/* Photo - Right Side */}
              <motion.div 
                variants={fadeInUp}
                className="lg:col-span-5 flex justify-center lg:justify-end"
              >
                <div className="relative">
                  <div className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl ring-4 ring-primary/10">
                    <img 
                      src={aviPhoto} 
                      alt="The founder of loveabel.dev"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent/30 rounded-full blur-sm animate-pulse"></div>
                  <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-primary/20 rounded-full blur-md animate-pulse delay-1000"></div>
                  
                  {/* Handwritten-style signature */}
                  <div className="absolute -bottom-8 -right-8 transform rotate-12">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-border/50">
                      <span className="text-sm font-handwriting text-primary">with love ♡</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-6 bg-muted/20">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-light">
                  How <em className="text-primary not-italic">failure</em> taught me everything
                </h2>
                <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
              </div>

              <Card className="p-10 md:p-16 shadow-xl border-0 bg-background/80 backdrop-blur-sm">
                <div className="space-y-8 text-lg leading-relaxed">
                  <p>
                    Three years ago, I launched what I thought would be my breakthrough project. I spent months perfecting every detail, every animation, every line of code. It was technically flawless.
                  </p>
                  
                  <p>
                    It failed spectacularly.
                  </p>
                  
                  <p>
                    Not because the code was bad—it was beautiful. Not because the design was poor—it was stunning. It failed because I had built something for myself, not for the people who needed it.
                  </p>
                  
                  <p className="text-primary font-medium">
                    That failure broke me. And then, slowly, it rebuilt me into someone better.
                  </p>
                  
                  <p>
                    I learned to listen. Really listen. To the quiet frustrations in a client's voice. To the unspoken needs behind their requests. To the story they're trying to tell through their business, their art, their passion.
                  </p>
                  
                  <p>
                    Now, when I write code, I'm not just solving technical problems. I'm crafting experiences that honor the dreams and struggles of the people who trust me with their vision.
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Philosophy Section */}
        <section className="py-20 px-6">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-light">
                My <em className="text-primary not-italic">approach</em> to creating
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Every project is a conversation between what you need and what's possible. Here's how I listen.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <Heart className="w-12 h-12 text-primary mb-6" />
                  <h3 className="text-2xl font-medium text-foreground mb-4">
                    Empathy-Driven Design
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Before I write a single line of code, I need to understand your world. Who are you serving? What keeps them up at night? What would make them smile when they use your product? Every design decision starts with genuine care for the human experience.
                  </p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full shadow-lg border-2 border-accent/10 hover:border-accent/30 transition-all duration-300">
                  <Code className="w-12 h-12 text-accent mb-6" />
                  <h3 className="text-2xl font-medium text-foreground mb-4">
                    Craftsmanship Over Speed
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    In a world obsessed with "moving fast and breaking things," I choose deliberate craft. Every component is built to last, every interaction is thoughtfully considered. Because your reputation—and your users' experience—deserves nothing less.
                  </p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full shadow-lg border-2 border-secondary/10 hover:border-secondary/30 transition-all duration-300">
                  <Palette className="w-12 h-12 text-secondary mb-6" />
                  <h3 className="text-2xl font-medium text-foreground mb-4">
                    Beauty with Purpose
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Aesthetics aren't decoration—they're communication. Every color, every spacing, every animation tells part of your story. I believe beautiful design isn't a luxury; it's how we show respect for the people using what we create.
                  </p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <Target className="w-12 h-12 text-primary mb-6" />
                  <h3 className="text-2xl font-medium text-foreground mb-4">
                    Sustainable Growth
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    I don't build for today—I build for the next five years. Scalable architecture, maintainable code, and designs that evolve with your business. Because the best solutions are the ones that grow alongside your dreams.
                  </p>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Personal Section */}
        <section className="py-20 px-6 bg-muted/20">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-light">
                When the <em className="text-primary not-italic">laptop closes</em>
              </h2>
              <p className="text-xl text-muted-foreground">
                The person behind the pixels
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-10 md:p-16 shadow-xl border-0 bg-background/80 backdrop-blur-sm">
                <div className="space-y-8 text-lg leading-relaxed">
                  <p>
                    I'm writing this at 5:47 AM with my second cup of coffee, watching the sunrise paint my studio walls gold. These quiet morning hours, before the world wakes up and demands start flooding in, are when I do my best thinking.
                  </p>
                  
                  <p>
                    You'll often find me here, lost in thought or sketching ideas on the back of receipts. I'm that person who gets genuinely excited about a perfectly crafted user flow, who notices the subtle animations in apps that make everything feel just right.
                  </p>
                  
                  <p>
                    When I'm not coding, I'm probably reading design philosophy books, experimenting with new brewing methods for coffee, or taking long walks where I solve my most complex problems without a computer in sight.
                  </p>
                  
                  <p className="text-primary font-medium">
                    I believe the best work comes from the intersection of technical skill and human understanding. And that the most important question we can ask isn't "Can we build this?" but "Should we build this, and will it make someone's life better?"
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6 text-center shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-all duration-300">
                <Coffee className="w-10 h-10 text-primary mx-auto mb-4" />
                <h4 className="font-medium text-foreground mb-2">Coffee Ritual</h4>
                <p className="text-sm text-muted-foreground">Every great idea starts with the perfect cup</p>
              </Card>
              
              <Card className="p-6 text-center shadow-lg border-2 border-accent/10 hover:border-accent/30 transition-all duration-300">
                <Moon className="w-10 h-10 text-accent mx-auto mb-4" />
                <h4 className="font-medium text-foreground mb-2">Night Owl</h4>
                <p className="text-sm text-muted-foreground">My best code happens after midnight</p>
              </Card>
              
              <Card className="p-6 text-center shadow-lg border-2 border-secondary/10 hover:border-secondary/30 transition-all duration-300">
                <Heart className="w-10 h-10 text-secondary mx-auto mb-4" />
                <h4 className="font-medium text-foreground mb-2">Purpose Driven</h4>
                <p className="text-sm text-muted-foreground">Every project needs to matter</p>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Vision Section */}
        <section className="py-20 px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-light">
                Why I do <em className="text-primary not-italic">this work</em>
              </h2>
              
              <Card className="p-10 md:p-16 shadow-xl border-0 bg-gradient-to-br from-background via-background/95 to-primary/5">
                <div className="space-y-8 text-lg leading-relaxed">
                  <p>
                    I've seen too many businesses struggle with digital experiences that don't serve them or their customers. Too many passionate creators held back by websites that don't capture their vision. Too many great ideas buried under poor execution.
                  </p>
                  
                  <p className="text-2xl font-light text-primary leading-relaxed">
                    I believe that thoughtful design and careful development can change that. Can amplify voices that deserve to be heard. Can turn visitors into believers, and believers into champions.
                  </p>
                  
                  <p>
                    This isn't just about building websites—it's about building bridges between you and the people who need what you offer. It's about creating digital spaces that feel as warm and welcoming as a conversation between friends.
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 px-6 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-light">
                Let's create something <em className="text-primary not-italic">meaningful</em> together
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                If my approach resonates with you, I'd love to hear about your project. Let's start with a conversation about your vision and see where it takes us.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                  <Mail className="w-5 h-5 mr-2" />
                  Start a Conversation
                </Button>
                
                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">hello@loveabel.dev</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default About;