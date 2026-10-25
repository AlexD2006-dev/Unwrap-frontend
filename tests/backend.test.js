import { test, expect } from "vitest";
import request from "supertest";
import app from "../backend/server.js";

// Check the existing backend health contract used by the frontend.
test("health route reports that the backend is working", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
});