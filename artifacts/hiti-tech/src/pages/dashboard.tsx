import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@workspace/replit-auth-web";
import {
  useListMessages, useDeleteMessage, useMarkMessageRead, getListMessagesQueryKey,
  type ContactMessage,
  useListProjects, useCreateProject, useUpdateProject, useDeleteProject, getListProjectsQueryKey,
  type UpsertPortfolioProjectRequest, type PortfolioProject,
  useListTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial, getListTestimonialsQueryKey,
  type UpsertTestimonialRequest, type Testimonial,
  useListServices, useCreateService, useUpdateService, useDeleteService, getListServicesQueryKey,
  type UpsertServiceRequest, type Service,
} from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Briefcase, Star, Zap, ArrowLeft, LogOut, Plus, Pencil, Trash2,
  Eye, EyeOff, X, AlertCircle, Menu, Sun, Moon,
} from "lucide-react";
import { useTheme } from "@/contexts/theme";
import logoSrc from "@assets/image_1779958981910.png";

/* ─── Types ──────────────────────────────────────────────────── */
type Section = "messages" | "projects" | "testimonials" | "services";

/* ─── Shared UI helpers ──────────────────────────────────────── */

function cls(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function inputCls(error?: string) {
  return cls(
    "w-full bg-background border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 transition-all",
    error ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary",
  );
}

function FormField({
  label, error, required, children,
}: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}{required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive mt-1.5">
          <AlertCircle className="w-3 h-3 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");

  function commit() {
    const val = input.trim().replace(/,$/, "");
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput("");
  }

  return (
    <div className="min-h-[44px] w-full bg-background border border-border rounded-lg px-2.5 py-2 flex flex-wrap gap-2 focus-within:ring-1 focus-within:ring-primary transition-all">
      {tags.map((tag) => (
        <span key={tag} className="flex items-center gap-1 text-xs font-mono bg-secondary border border-border rounded px-2 py-0.5 text-foreground">
          {tag}
          <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} className="text-muted-foreground hover:text-destructive transition-colors ml-0.5 leading-none">×</button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit(); } }}
        onBlur={commit}
        placeholder={tags.length === 0 ? "Type a tag, press Enter…" : ""}
        className="flex-1 min-w-[140px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none"
      />
    </div>
  );
}

function SlideOver({
  open, onClose, title, children,
}: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-screen w-full max-w-[520px] bg-card border-l border-border z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-foreground">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyState({ label, onAdd }: { label: string; onAdd?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center mb-4">
        <Plus className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">{label}</p>
      {onAdd && (
        <button onClick={onAdd} className="text-xs text-primary hover:underline underline-offset-4 mt-1.5">
          Add the first one
        </button>
      )}
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-wide border border-border rounded px-1.5 py-0.5 text-muted-foreground">
      {label}
    </span>
  );
}

function FeaturedBadge() {
  return (
    <span className="inline-flex items-center text-[10px] font-mono uppercase tracking-wide border border-primary/30 rounded px-1.5 py-0.5 bg-primary/10 text-primary">
      Featured
    </span>
  );
}

function SectionHeader({ title, count, label, onNew }: { title: string; count: number; label: string; onNew: () => void }) {
  return (
    <div className="px-8 py-6 border-b border-border flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{count} {label}</p>
      </div>
      <button
        onClick={onNew}
        className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg px-4 py-2 text-sm font-medium"
      >
        <Plus className="w-4 h-4" /> New {title.replace(/s$/, "")}
      </button>
    </div>
  );
}

function ActionButtons({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={onEdit} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button onClick={onDelete} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function FormActions({ onSave, onCancel, isPending, isNew }: { onSave: () => void; onCancel: () => void; isPending: boolean; isNew: boolean }) {
  return (
    <div className="flex gap-3 pt-2 border-t border-border">
      <button
        onClick={onSave}
        disabled={isPending}
        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors rounded-lg py-2.5 text-sm font-medium"
      >
        {isPending ? "Saving…" : isNew ? "Create" : "Save Changes"}
      </button>
      <button
        onClick={onCancel}
        className="px-5 border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 rounded-lg py-2.5 text-sm transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}

/* ─── Messages ───────────────────────────────────────────────── */

function MessagesSection() {
  const qc = useQueryClient();
  const { data: messages = [], isLoading } = useListMessages();
  const markRead = useMarkMessageRead({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListMessagesQueryKey() }) } });
  const deleteMut = useDeleteMessage({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListMessagesQueryKey() }); if (selected) setSelected(null); } } });
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const unread = messages.filter((m) => !m.read).length;

  function pick(m: ContactMessage) {
    setSelected(m);
    if (!m.read) markRead.mutate({ id: m.id });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 py-6 border-b border-border flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Messages</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{messages.length} total · {unread} unread</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* List */}
        <div className="w-80 shrink-0 border-r border-border overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">Loading…</div>
          ) : messages.length === 0 ? (
            <EmptyState label="No messages yet." />
          ) : (
            <div className="divide-y divide-border">
              {[...messages].reverse().map((m) => (
                <button
                  key={m.id}
                  onClick={() => pick(m)}
                  className={cls(
                    "w-full text-left px-5 py-4 hover:bg-background/60 transition-colors flex items-start gap-3",
                    selected?.id === m.id ? "bg-background/70" : "",
                  )}
                >
                  <div className={cls("w-2 h-2 rounded-full mt-1.5 shrink-0 transition-colors", m.read ? "bg-transparent" : "bg-primary")} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={cls("text-sm truncate", m.read ? "text-muted-foreground" : "font-semibold text-foreground")}>{m.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{m.message}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selected ? (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">{selected.name}</h2>
                  <p className="text-sm text-muted-foreground">{selected.email}{selected.company ? ` · ${selected.company}` : ""}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => deleteMut.mutate({ id: selected.id })}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-background rounded-xl border border-border p-6 mb-5">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <a
                href={`mailto:${selected.email}?subject=Re: Your enquiry`}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
              >
                Reply via email <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </a>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Select a message to read it
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Projects ───────────────────────────────────────────────── */

type ProjErrors = { name?: string; category?: string; description?: string };
const defaultProject: UpsertPortfolioProjectRequest = { name: "", category: "", description: "", tags: [], visible: true };

function validateProject(f: UpsertPortfolioProjectRequest): ProjErrors {
  const e: ProjErrors = {};
  if (!f.name?.trim()) e.name = "Project name is required";
  if (!f.category?.trim()) e.category = "Category is required";
  if (!f.description?.trim()) e.description = "Description is required";
  else if (f.description.trim().length < 10) e.description = "At least 10 characters";
  return e;
}

function ProjectsSection() {
  const qc = useQueryClient();
  const { data: projects = [], isLoading } = useListProjects();
  const createMut = useCreateProject({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListProjectsQueryKey() }); close_(); } } });
  const updateMut = useUpdateProject({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListProjectsQueryKey() }); close_(); } } });
  const deleteMut = useDeleteProject({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListProjectsQueryKey() }) } });

  const [panel, setPanel] = useState<"closed" | "new" | number>("closed");
  const [form, setForm] = useState<UpsertPortfolioProjectRequest>(defaultProject);
  const [errors, setErrors] = useState<ProjErrors>({});

  function open_(p?: PortfolioProject) {
    if (p) { setForm({ name: p.name, category: p.category, description: p.description, tags: p.tags ?? [], order: p.order, visible: p.visible }); setPanel(p.id); }
    else { setForm(defaultProject); setPanel("new"); }
    setErrors({});
  }
  function close_() { setPanel("closed"); }

  function patch<K extends keyof UpsertPortfolioProjectRequest>(key: K, val: UpsertPortfolioProjectRequest[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function submit() {
    const e = validateProject(form);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (panel === "new") createMut.mutate({ data: form });
    else if (typeof panel === "number") updateMut.mutate({ id: panel, data: form });
  }

  const isPending = createMut.isPending || updateMut.isPending;
  const isNew = panel === "new";

  return (
    <div className="flex flex-col h-full">
      <SectionHeader title="Projects" count={projects.length} label="portfolio projects" onNew={() => open_()} />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {isLoading ? (
          <div className="text-sm text-muted-foreground text-center py-16">Loading…</div>
        ) : projects.length === 0 ? (
          <EmptyState label="No projects yet." onAdd={() => open_()} />
        ) : (
          <div className="space-y-3">
            {projects.map((p: PortfolioProject) => (
              <div key={p.id} className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-border/60 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-black text-primary/50 shrink-0 select-none">
                  {p.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-foreground">{p.name}</span>
                    {!p.visible && <StatusBadge label="Hidden" />}
                  </div>
                  <p className="text-xs font-mono text-primary uppercase tracking-wider mb-1.5">{p.category}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{p.description}</p>
                  {p.tags && p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="text-[10px] font-mono bg-secondary border border-border rounded px-2 py-0.5 text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                <ActionButtons onEdit={() => open_(p)} onDelete={() => deleteMut.mutate({ id: p.id })} />
              </div>
            ))}
          </div>
        )}
      </div>

      <SlideOver open={panel !== "closed"} onClose={close_} title={isNew ? "New Project" : "Edit Project"}>
        <FormField label="Project Name" error={errors.name} required>
          <input type="text" value={form.name} onChange={(e) => patch("name", e.target.value)} placeholder="Aura FinTech" className={inputCls(errors.name)} />
        </FormField>
        <FormField label="Category" error={errors.category} required>
          <input type="text" value={form.category} onChange={(e) => patch("category", e.target.value)} placeholder="Financial Technology" className={inputCls(errors.category)} />
        </FormField>
        <FormField label="Description" error={errors.description} required>
          <textarea value={form.description} onChange={(e) => patch("description", e.target.value)} placeholder="What did you build and what impact did it have?" rows={4} className={cls(inputCls(errors.description), "resize-none")} />
        </FormField>
        <FormField label="Tags">
          <TagInput tags={form.tags ?? []} onChange={(v) => patch("tags", v)} />
        </FormField>
        <FormField label="Display Order">
          <input type="number" min={1} value={form.order ?? ""} onChange={(e) => patch("order", e.target.value ? parseInt(e.target.value) : undefined)} placeholder="1" className={inputCls()} />
        </FormField>
        <label className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer select-none">
          <input type="checkbox" checked={form.visible !== false} onChange={(e) => patch("visible", e.target.checked)} className="accent-primary w-4 h-4 rounded" />
          Visible on the website
        </label>
        <FormActions onSave={submit} onCancel={close_} isPending={isPending} isNew={isNew} />
      </SlideOver>
    </div>
  );
}

/* ─── Testimonials ───────────────────────────────────────────── */

type TestErrors = { quote?: string; author?: string; role?: string; initials?: string };
const defaultTestimonial: UpsertTestimonialRequest = { quote: "", author: "", role: "", initials: "", featured: false, visible: true };

function validateTestimonial(f: UpsertTestimonialRequest): TestErrors {
  const e: TestErrors = {};
  if (!f.quote?.trim()) e.quote = "Quote is required";
  else if (f.quote.trim().length < 10) e.quote = "At least 10 characters";
  if (!f.author?.trim()) e.author = "Author name is required";
  if (!f.role?.trim()) e.role = "Role / company is required";
  if (!f.initials?.trim()) e.initials = "Initials are required";
  else if (f.initials.trim().length > 3) e.initials = "Max 3 characters";
  return e;
}

function TestimonialsSection() {
  const qc = useQueryClient();
  const { data: testimonials = [], isLoading } = useListTestimonials();
  const createMut = useCreateTestimonial({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListTestimonialsQueryKey() }); close_(); } } });
  const updateMut = useUpdateTestimonial({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListTestimonialsQueryKey() }); close_(); } } });
  const deleteMut = useDeleteTestimonial({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListTestimonialsQueryKey() }) } });

  const [panel, setPanel] = useState<"closed" | "new" | number>("closed");
  const [form, setForm] = useState<UpsertTestimonialRequest>(defaultTestimonial);
  const [errors, setErrors] = useState<TestErrors>({});

  function open_(t?: Testimonial) {
    if (t) { setForm({ quote: t.quote, author: t.author, role: t.role, initials: t.initials, featured: t.featured, order: t.order, visible: t.visible }); setPanel(t.id); }
    else { setForm(defaultTestimonial); setPanel("new"); }
    setErrors({});
  }
  function close_() { setPanel("closed"); }

  function patch<K extends keyof UpsertTestimonialRequest>(key: K, val: UpsertTestimonialRequest[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function submit() {
    const e = validateTestimonial(form);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (panel === "new") createMut.mutate({ data: form });
    else if (typeof panel === "number") updateMut.mutate({ id: panel, data: form });
  }

  const isPending = createMut.isPending || updateMut.isPending;
  const isNew = panel === "new";

  return (
    <div className="flex flex-col h-full">
      <SectionHeader title="Testimonials" count={testimonials.length} label="testimonials" onNew={() => open_()} />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {isLoading ? (
          <div className="text-sm text-muted-foreground text-center py-16">Loading…</div>
        ) : testimonials.length === 0 ? (
          <EmptyState label="No testimonials yet." onAdd={() => open_()} />
        ) : (
          <div className="space-y-3">
            {testimonials.map((t: Testimonial) => (
              <div key={t.id} className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-border/60 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {t.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-foreground">{t.author}</span>
                    {t.featured && <FeaturedBadge />}
                    {!t.visible && <StatusBadge label="Hidden" />}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{t.role}</p>
                  <p className="text-xs text-muted-foreground italic line-clamp-2">"{t.quote}"</p>
                </div>
                <ActionButtons onEdit={() => open_(t)} onDelete={() => deleteMut.mutate({ id: t.id })} />
              </div>
            ))}
          </div>
        )}
      </div>

      <SlideOver open={panel !== "closed"} onClose={close_} title={isNew ? "New Testimonial" : "Edit Testimonial"}>
        <FormField label="Quote" error={errors.quote} required>
          <textarea value={form.quote} onChange={(e) => patch("quote", e.target.value)} placeholder="What they said about working with HITI TECH…" rows={4} className={cls(inputCls(errors.quote), "resize-none")} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Author Name" error={errors.author} required>
            <input type="text" value={form.author} onChange={(e) => patch("author", e.target.value)} placeholder="Sarah Jenkins" className={inputCls(errors.author)} />
          </FormField>
          <FormField label="Initials" error={errors.initials} required>
            <input type="text" maxLength={3} value={form.initials} onChange={(e) => patch("initials", e.target.value.toUpperCase())} placeholder="SJ" className={inputCls(errors.initials)} />
          </FormField>
        </div>
        <FormField label="Role / Company" error={errors.role} required>
          <input type="text" value={form.role} onChange={(e) => patch("role", e.target.value)} placeholder="CTO, Aura FinTech" className={inputCls(errors.role)} />
        </FormField>
        <FormField label="Display Order">
          <input type="number" min={1} value={form.order ?? ""} onChange={(e) => patch("order", e.target.value ? parseInt(e.target.value) : undefined)} placeholder="1" className={inputCls()} />
        </FormField>
        <div className="flex flex-col gap-3 pt-1">
          <label className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer select-none">
            <input type="checkbox" checked={form.featured ?? false} onChange={(e) => patch("featured", e.target.checked)} className="accent-primary w-4 h-4 rounded" />
            Featured testimonial (shown prominently)
          </label>
          <label className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer select-none">
            <input type="checkbox" checked={form.visible !== false} onChange={(e) => patch("visible", e.target.checked)} className="accent-primary w-4 h-4 rounded" />
            Visible on the website
          </label>
        </div>
        <FormActions onSave={submit} onCancel={close_} isPending={isPending} isNew={isNew} />
      </SlideOver>
    </div>
  );
}

/* ─── Services ───────────────────────────────────────────────── */

type SvcErrors = { number?: string; title?: string; description?: string };
const defaultService: UpsertServiceRequest = { number: "", title: "", description: "", visible: true };

function validateService(f: UpsertServiceRequest): SvcErrors {
  const e: SvcErrors = {};
  if (!f.number?.trim()) e.number = "Service number is required (e.g. 01)";
  if (!f.title?.trim()) e.title = "Title is required";
  if (!f.description?.trim()) e.description = "Description is required";
  else if (f.description.trim().length < 10) e.description = "At least 10 characters";
  return e;
}

function ServicesSection() {
  const qc = useQueryClient();
  const { data: services = [], isLoading } = useListServices();
  const createMut = useCreateService({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListServicesQueryKey() }); close_(); } } });
  const updateMut = useUpdateService({ mutation: { onSuccess: () => { qc.invalidateQueries({ queryKey: getListServicesQueryKey() }); close_(); } } });
  const deleteMut = useDeleteService({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListServicesQueryKey() }) } });

  const [panel, setPanel] = useState<"closed" | "new" | number>("closed");
  const [form, setForm] = useState<UpsertServiceRequest>(defaultService);
  const [errors, setErrors] = useState<SvcErrors>({});

  function open_(s?: Service) {
    if (s) { setForm({ number: s.number, title: s.title, description: s.description, order: s.order, visible: s.visible }); setPanel(s.id); }
    else { setForm(defaultService); setPanel("new"); }
    setErrors({});
  }
  function close_() { setPanel("closed"); }

  function patch<K extends keyof UpsertServiceRequest>(key: K, val: UpsertServiceRequest[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function submit() {
    const e = validateService(form);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (panel === "new") createMut.mutate({ data: form });
    else if (typeof panel === "number") updateMut.mutate({ id: panel, data: form });
  }

  const isPending = createMut.isPending || updateMut.isPending;
  const isNew = panel === "new";

  return (
    <div className="flex flex-col h-full">
      <SectionHeader title="Services" count={services.length} label="services" onNew={() => open_()} />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {isLoading ? (
          <div className="text-sm text-muted-foreground text-center py-16">Loading…</div>
        ) : services.length === 0 ? (
          <EmptyState label="No services yet." onAdd={() => open_()} />
        ) : (
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
            {services.map((s: Service) => (
              <div key={s.id} className="group flex items-center gap-5 px-5 py-4 bg-card hover:bg-background/40 transition-colors">
                <span className="text-xs font-mono text-muted-foreground w-8 shrink-0">{s.number}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-foreground">{s.title}</span>
                    {!s.visible && <StatusBadge label="Hidden" />}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{s.description}</p>
                </div>
                <ActionButtons onEdit={() => open_(s)} onDelete={() => deleteMut.mutate({ id: s.id })} />
              </div>
            ))}
          </div>
        )}
      </div>

      <SlideOver open={panel !== "closed"} onClose={close_} title={isNew ? "New Service" : "Edit Service"}>
        <FormField label="Service Number" error={errors.number} required>
          <input type="text" value={form.number} onChange={(e) => patch("number", e.target.value)} placeholder="01" className={inputCls(errors.number)} />
        </FormField>
        <FormField label="Title" error={errors.title} required>
          <input type="text" value={form.title} onChange={(e) => patch("title", e.target.value)} placeholder="Custom Software Development" className={inputCls(errors.title)} />
        </FormField>
        <FormField label="Description" error={errors.description} required>
          <textarea value={form.description} onChange={(e) => patch("description", e.target.value)} placeholder="What this service includes and what value it delivers…" rows={4} className={cls(inputCls(errors.description), "resize-none")} />
        </FormField>
        <FormField label="Display Order">
          <input type="number" min={1} value={form.order ?? ""} onChange={(e) => patch("order", e.target.value ? parseInt(e.target.value) : undefined)} placeholder="1" className={inputCls()} />
        </FormField>
        <label className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer select-none">
          <input type="checkbox" checked={form.visible !== false} onChange={(e) => patch("visible", e.target.checked)} className="accent-primary w-4 h-4 rounded" />
          Visible on the website
        </label>
        <FormActions onSave={submit} onCancel={close_} isPending={isPending} isNew={isNew} />
      </SlideOver>
    </div>
  );
}

/* ─── Login gate ─────────────────────────────────────────────── */

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetch("/api/auth/local/status", { credentials: "include" })
      .then((r) => r.json())
      .then((d: { needsSetup: boolean }) => setNeedsSetup(d.needsSetup))
      .catch(() => setNeedsSetup(false));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    const endpoint = needsSetup ? "/api/auth/local/setup" : "/api/auth/local/login";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const body = await res.json();
      if (!res.ok) { setError(body.error ?? "Something went wrong."); return; }
      onSuccess();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (needsSetup === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img src={logoSrc} alt="HITI TECH" className="w-12 h-12 rounded-full ring-1 ring-border mb-4" />
          <h1 className="text-xl font-bold text-foreground">{needsSetup ? "Create admin account" : "Dashboard"}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {needsSetup ? "First time setup — choose your credentials." : "Sign in to manage your site."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
              placeholder="admin"
              className={inputCls()}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={needsSetup ? "new-password" : "current-password"}
                placeholder={needsSetup ? "Min. 8 characters" : "••••••••"}
                className={cls(inputCls(), "pr-10")}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors rounded-lg py-2.5 text-sm font-medium"
          >
            {pending ? (needsSetup ? "Creating…" : "Signing in…") : (needsSetup ? "Create account" : "Sign in")}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Nav config ─────────────────────────────────────────────── */

const NAV_ITEMS: { id: Section; icon: typeof Mail; label: string }[] = [
  { id: "messages", icon: Mail, label: "Messages" },
  { id: "projects", icon: Briefcase, label: "Projects" },
  { id: "testimonials", icon: Star, label: "Testimonials" },
  { id: "services", icon: Zap, label: "Services" },
];

/* ─── Main dashboard ─────────────────────────────────────────── */

export default function Dashboard() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [section, setSection] = useState<Section>("messages");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: messages = [] } = useListMessages();
  const unreadCount = (messages as ContactMessage[]).filter((m) => !m.read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginGate onSuccess={() => window.location.reload()} />;
  }

  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cls(
        "fixed left-0 top-0 h-screen w-64 border-r border-border bg-card flex flex-col z-40",
        "transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <img src={logoSrc} alt="HITI TECH" className="w-7 h-7 rounded-full object-cover ring-1 ring-border" />
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">HITI TECH</p>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setSection(item.id); setSidebarOpen(false); }}
                className={cls(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  active ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-background",
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
                {item.id === "messages" && unreadCount > 0 && (
                  <span className={cls(
                    "ml-auto text-[10px] font-mono rounded-full w-5 h-5 flex items-center justify-center tabular-nums",
                    active ? "bg-white/25 text-white" : "bg-primary text-primary-foreground",
                  )}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border shrink-0 space-y-3">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {initials}
            </div>
            <p className="text-xs font-medium text-foreground truncate">{user?.firstName ?? "Admin"}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex items-center justify-center w-8 shrink-0 border border-border rounded-lg py-1.5 text-muted-foreground hover:text-foreground hover:border-foreground/25 transition-colors"
            >
              {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <a
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border hover:border-foreground/25 rounded-lg py-1.5 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Site
            </a>
            <button
              onClick={logout}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-destructive border border-border hover:border-destructive/30 rounded-lg py-1.5 transition-colors"
            >
              <LogOut className="w-3 h-3" /> Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden shrink-0 flex items-center px-4 py-3 border-b border-border bg-card">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-2">
            <span className="text-sm font-semibold text-foreground">{NAV_ITEMS.find((n) => n.id === section)?.label}</span>
            {section === "messages" && unreadCount > 0 && (
              <span className="text-[10px] font-mono bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">{unreadCount}</span>
            )}
          </div>
        </div>

        {/* Section content with transition */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="h-full"
            >
              {section === "messages" && <MessagesSection />}
              {section === "projects" && <ProjectsSection />}
              {section === "testimonials" && <TestimonialsSection />}
              {section === "services" && <ServicesSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
