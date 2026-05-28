import { Router, type IRouter } from "express";
import { db, contactMessagesTable } from "@workspace/db";
import { insertContactMessageSchema } from "@workspace/db";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const parsed = insertContactMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
    return;
  }

  const [message] = await db
    .insert(contactMessagesTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(message);
});

export default router;
