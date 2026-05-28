import { Router, type IRouter, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { db, adminUsersTable } from "@workspace/db";
import { createSession, SESSION_COOKIE, SESSION_TTL } from "../lib/auth";

const router: IRouter = Router();

function setSessionCookie(res: Response, sid: string) {
  res.cookie(SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

/* GET /api/auth/local/status
   Returns { needsSetup: true } when no admin accounts exist yet. */
router.get("/auth/local/status", async (_req: Request, res: Response) => {
  const [existing] = await db.select({ id: adminUsersTable.id }).from(adminUsersTable).limit(1);
  res.json({ needsSetup: !existing });
});

/* POST /api/auth/local/setup
   Create the first admin account. Locked once any admin exists. */
router.post("/auth/local/setup", async (req: Request, res: Response) => {
  const [existing] = await db.select({ id: adminUsersTable.id }).from(adminUsersTable).limit(1);
  if (existing) {
    res.status(403).json({ error: "Setup already complete. Use /login instead." });
    return;
  }

  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    res.status(400).json({ error: "username and password are required." });
    return;
  }
  if (username.length < 3) {
    res.status(400).json({ error: "Username must be at least 3 characters." });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [admin] = await db
    .insert(adminUsersTable)
    .values({ username, passwordHash })
    .returning();

  const sid = await createSession({
    user: { id: String(admin.id), email: null, firstName: username, lastName: null, profileImageUrl: null },
  });
  setSessionCookie(res, sid);
  res.status(201).json({ username: admin.username });
});

/* POST /api/auth/local/login */
router.post("/auth/local/login", async (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    res.status(400).json({ error: "username and password are required." });
    return;
  }

  const [admin] = await db
    .select()
    .from(adminUsersTable)
    .where(
      (await import("drizzle-orm")).eq(adminUsersTable.username, username),
    )
    .limit(1);

  if (!admin) {
    res.status(401).json({ error: "Invalid username or password." });
    return;
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid username or password." });
    return;
  }

  const sid = await createSession({
    user: { id: String(admin.id), email: null, firstName: admin.username, lastName: null, profileImageUrl: null },
  });
  setSessionCookie(res, sid);
  res.json({ username: admin.username });
});

export default router;
