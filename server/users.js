import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import mongoose from "mongoose";

const scryptAsync = promisify(scrypt);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { versionKey: false, timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(password, salt, 32)).toString("hex");
  return `${salt}:${hash}`;
}

async function checkPassword(password, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const next = (await scryptAsync(password, salt, 32)).toString("hex");
  const left = Buffer.from(hash, "hex");
  const right = Buffer.from(next, "hex");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function publicUser(user) {
  return { name: user.name, email: user.email };
}

function sendError(res, status, error) {
  res.status(status).json({ error });
}

export function registerUsers(app) {
  app.post("/api/users/signup", async (req, res) => {
    try {
      const name = String(req.body?.name || "").trim();
      const email = String(req.body?.email || "").trim().toLowerCase();
      const password = String(req.body?.password || "");
      if (!name || !email || password.length < 6) {
        return sendError(res, 400, "Name, email, and a password of at least 6 characters are required.");
      }
      const existing = await User.findOne({ email });
      if (existing) {
        return sendError(res, 409, "An account with this email already exists. Please log in.");
      }
      const user = await User.create({
        name,
        email,
        passwordHash: await hashPassword(password),
      });
      res.status(201).json(publicUser(user));
    } catch (error) {
      if (error?.code === 11000) {
        return sendError(res, 409, "An account with this email already exists. Please log in.");
      }
      console.error(error);
      sendError(res, 500, "Could not save the account.");
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const email = String(req.body?.email || "").trim().toLowerCase();
      const password = String(req.body?.password || "");
      const user = await User.findOne({ email });
      if (!user || !(await checkPassword(password, user.passwordHash))) {
        return sendError(res, 401, "Email or password is wrong.");
      }
      res.json(publicUser(user));
    } catch (error) {
      console.error(error);
      sendError(res, 500, "Could not sign in.");
    }
  });

  app.get("/api/users", async (_req, res) => {
    try {
      const users = await User.find().select("name email createdAt").lean();
      res.json(users.map((user) => ({
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })));
    } catch (error) {
      console.error(error);
      sendError(res, 500, "Could not read accounts.");
    }
  });
}
