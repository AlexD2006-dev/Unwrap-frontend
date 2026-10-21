import { describe, expect, test } from "vitest";
import { getPageForButton } from "../app.js";

describe("page navigation", () => {
    test("about button goes to the about page", () => {
        const result = getPageForButton("about-button");

        expect(result).toBe("about.html");
    });

    test("login button goes to the account page", () => {
        const result = getPageForButton("login-button");

        expect(result).toBe("auth.html");
    });

    test("unknown button returns no page", () => {
        const result = getPageForButton("unknown-button");

        expect(result).toBeNull();
    });
});