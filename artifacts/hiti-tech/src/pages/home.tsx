import { motion } from "framer-motion";
import logoSrc from "@assets/image_1779958981910.png";
import { SiReact, SiNodedotjs, SiPython, SiFlutter, SiDocker, SiPostgresql, SiNextdotjs } from "react-icons/si";
import { Terminal, Smartphone, Cloud, ShieldCheck, Zap, Database, ArrowRight, Code, CheckCircle, Quote, Globe, Server } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Work", href: "#work" },
  { name: "Tech Stack", href: "#tech" },
  { name: "Contact", href: "#contact" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-border">
              <img src={logoSrc} alt="HITI TECH" className="w-full h-full object-cover" />
            </div>
            <span className="font-semibold text-base tracking-tight text-foreground">HITI TECH</span>
          </a>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <Button asChild size="sm" className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
            <a href="#contact">Start a Project</a>
          </Button>
        </div>
      </header>

      <main>

        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="relative pt-36 pb-28 md:pt-52 md:pb-40 overflow-hidden">
          {/* Subtle radial wash — one, positioned, low opacity */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(142 62% 39% / 0.08) 0%, transparent 70%)" }}
          />

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={0}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/8 text-sm font-medium text-primary mb-8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Founded 2026 · Building the Future
              </motion.div>

              <motion.h1
                variants={fadeUp} initial="hidden" animate="visible" custom={1}
                className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.08] mb-6"
              >
                Technical Precision.<br />
                <span className="text-primary">Bold Ambition.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed"
              >
                We are a modern software house crafting high-performance digital products.
                From cloud infrastructure to mobile applications, we engineer software that scales.
              </motion.p>

              <motion.div
                variants={fadeUp} initial="hidden" animate="visible" custom={3}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-7 text-sm font-semibold">
                  <a href="#contact">
                    Work With Us <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-border text-foreground hover:bg-secondary h-12 px-7 text-sm">
                  <a href="#work">View Our Work</a>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Stats bar ─────────────────────────────────────── */}
        <div className="border-y border-border bg-card">
          <div className="container mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "50+", label: "Projects Delivered" },
                { value: "98%", label: "Client Satisfaction" },
                { value: "12+", label: "Countries Served" },
                { value: "2026", label: "Founded" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                >
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Services ──────────────────────────────────────── */}
        <section id="services" className="py-28">
          <div className="container mx-auto px-6">
            <div className="max-w-xl mb-16">
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">What We Do</p>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Core Capabilities</h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Full-stack engineering from first sprint to production scale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {[
                { icon: Code, title: "Custom Software", desc: "Bespoke systems architected for your exact business logic, scale, and long-term maintainability." },
                { icon: Globe, title: "Web Applications", desc: "High-performance, accessible web platforms built on modern React and server-side frameworks." },
                { icon: Smartphone, title: "Mobile Apps", desc: "Native-quality iOS and Android experiences built with Flutter and React Native." },
                { icon: Cloud, title: "Cloud Solutions", desc: "Resilient cloud infrastructure, serverless architectures, and zero-downtime migrations on AWS." },
                { icon: ShieldCheck, title: "IT Consulting", desc: "Strategic technical guidance to modernise, future-proof, and secure your digital operations." },
                { icon: Zap, title: "UI/UX Design", desc: "Conversion-focused interfaces designed with precision — from wireframe to production asset." },
              ].map((service, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 3}
                  className="bg-background p-8 group hover:bg-card transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/12 flex items-center justify-center mb-6 text-primary">
                    <service.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-3">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About ─────────────────────────────────────────── */}
        <section id="about" className="py-28 bg-card border-y border-border">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              >
                <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Our Story</p>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                  Born in 2026.<br />Built for the Future.
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-8">
                  HITI TECH was founded with a singular mission: eliminate the friction between ambitious ideas and
                  rigorous technical execution. We are a global collective of engineers, designers, and strategists
                  who care deeply about craft.
                </p>
                <div className="space-y-3">
                  {[
                    "Uncompromising code quality and review standards",
                    "Rapid, transparent iteration cycles",
                    "Direct access to senior engineers — no account managers",
                    "Architecture that scales from prototype to millions of users",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right: clean metric grid instead of spinning circles */}
              <motion.div
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { icon: Server, label: "Uptime SLA", value: "99.9%" },
                  { icon: Zap, label: "Avg. Delivery", value: "6 wks" },
                  { icon: Globe, label: "Time Zones", value: "Global" },
                  { icon: Database, label: "Data Handled", value: "TB-scale" },
                ].map((m, i) => (
                  <div key={i} className="rounded-xl border border-border bg-background p-6">
                    <m.icon className="w-5 h-5 text-primary mb-4" />
                    <div className="text-2xl font-bold text-foreground mb-1">{m.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">{m.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Work ──────────────────────────────────────────── */}
        <section id="work" className="py-28">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Portfolio</p>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3">Selected Work</h2>
                <p className="text-muted-foreground text-base max-w-md">
                  A cross-section of our engineering work across industries.
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-card self-start md:self-auto">
                View All Projects
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: "Aura FinTech", category: "Financial Technology", desc: "Core banking infrastructure processing $10M+ in daily transactions with sub-50ms API response times.", tags: ["React", "Node.js", "AWS", "PostgreSQL"] },
                { name: "Nexus Health", category: "Healthcare", desc: "HIPAA-compliant telemedicine platform supporting 10,000+ consultations per month via WebRTC.", tags: ["Next.js", "Python", "Docker", "Redis"] },
                { name: "Quantum Logistics", category: "Supply Chain", desc: "Global freight tracking with real-time geospatial data across 80+ countries.", tags: ["React Native", "Go", "PostgreSQL"] },
                { name: "Verge CRM", category: "Enterprise SaaS", desc: "AI-powered customer relationship management platform for Fortune 500 sales teams.", tags: ["Vue", "Python", "GCP", "Elasticsearch"] },
              ].map((project, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 2}
                  className="group rounded-xl border border-border bg-card hover:border-primary/40 transition-colors overflow-hidden"
                >
                  {/* Project colour swatch */}
                  <div className="h-40 bg-background flex items-center justify-center border-b border-border">
                    <div className="font-mono text-6xl font-bold text-border group-hover:text-primary/30 transition-colors select-none">
                      {project.name.charAt(0)}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-medium text-primary mb-2 uppercase tracking-widest">{project.category}</p>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-foreground">{project.name}</h3>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-md bg-secondary text-xs font-mono text-muted-foreground border border-border">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tech Stack ────────────────────────────────────── */}
        <section id="tech" className="py-28 bg-card border-y border-border">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Technology</p>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Our Stack</h2>
              <p className="text-muted-foreground text-base">Modern, production-tested tools chosen for performance, reliability, and developer experience.</p>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
              {[
                { icon: SiReact, name: "React" },
                { icon: SiNextdotjs, name: "Next.js" },
                { icon: SiNodedotjs, name: "Node.js" },
                { icon: SiPython, name: "Python" },
                { icon: SiPostgresql, name: "PostgreSQL" },
                { icon: Cloud, name: "AWS" },
                { icon: SiDocker, name: "Docker" },
                { icon: SiFlutter, name: "Flutter" },
              ].map((tech, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 4}
                  className="flex flex-col items-center gap-2.5 group"
                >
                  <div className="w-12 h-12 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors">
                    <tech.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────── */}
        <section className="py-28">
          <div className="container mx-auto px-6">
            <div className="max-w-xl mb-16">
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Testimonials</p>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Client Feedback</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { quote: "HITI TECH delivered our core product three months ahead of schedule. Their engineering standards are genuinely unmatched.", author: "Sarah Jenkins", role: "CTO, Aura FinTech" },
                { quote: "The technical precision and strategic insight they brought to our cloud migration was extraordinary. Zero surprises.", author: "Michael Chen", role: "VP Engineering, Nexus Health" },
                { quote: "They don't just write code — they build scalable businesses. The best technical partners we've worked with.", author: "Elena Rodriguez", role: "Founder, Quantum Logistics" },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className="rounded-xl border border-border bg-card p-8"
                >
                  <Quote className="w-8 h-8 text-primary/30 mb-5" />
                  <p className="text-sm text-foreground leading-relaxed mb-6">"{t.quote}"</p>
                  <div className="border-t border-border pt-5">
                    <p className="text-sm font-semibold text-foreground">{t.author}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ───────────────────────────────────────── */}
        <section id="contact" className="py-28 bg-card border-t border-border">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Get In Touch</p>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                  Ready to<br />Build Something?
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-8">
                  Stop compromising on technical quality. Tell us what you want to build —
                  we'll tell you exactly how to ship it.
                </p>
                <div className="space-y-4">
                  {[
                    { label: "Email", value: "hello@hititech.io" },
                    { label: "Response Time", value: "Within 24 hours" },
                    { label: "Availability", value: "Global, async-first" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground w-28 shrink-0">{item.label}</span>
                      <span className="text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background p-8">
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-2">Name</label>
                      <input
                        type="text"
                        className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-2">Company</label>
                    <input
                      type="text"
                      className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-2">Tell Us About Your Project</label>
                    <textarea
                      className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all h-32 resize-none"
                      placeholder="What are you trying to build? What's the timeline?"
                    />
                  </div>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm font-semibold">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-border">
                  <img src={logoSrc} alt="HITI TECH" className="w-full h-full object-cover" />
                </div>
                <span className="font-semibold text-base text-foreground">HITI TECH</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
                A modern software house crafting high-performance digital products. Engineering software that defines industries.
              </p>
              <div className="flex gap-3">
                {["X", "IN", "GH"].map((s) => (
                  <a key={s} href="#" className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                    {s}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-foreground mb-5">Company</h4>
              <ul className="space-y-3">
                {["About Us", "Services", "Work", "Contact"].map((l) => (
                  <li key={l}>
                    <a href={`#${l.toLowerCase().replace(" ", "")}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-foreground mb-5">Legal</h4>
              <ul className="space-y-3">
                {["Privacy Policy", "Terms of Service"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2026 HITI TECH. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Built with precision
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
