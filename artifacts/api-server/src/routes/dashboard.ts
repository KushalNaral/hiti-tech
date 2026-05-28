import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  contactMessagesTable,
  portfolioProjectsTable,
  testimonialsTable,
  servicesTable,
  insertPortfolioProjectSchema,
  insertTestimonialSchema,
  insertServiceSchema,
  updatePortfolioProjectSchema,
  updateTestimonialSchema,
  updateServiceSchema,
} from "@workspace/db";

const router: IRouter = Router();

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.use("/dashboard", requireAuth);

/* ── Messages ─────────────────────────────────────────── */

router.get("/dashboard/messages", async (_req, res) => {
  const messages = await db
    .select()
    .from(contactMessagesTable)
    .orderBy(contactMessagesTable.createdAt);
  res.json(messages);
});

router.patch("/dashboard/messages/:id/read", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const [updated] = await db
    .update(contactMessagesTable)
    .set({ read: true })
    .where(eq(contactMessagesTable.id, id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json(updated);
});

router.delete("/dashboard/messages/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await db.delete(contactMessagesTable).where(eq(contactMessagesTable.id, id));
  res.json({ success: true });
});

/* ── Projects ──────────────────────────────────────────── */

router.get("/dashboard/projects", async (_req, res) => {
  const rows = await db.select().from(portfolioProjectsTable).orderBy(portfolioProjectsTable.order);
  res.json(rows);
});

router.post("/dashboard/projects", async (req, res) => {
  const parsed = insertPortfolioProjectSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") }); return; }
  const [row] = await db.insert(portfolioProjectsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.patch("/dashboard/projects/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const parsed = updatePortfolioProjectSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") }); return; }
  const [row] = await db.update(portfolioProjectsTable).set(parsed.data).where(eq(portfolioProjectsTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/dashboard/projects/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await db.delete(portfolioProjectsTable).where(eq(portfolioProjectsTable.id, id));
  res.json({ success: true });
});

/* ── Testimonials ──────────────────────────────────────── */

router.get("/dashboard/testimonials", async (_req, res) => {
  const rows = await db.select().from(testimonialsTable).orderBy(testimonialsTable.order);
  res.json(rows);
});

router.post("/dashboard/testimonials", async (req, res) => {
  const parsed = insertTestimonialSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") }); return; }
  const [row] = await db.insert(testimonialsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.patch("/dashboard/testimonials/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const parsed = updateTestimonialSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") }); return; }
  const [row] = await db.update(testimonialsTable).set(parsed.data).where(eq(testimonialsTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/dashboard/testimonials/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id));
  res.json({ success: true });
});

/* ── Services ──────────────────────────────────────────── */

router.get("/dashboard/services", async (_req, res) => {
  const rows = await db.select().from(servicesTable).orderBy(servicesTable.order);
  res.json(rows);
});

router.post("/dashboard/services", async (req, res) => {
  const parsed = insertServiceSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") }); return; }
  const [row] = await db.insert(servicesTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.patch("/dashboard/services/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const parsed = updateServiceSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") }); return; }
  const [row] = await db.update(servicesTable).set(parsed.data).where(eq(servicesTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/dashboard/services/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await db.delete(servicesTable).where(eq(servicesTable.id, id));
  res.json({ success: true });
});

export default router;
