import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { portfolioProjectsTable, servicesTable, testimonialsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/public/services", async (_req, res) => {
  const rows = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.visible, true))
    .orderBy(servicesTable.order);
  res.json(rows);
});

router.get("/public/projects", async (_req, res) => {
  const rows = await db
    .select()
    .from(portfolioProjectsTable)
    .where(eq(portfolioProjectsTable.visible, true))
    .orderBy(portfolioProjectsTable.order);
  res.json(rows);
});

router.get("/public/projects/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [row] = await db
    .select()
    .from(portfolioProjectsTable)
    .where(eq(portfolioProjectsTable.id, id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.get("/public/testimonials", async (_req, res) => {
  const rows = await db
    .select()
    .from(testimonialsTable)
    .where(eq(testimonialsTable.visible, true))
    .orderBy(testimonialsTable.order);
  res.json(rows);
});

export default router;
