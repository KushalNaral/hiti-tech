import { motion } from "framer-motion";
import { Link } from "wouter";
import logoSrc from "@assets/image_1779958981910.png";
import { SiReact, SiNodedotjs, SiPython, SiFlutter, SiDocker, SiPostgresql, SiNextdotjs } from "react-icons/si";
import { Terminal, Smartphone, Cloud, ShieldCheck, Zap, Database, ArrowRight, Code, Rocket, CheckCircle, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Work", href: "#work" },
  { name: "Tech Stack", href: "#tech" },
  { name: "Contact", href: "#contact" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary scroll-smooth">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/20 group-hover:border-primary/50 transition-colors">
                <img src={logoSrc} alt="HITI TECH Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">HITI TECH</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center">
            <Button asChild className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-[0_0_20px_rgba(0,232,80,0.3)]">
              <a href="#contact">Start a Project</a>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                Founded 2026 • Building the Future
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[1.1] mb-6"
              >
                Technical Precision. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Bold Ambition.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
              >
                We are a modern tech atelier crafting high-performance digital solutions. 
                From scalable cloud infrastructure to immersive web and mobile applications, 
                we engineer products that define industries.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base font-semibold shadow-[0_0_30px_rgba(0,232,80,0.4)]" asChild>
                  <a href="#contact">
                    Work With Us <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 hover:text-white h-14 px-8 text-base" asChild>
                  <a href="#work">Explore Portfolio</a>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-24 bg-card/30 border-y border-white/5 relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Capabilities</h2>
              <p className="text-muted-foreground text-lg max-w-xl">We deliver surgical, zero-fluff engineering across the entire modern technology stack.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Code, title: "Custom Software", desc: "Bespoke systems architected for your exact business logic and scale requirements." },
                { icon: Terminal, title: "Web Applications", desc: "High-performance, responsive web platforms built with modern React frameworks." },
                { icon: Smartphone, title: "Mobile Apps", desc: "Native-feeling iOS and Android experiences engineered with Flutter & React Native." },
                { icon: Cloud, title: "Cloud Solutions", desc: "Resilient infrastructure, serverless architectures, and seamless migrations on AWS." },
                { icon: ShieldCheck, title: "IT Consulting", desc: "Strategic technical guidance to future-proof your digital operations." },
                { icon: Zap, title: "UI/UX Design", desc: "Pixel-perfect, conversion-optimized interfaces that feel like magic." }
              ].map((service, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/30 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About & Why Us Combined */}
        <section id="about" className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Born in 2026.<br/>Built for the Future.</h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  HITI TECH was founded with a singular mission: to eliminate the friction between bold ideas and technical execution. We are a global collective of engineers, designers, and strategists obsessed with craft.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    "Uncompromising code quality",
                    "Rapid iteration cycles",
                    "Direct access to senior engineers",
                    "Scalable from day one"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-white">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="aspect-square rounded-3xl bg-card border border-white/5 overflow-hidden flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
                  <div className="w-48 h-48 rounded-full border border-primary/20 flex items-center justify-center relative animate-[spin_20s_linear_infinite]">
                     <div className="w-32 h-32 rounded-full border border-primary/40 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm border border-primary flex items-center justify-center shadow-[0_0_30px_rgba(0,232,80,0.5)]">
                           <Database className="w-6 h-6 text-primary" />
                        </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Portfolio / Work Showcase */}
        <section id="work" className="py-24 bg-card/30 border-y border-white/5">
           <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Selected Work</h2>
                <p className="text-muted-foreground text-lg max-w-xl">A glimpse into our engineering excellence across various domains.</p>
              </div>
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">View All Projects</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               {[
                 { name: "Aura FinTech", desc: "Next-gen banking infrastructure processing $10M+ daily.", tags: ["React", "Node.js", "AWS"] },
                 { name: "Nexus Health", desc: "HIPAA-compliant telemedicine platform with WebRTC.", tags: ["Next.js", "Python", "Docker"] },
                 { name: "Quantum Logistics", desc: "Global supply chain tracking with real-time geospatial data.", tags: ["React Native", "Go", "PostgreSQL"] },
                 { name: "Verge CRM", desc: "AI-powered customer relationship management for enterprise.", tags: ["Vue", "Python", "GCP"] }
               ].map((project, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: i * 0.1 }}
                   className="group cursor-pointer"
                 >
                   <div className="aspect-[4/3] rounded-2xl bg-card border border-white/5 overflow-hidden mb-6 relative">
                     <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                     <div className="absolute inset-0 flex items-center justify-center text-white/20 group-hover:scale-105 transition-transform duration-500 font-mono text-4xl">
                        {project.name.charAt(0)}
                     </div>
                   </div>
                   <div className="flex items-center justify-between mb-3">
                     <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{project.name}</h3>
                     <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                   </div>
                   <p className="text-muted-foreground mb-4">{project.desc}</p>
                   <div className="flex flex-wrap gap-2">
                     {project.tags.map(tag => (
                       <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-xs font-mono border border-white/5">{tag}</span>
                     ))}
                   </div>
                 </motion.div>
               ))}
            </div>
           </div>
        </section>

        {/* Tech Stack */}
        <section id="tech" className="py-24">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Technology Stack</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-16">We leverage modern, production-tested tools to build fast, secure, and maintainable software.</p>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
              {[
                { icon: SiReact, name: "React" },
                { icon: SiNextdotjs, name: "Next.js" },
                { icon: SiNodedotjs, name: "Node.js" },
                { icon: SiPython, name: "Python" },
                { icon: SiPostgresql, name: "PostgreSQL" },
                { icon: Cloud, name: "AWS" },
                { icon: SiDocker, name: "Docker" },
                { icon: SiFlutter, name: "Flutter" }
              ].map((tech, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.1, color: "var(--primary)" }}
                  className="flex flex-col items-center gap-3 group transition-colors cursor-pointer"
                >
                  <tech.icon className="w-12 h-12 md:w-16 md:h-16" />
                  <span className="text-sm font-medium font-mono">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-card/30 border-y border-white/5">
           <div className="container mx-auto px-4 md:px-6">
             <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Client Feedback</h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">Don't just take our word for it.</p>
             </div>
             
             <div className="grid md:grid-cols-3 gap-6">
               {[
                 { quote: "HITI TECH delivered our core product 3 months ahead of schedule. Their engineering standards are unmatched.", author: "Sarah Jenkins", role: "CTO, Aura FinTech" },
                 { quote: "The level of technical precision and strategic insight they brought to our cloud migration was extraordinary.", author: "Michael Chen", role: "VP Engineering, Nexus Health" },
                 { quote: "They don't just write code, they build scalable businesses. The best technical partners we've ever had.", author: "Elena Rodriguez", role: "Founder, Quantum Logistics" }
               ].map((test, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: i * 0.1 }}
                   className="p-8 rounded-2xl bg-background border border-white/5 relative"
                 >
                   <Quote className="w-10 h-10 text-primary/20 mb-6" />
                   <p className="text-white text-lg mb-8 leading-relaxed">"{test.quote}"</p>
                   <div>
                     <p className="font-bold text-white">{test.author}</p>
                     <p className="text-sm text-muted-foreground">{test.role}</p>
                   </div>
                 </motion.div>
               ))}
             </div>
           </div>
        </section>

        {/* CTA / Contact */}
        <section id="contact" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Ship?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">Stop compromising on technical excellence. Let's build something extraordinary together.</p>
            
            <div className="max-w-md mx-auto bg-card p-8 rounded-2xl border border-primary/20 shadow-[0_0_50px_rgba(0,232,80,0.1)] relative">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 blur-2xl rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary/20 blur-2xl rounded-full"></div>
              
              <form className="space-y-4 text-left relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Name</label>
                  <input type="text" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email</label>
                  <input type="email" className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Project Details</label>
                  <textarea className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors h-32 resize-none" placeholder="Tell us about what you want to build..."></textarea>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold shadow-[0_0_20px_rgba(0,232,80,0.2)]">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-background pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20">
                  <img src={logoSrc} alt="HITI TECH" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">HITI TECH</span>
              </div>
              <p className="text-muted-foreground max-w-sm mb-6">
                A modern tech atelier crafting high-performance digital solutions. Engineering products that define industries.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary/50 bg-card"><span className="text-sm font-bold">X</span></div></a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary/50 bg-card"><span className="text-sm font-bold">IN</span></div></a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary/50 bg-card"><span className="text-sm font-bold">GH</span></div></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#about" className="text-muted-foreground hover:text-white transition-colors">About Us</a></li>
                <li><a href="#services" className="text-muted-foreground hover:text-white transition-colors">Services</a></li>
                <li><a href="#work" className="text-muted-foreground hover:text-white transition-colors">Work</a></li>
                <li><a href="#contact" className="text-muted-foreground hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              &copy; 2026 HITI TECH. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with precision</span>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}