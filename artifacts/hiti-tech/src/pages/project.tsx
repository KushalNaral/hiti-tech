import { useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useGetPublicProject, useGetPublicProjects } from "@workspace/api-client-react";
import logoSrc from "@assets/image_1779958981910.png";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id ?? "0", 10);

  const { data: project, isLoading, error } = useGetPublicProject(projectId, {
    query: { enabled: !isNaN(projectId) && projectId > 0 },
  });
  const { data: allProjects = [] } = useGetPublicProjects();

  const related = allProjects.filter((p) => p.id !== projectId).slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project || error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-black text-foreground">404</p>
        <p className="text-muted-foreground text-sm">Project not found.</p>
        <a href="/#work" className="text-xs text-primary hover:underline underline-offset-4 flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to portfolio
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src={logoSrc} alt="HITI TECH" className="w-7 h-7 rounded-full object-cover ring-1 ring-border" />
            <span className="font-semibold text-sm tracking-tight">HITI TECH</span>
          </a>
          <a href="/" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to site
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-36 pb-16 container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-5">{project.category}</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-foreground mb-8">{project.name}</h1>
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs font-mono bg-secondary border border-border rounded px-3 py-1.5 text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Visual banner */}
      <div className="border-y border-border bg-card overflow-hidden">
        <motion.div
          className="container mx-auto px-6 py-24 flex items-center justify-center relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span
            className="font-black select-none leading-none text-border/25"
            style={{ fontSize: "clamp(80px, 20vw, 280px)" }}
          >
            {project.name[0]}
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-card pointer-events-none" />
        </motion.div>
      </div>

      {/* Description */}
      <section className="py-24 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-3">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground sticky top-20">About the project</p>
            </div>
            <motion.div
              className="lg:col-span-9"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xl md:text-2xl text-foreground font-light leading-relaxed">{project.description}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meta grid */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              { label: "Category", value: project.category },
              { label: "Stack", value: project.tags?.slice(0, 2).join(", ") || "Various" },
              { label: "Added", value: new Date(project.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
              { label: "Status", value: "Delivered" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="py-8 px-6 first:pl-0"
              >
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">{item.label}</p>
                <p className="text-sm font-medium text-foreground">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech deep-dive */}
      {project.tags && project.tags.length > 0 && (
        <section className="py-24 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="flex items-baseline justify-between mb-12 border-b border-border pb-6">
              <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Technology Used</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.tags.map((tag, i) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-center justify-between p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-background transition-all"
                >
                  <span className="text-sm font-medium text-foreground">{tag}</span>
                  <span className="text-xs font-mono text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related projects */}
      {related.length > 0 && (
        <section className="py-24 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="flex items-baseline justify-between mb-12 border-b border-border pb-6">
              <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">More Work</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((p, i) => (
                <motion.a
                  key={p.id}
                  href={`/projects/${p.id}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors block"
                >
                  <div className="h-28 bg-background border-b border-border flex items-center justify-center overflow-hidden">
                    <span className="font-black text-6xl text-border/40 group-hover:text-primary/20 transition-colors select-none">
                      {p.name[0]}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-mono text-primary uppercase tracking-widest mb-1">{p.category}</p>
                    <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-card border-b border-border">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4 leading-tight">
              Ready to build <span className="text-primary">something</span> like this?
            </h2>
            <p className="text-sm text-muted-foreground mb-10 max-w-md mx-auto">
              Tell us about your project — we'll get back to you within 24 hours.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-xl px-8 py-3.5 text-sm font-semibold"
            >
              Get in touch <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoSrc} alt="HITI TECH" className="w-5 h-5 rounded-full object-cover ring-1 ring-border" />
            <span className="text-xs text-muted-foreground">HITI TECH © 2026. All rights reserved.</span>
          </div>
          <a href="/" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to site
          </a>
        </div>
      </footer>

    </div>
  );
}
