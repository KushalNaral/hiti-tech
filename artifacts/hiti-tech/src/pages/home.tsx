import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import logoSrc from "@assets/image_1779958981910.png";
import { SiReact, SiNodedotjs, SiPython, SiFlutter, SiDocker, SiPostgresql, SiNextdotjs } from "react-icons/si";
import { Cloud, ArrowRight, ArrowUpRight, Menu, X, CheckCircle, Sun, Moon } from "lucide-react";
import {
  useSubmitContact,
  useGetPublicServices,
  useGetPublicProjects,
  useGetPublicTestimonials,
} from "@workspace/api-client-react";
import { useTheme } from "@/contexts/theme";

/* ─── helpers ──────────────────────────────────────────────────────── */

function Marquee({ children, speed = 40 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (ref.current) setWidth(ref.current.scrollWidth / 2);
  }, []);
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        ref={ref}
        animate={width ? { x: [-width, 0] } : {}}
        transition={{ duration: width / speed, ease: "linear", repeat: Infinity }}
        className="inline-flex"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

const techItems = [
  { icon: SiReact, name: "React" },
  { icon: SiNextdotjs, name: "Next.js" },
  { icon: SiNodedotjs, name: "Node.js" },
  { icon: SiPython, name: "Python" },
  { icon: SiPostgresql, name: "PostgreSQL" },
  { icon: Cloud, name: "AWS" },
  { icon: SiDocker, name: "Docker" },
  { icon: SiFlutter, name: "Flutter" },
];

const navLinks = [
  { name: "Services", href: "#services" },
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

/* ─── main component ────────────────────────────────────────────────── */

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [contactForm, setContactForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const submitContact = useSubmitContact({
    mutation: {
      onSuccess: () => { setSubmitted(true); setContactForm({ name: "", email: "", company: "", message: "" }); },
    },
  });

  const { data: services = [] } = useGetPublicServices();
  const { data: projects = [] } = useGetPublicProjects();
  const { data: testimonials = [] } = useGetPublicTestimonials();

  const featuredProject = projects[0];
  const moreProjects = projects.slice(1);
  const featuredTestimonial = testimonials.find((t) => t.featured) ?? testimonials[0];
  const otherTestimonials = testimonials.filter((t) => t.id !== featuredTestimonial?.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Navbar ──────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 mix-blend-normal">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 z-50 relative">
            <img src={logoSrc} alt="HITI TECH" className="w-7 h-7 rounded-full object-cover ring-1 ring-border" />
            <span className="font-semibold text-sm tracking-tight">HITI TECH</span>
          </a>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((l) => (
              <a key={l.name} href={l.href} className="text-xs font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors uppercase">
                {l.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card border border-transparent hover:border-border transition-all"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a href="/dashboard" className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide ml-1">
              Dashboard
            </a>
            <a href="#contact" className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors rounded-full px-4 py-2">
              Start a Project <ArrowRight className="w-3 h-3" />
            </a>
            <button className="md:hidden text-foreground z-50 relative" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute inset-x-0 top-16 bg-background border-b border-border px-6 pb-6 pt-4 flex flex-col gap-4"
          >
            {navLinks.map((l) => (
              <a key={l.name} href={l.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                {l.name}
              </a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-primary">Start a Project →</a>
          </motion.div>
        )}
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">

        {/* Background label */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span
            className="text-[22vw] font-black tracking-tighter leading-none text-foreground/[0.03]"
            aria-hidden
          >
            HITI
          </span>
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          {/* eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-10"
          >
            <span className="block w-10 h-px bg-primary" />
            <span className="text-xs font-mono text-primary tracking-widest uppercase">Software · Since 2026</span>
          </motion.div>

          {/* headline */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(52px,9vw,130px)] font-black tracking-tighter leading-[0.9] text-foreground"
            >
              We Build<br />
              <span className="text-primary">Software</span><br />
              That Scales.
            </motion.h1>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-10 md:gap-20">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-base text-muted-foreground max-w-sm leading-relaxed"
            >
              A modern software house crafting high-performance digital products — from cloud infrastructure to mobile applications.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex gap-4 items-center"
            >
              <a href="#contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full px-6 py-3 hover:bg-primary/90 transition-colors">
                Start a Project <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#work" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border">
                View Work
              </a>
            </motion.div>
          </div>

          {/* bottom stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-20 pt-8 border-t border-border flex flex-wrap gap-8 md:gap-16"
          >
            {[
              { n: "50+", l: "Projects" },
              { n: "98%", l: "Satisfaction" },
              { n: "12+", l: "Countries" },
              { n: "99.9%", l: "Uptime SLA" },
            ].map((s) => (
              <div key={s.n}>
                <div className="text-2xl font-bold text-foreground">{s.n}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Marquee strip ────────────────────────────────────── */}
      <div className="border-y border-border py-4 overflow-hidden">
        <Marquee speed={55}>
          {["Custom Software", "Web Apps", "Mobile Apps", "Cloud Infrastructure", "IT Consulting", "UI/UX Design", "API Development", "System Architecture"].map((item) => (
            <span key={item} className="inline-flex items-center gap-4 mx-6 text-xs font-mono uppercase tracking-widest text-muted-foreground">
              <span className="w-1 h-1 rounded-full bg-primary" />
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      {/* ── Services ─────────────────────────────────────────── */}
      <section id="services" className="py-28">
        <div className="container mx-auto px-6">

          <div className="flex items-baseline justify-between mb-16 border-b border-border pb-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              01 — What We Do
            </h2>
            <span className="text-xs text-muted-foreground">
              {services.length > 0 ? `${services.length} specialisms` : ""}
            </span>
          </div>

          <div className="divide-y divide-border">
            {services.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground font-mono">
                Services coming soon.
              </div>
            ) : (
              services.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="group grid grid-cols-[48px_1fr_auto] md:grid-cols-[80px_1fr_1fr_auto] items-center gap-6 py-7 cursor-default hover:bg-card/60 -mx-6 px-6 transition-colors"
                >
                  <span className="text-xs font-mono text-muted-foreground">{s.number}</span>
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground">{s.title}</h3>
                  <p className="hidden md:block text-sm text-muted-foreground leading-relaxed max-w-sm">{s.description}</p>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Work ──────────────────────────────────────────────── */}
      <section id="work" className="py-28 bg-card border-y border-border">
        <div className="container mx-auto px-6">

          <div className="flex items-baseline justify-between mb-16 border-b border-border pb-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">02 — Selected Work</h2>
            <a href="#work" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border">
              {projects.length > 0 ? `${projects.length} projects` : ""}
            </a>
          </div>

          {projects.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground font-mono">
              Portfolio projects coming soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

              {/* Large featured card */}
              {featuredProject && (
                <motion.a
                  href={`/projects/${featuredProject.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`group rounded-2xl border border-border bg-background overflow-hidden hover:border-primary/40 transition-colors block ${moreProjects.length > 0 ? "md:col-span-7" : "md:col-span-12"}`}
                >
                  <div className="h-64 bg-card flex items-center justify-center border-b border-border relative overflow-hidden">
                    <span className="font-black text-[120px] leading-none text-border group-hover:text-primary/20 transition-colors select-none">
                      {featuredProject.name[0]}
                    </span>
                    <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="p-7">
                    <p className="text-xs font-mono text-primary mb-2 uppercase tracking-widest">{featuredProject.category}</p>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{featuredProject.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{featuredProject.description}</p>
                    {featuredProject.tags && featuredProject.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {featuredProject.tags.map((t) => (
                          <span key={t} className="text-xs font-mono text-muted-foreground bg-secondary border border-border rounded px-2.5 py-1">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.a>
              )}

              {/* Right column — smaller cards */}
              {moreProjects.length > 0 && (
                <div className="md:col-span-5 flex flex-col gap-4">
                  {moreProjects.slice(0, 3).map((p, i) => (
                    <motion.a
                      key={p.id}
                      href={`/projects/${p.id}`}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="group flex-1 rounded-2xl border border-border bg-background overflow-hidden hover:border-primary/40 transition-colors flex"
                    >
                      <div className="w-14 md:w-16 bg-card border-r border-border flex items-center justify-center shrink-0">
                        <span className="font-black text-3xl text-border group-hover:text-primary/30 transition-colors select-none">{p.name[0]}</span>
                      </div>
                      <div className="p-4 flex flex-col justify-center min-h-[100px]">
                        <p className="text-xs font-mono text-primary mb-1 uppercase tracking-widest">{p.category}</p>
                        <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{p.description}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────── */}
      <section id="about" className="py-28">
        <div className="container mx-auto px-6">

          <div className="flex items-baseline justify-between mb-16 border-b border-border pb-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">03 — Our Story</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <blockquote className="text-2xl md:text-4xl font-semibold text-foreground leading-tight mb-10">
                "Eliminate the friction between bold ideas and rigorous technical execution."
              </blockquote>
              <p className="text-sm text-muted-foreground leading-relaxed">
                HITI TECH was founded in 2026 with that single conviction. We are a global collective
                of engineers, designers, and strategists who measure success by the products we ship —
                not the process we follow.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-0 divide-y divide-border border-y border-border"
            >
              {[
                { label: "Code Quality", value: "Zero-compromise review standards" },
                { label: "Delivery", value: "Rapid, transparent iteration cycles" },
                { label: "Access", value: "Direct line to senior engineers" },
                { label: "Architecture", value: "Scales from MVP to millions of users" },
                { label: "Reach", value: "Clients across 12+ countries" },
              ].map((row) => (
                <div key={row.label} className="flex items-baseline justify-between py-5 group">
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{row.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Tech strip ────────────────────────────────────────── */}
      <div className="border-y border-border py-10 bg-card">
        <div className="container mx-auto px-6 mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">04 — Technology Stack</span>
        </div>
        <Marquee speed={45}>
          {techItems.map((t) => (
            <span key={t.name} className="inline-flex items-center gap-2.5 mx-8 text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
              <t.icon className="w-4 h-4" />
              {t.name}
            </span>
          ))}
        </Marquee>
      </div>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="py-28">
        <div className="container mx-auto px-6">

          <div className="flex items-baseline justify-between mb-16 border-b border-border pb-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">05 — Client Feedback</h2>
          </div>

          {testimonials.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground font-mono">
              Client testimonials coming soon.
            </div>
          ) : (
            <div className="grid md:grid-cols-12 gap-6">
              {/* Featured */}
              {featuredTestimonial && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`rounded-2xl border border-primary/30 bg-card p-10 ${otherTestimonials.length > 0 ? "md:col-span-7" : "md:col-span-12"}`}
                >
                  <p className="text-primary text-xs font-mono uppercase tracking-widest mb-6">
                    {featuredTestimonial.featured ? "Featured" : "Client"}
                  </p>
                  <p className="text-2xl md:text-3xl font-semibold text-foreground leading-snug mb-8">
                    "{featuredTestimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                      {featuredTestimonial.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{featuredTestimonial.author}</div>
                      <div className="text-xs text-muted-foreground">{featuredTestimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {otherTestimonials.length > 0 && (
                <div className={`flex flex-col gap-4 ${featuredTestimonial ? "md:col-span-5" : "md:col-span-12 md:grid md:grid-cols-2"}`}>
                  {otherTestimonials.map((t, i) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex-1 rounded-2xl border border-border bg-card p-7"
                    >
                      <p className="text-sm text-foreground leading-relaxed mb-5">"{t.quote}"</p>
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-primary">
                          {t.initials}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-foreground">{t.author}</div>
                          <div className="text-xs text-muted-foreground">{t.role}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────── */}
      <section id="contact" className="py-28 bg-card border-t border-border">
        <div className="container mx-auto px-6">

          <div className="flex items-baseline justify-between mb-16 border-b border-border pb-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">06 — Get in Touch</h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 items-start">

            {/* Left — big statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5"
            >
              <h3 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight mb-8">
                Ready to<br /><span className="text-primary">ship</span><br />something?
              </h3>
              <div className="space-y-4 divide-y divide-border border-y border-border py-6 mb-8">
                {[
                  { k: "Email", v: "hello@hititech.io" },
                  { k: "Response", v: "Within 24 hours" },
                  { k: "Timezone", v: "Global, async-first" },
                ].map((r) => (
                  <div key={r.k} className="flex justify-between items-baseline pt-4 first:pt-0">
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{r.k}</span>
                    <span className="text-sm text-foreground">{r.v}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Stop compromising on technical excellence. Let's build something that lasts.
              </p>
            </motion.div>

            {/* Right — form */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-7 flex flex-col items-center justify-center gap-4 py-16 border border-border rounded-2xl bg-card"
              >
                <CheckCircle className="w-10 h-10 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Message sent!</h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 mt-2">Send another message</button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  submitContact.mutate({ data: { name: contactForm.name, email: contactForm.email, company: contactForm.company || undefined, message: contactForm.message } });
                }}
                className="lg:col-span-7 space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Name</label>
                    <input required type="text" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="John Doe" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Email</label>
                    <input required type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder="john@company.com" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Company</label>
                  <input type="text" value={contactForm.company} onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })} placeholder="Your company" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Project Details</label>
                  <textarea required value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="What are you building? What's the timeline and budget?" className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all h-36 resize-none" />
                </div>
                <button type="submit" disabled={submitContact.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg h-12 text-sm font-semibold disabled:opacity-60">
                  {submitContact.isPending ? "Sending…" : "Send Message"}
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src={logoSrc} alt="HITI TECH" className="w-6 h-6 rounded-full object-cover ring-1 ring-border" />
            <span className="text-sm font-semibold text-foreground">HITI TECH</span>
            <span className="text-xs text-muted-foreground ml-2">© 2026. All rights reserved.</span>
          </div>

          <nav className="flex flex-wrap gap-6">
            {[...navLinks, { name: "Privacy", href: "#" }, { name: "Terms", href: "#" }].map((l) => (
              <a key={l.name} href={l.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {l.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Built with precision
          </div>
        </div>
      </footer>

    </div>
  );
}
