import jwt from "jsonwebtoken";
import { saveStore, getStore } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export function createSession(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "30d" });
}

export function createUserRecord() {
  const store = getStore();
  const id = "u_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
  store.users[id] = { google: null, notion: null };
  saveStore();
  return id;
}

export function getUser(userId) {
  const store = getStore();
  return store.users[userId] || null;
}
