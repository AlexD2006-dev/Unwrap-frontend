import { afterEach, describe, expect, it, vi } from "vitest";
import {
    getTopArtists,
    loginUser,
    registerUser,
} from "../api.js";

describe("frontend API client", () => {
    // These tests use mocked requests so they do not depend on the real backend.
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("logs in with the correct endpoint and includes cookies", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                message: "Successfully logged in",
            }),
        });

        vi.stubGlobal("fetch", fetchMock);

        const result = await loginUser({
            email: "test@example.com",
            password: "password123",
        });

        expect(result.message).toBe("Successfully logged in");

        const [url, options] = fetchMock.mock.calls[0];

        expect(url).toBe("http://127.0.0.1:3000/auth/login");
        expect(options.method).toBe("POST");
        expect(options.credentials).toBe("include");
        expect(JSON.parse(options.body)).toEqual({
            email: "test@example.com",
            password: "password123",
        });
    });

    it("sends registration details to the registration endpoint", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                success: true,
            }),
        });

        vi.stubGlobal("fetch", fetchMock);

        await registerUser({
            email: "test@example.com",
            displayName: "Alex",
            password: "password123",
        });

        const [url, options] = fetchMock.mock.calls[0];

        expect(url).toBe("http://127.0.0.1:3000/register");
        expect(options.method).toBe("POST");
        expect(options.credentials).toBe("include");
        expect(JSON.parse(options.body)).toEqual({
            email: "test@example.com",
            displayName: "Alex",
            password: "password123",
        });
    });

    it("reports an error returned by the backend", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: false,
            status: 401,
            json: async () => ({
                message: "Invalid credentials",
            }),
        });

        vi.stubGlobal("fetch", fetchMock);

        await expect(
            loginUser({
                email: "test@example.com",
                password: "wrong-password",
            }),
        ).rejects.toThrow("Invalid credentials");
    });

    it("requests top artists with the requested limit", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                topArtists: [],
            }),
        });

        vi.stubGlobal("fetch", fetchMock);

        await getTopArtists(5);

        const [url, options] = fetchMock.mock.calls[0];

        expect(url).toBe(
            "http://127.0.0.1:3000/api/top-artists?limit=5",
        );
        expect(options.credentials).toBe("include");
    });

    it("reports a network failure", async () => {
        const fetchMock = vi.fn().mockRejectedValue(
            new Error("Network unavailable"),
        );

        vi.stubGlobal("fetch", fetchMock);

        await expect(getTopArtists()).rejects.toThrow(
            "Network unavailable",
        );
    });
});