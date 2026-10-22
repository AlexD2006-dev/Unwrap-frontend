import { afterEach, describe, expect, it, vi } from "vitest";

function renderDashboardShell() {
    document.body.innerHTML = `
        <button
            id="refresh-statistics-button"
            type="button"
        >
            Refresh statistics
        </button>

        <p id="refresh-message"></p>

        <p id="total-time-value">Loading...</p>

        <ol id="top-artist-value">
            <li>Loading...</li>
        </ol>

        <ol id="top-track-value">
            <li>Loading...</li>
        </ol>
    `;
}

afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.resetModules();
});

describe("dashboard statistics", () => {
    it("displays statistics returned by the backend", async () => {
        renderDashboardShell();

        const fetchMock = vi.fn((url) => {
            if (url.includes("/api/top-artists")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        topArtists: [
                            { artistName: "Artist One" },
                            { artistName: "Artist Two" },
                            { artistName: "Artist Three" },
                        ],
                    }),
                });
            }

            if (url.includes("/api/top-tracks")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        topTracks: [
                            {
                                trackName: "Song One",
                                artistNames: [
                                    "Artist One",
                                    "Featured Artist",
                                ],
                            },
                            {
                                trackName: "Song Two",
                                artistNames: ["Artist Two"],
                            },
                            {
                                trackName: "Song Three",
                                artistNames: ["Artist Three"],
                            },
                        ],
                    }),
                });
            }

            return Promise.resolve({
                ok: true,
                json: async () => ({
                    statistics: {
                        totalMs: 3720000,
                        totalTracks: 3,
                    },
                }),
            });
        });

        vi.stubGlobal("fetch", fetchMock);

        await import("../dashboard.js");

        await vi.waitFor(() => {
            expect(
                document.querySelector("#total-time-value").textContent,
            ).toBe("1h 2m");

            expect(
                [...document.querySelectorAll("#top-artist-value li")].map(
                    (item) => item.textContent,
                ),
            ).toEqual([
                "Artist One",
                "Artist Two",
                "Artist Three",
            ]);

            expect(
                [...document.querySelectorAll("#top-track-value li")].map(
                    (item) => item.textContent,
                ),
            ).toEqual([
                "Song One - Artist One, Featured Artist",
                "Song Two - Artist Two",
                "Song Three - Artist Three",
            ]);
        });
    });

    it("shows honest empty states when no data exists", async () => {
        renderDashboardShell();

        const fetchMock = vi.fn((url) => {
            if (url.includes("/api/top-artists")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        topArtists: [],
                    }),
                });
            }

            if (url.includes("/api/top-tracks")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        topTracks: [],
                    }),
                });
            }

            return Promise.resolve({
                ok: true,
                json: async () => ({
                    statistics: {
                        totalMs: 0,
                        totalTracks: 0,
                    },
                }),
            });
        });

        vi.stubGlobal("fetch", fetchMock);

        await import("../dashboard.js");

        await vi.waitFor(() => {
            expect(
                document.querySelector("#total-time-value").textContent,
            ).toBe("0m");

            expect(
                document.querySelector("#top-artist-value").textContent,
            ).toContain("No artist data available yet.");

            expect(
                document.querySelector("#top-track-value").textContent,
            ).toContain("No track data available yet.");
        });
    });

    it("shows an error state when one backend request fails", async () => {
        renderDashboardShell();

        vi.spyOn(console, "error").mockImplementation(() => {});

        const fetchMock = vi.fn((url) => {
            if (url.includes("/api/top-tracks")) {
                return Promise.resolve({
                    ok: false,
                    status: 500,
                    json: async () => ({
                        message: "Track request failed",
                    }),
                });
            }

            return Promise.resolve({
                ok: true,
                json: async () => ({
                    topArtists: [],
                    statistics: {
                        totalMs: 0,
                    },
                }),
            });
        });

        vi.stubGlobal("fetch", fetchMock);

        await import("../dashboard.js");

        await vi.waitFor(() => {
            expect(
                document.querySelector("#total-time-value").textContent,
            ).toBe("Unavailable");

            expect(
                document.querySelector("#top-artist-value").textContent,
            ).toContain("Statistics could not be loaded.");

            expect(
                document.querySelector("#top-track-value").textContent,
            ).toContain("Statistics could not be loaded.");
        });
    });

    it("handles a track without artist names", async () => {
        renderDashboardShell();

        const fetchMock = vi.fn((url) => {
            if (url.includes("/api/top-artists")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        topArtists: [{ artistName: "Artist One" }],
                    }),
                });
            }

            if (url.includes("/api/top-tracks")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        topTracks: [
                            {
                                trackName: "Instrumental Track",
                            },
                        ],
                    }),
                });
            }

            return Promise.resolve({
                ok: true,
                json: async () => ({
                    statistics: {
                        totalMs: 60000,
                    },
                }),
            });
        });

        vi.stubGlobal("fetch", fetchMock);

        await import("../dashboard.js");

        await vi.waitFor(() => {
            expect(
                document.querySelector("#top-track-value").textContent,
            ).toContain("Instrumental Track");

            expect(
                document.querySelector("#total-time-value").textContent,
            ).toBe("1m");
        });
    });

    it("refreshes statistics when the refresh button is clicked", async () => {
        renderDashboardShell();

        const successfulResponse = (data) => ({
            ok: true,
            json: async () => data,
        });

        const fetchMock = vi.fn()
            .mockResolvedValueOnce(
                successfulResponse({
                    topArtists: [{ artistName: "Initial Artist" }],
                }),
            )
            .mockResolvedValueOnce(
                successfulResponse({
                    topTracks: [
                        {
                            trackName: "Initial Song",
                            artistNames: ["Initial Artist"],
                        },
                    ],
                }),
            )
            .mockResolvedValueOnce(
                successfulResponse({
                    statistics: {
                        totalMs: 3720000,
                    },
                }),
            )
            .mockResolvedValueOnce(
                successfulResponse({
                    topArtists: [{ artistName: "Updated Artist" }],
                }),
            )
            .mockResolvedValueOnce(
                successfulResponse({
                    topTracks: [
                        {
                            trackName: "Updated Song",
                            artistNames: ["Updated Artist"],
                        },
                    ],
                }),
            )
            .mockResolvedValueOnce(
                successfulResponse({
                    statistics: {
                        totalMs: 7200000,
                    },
                }),
            );

        vi.stubGlobal("fetch", fetchMock);

        await import("../dashboard.js");

        await vi.waitFor(() => {
            expect(
                document.querySelector("#total-time-value").textContent,
            ).toBe("1h 2m");
        });

        const refreshButton = document.querySelector(
            "#refresh-statistics-button",
        );

        refreshButton.click();

        expect(refreshButton.disabled).toBe(true);
        expect(refreshButton.textContent).toBe("Refreshing...");

        await vi.waitFor(() => {
            expect(
                document.querySelector("#refresh-message").textContent,
            ).toBe("Statistics updated.");

            expect(
                document.querySelector("#top-artist-value").textContent,
            ).toContain("Updated Artist");

            expect(
                document.querySelector("#top-track-value").textContent,
            ).toContain("Updated Song - Updated Artist");

            expect(
                document.querySelector("#total-time-value").textContent,
            ).toBe("2h 0m");
        });

        expect(refreshButton.disabled).toBe(false);
        expect(refreshButton.textContent).toBe("Refresh statistics");
    });

    it("shows a refresh error when refreshing statistics fails", async () => {
        renderDashboardShell();

        vi.spyOn(console, "error").mockImplementation(() => {});

        const successfulResponse = (data) => ({
            ok: true,
            json: async () => data,
        });

        const fetchMock = vi.fn()
            .mockResolvedValueOnce(
                successfulResponse({
                    topArtists: [{ artistName: "Initial Artist" }],
                }),
            )
            .mockResolvedValueOnce(
                successfulResponse({
                    topTracks: [
                        {
                            trackName: "Initial Song",
                            artistNames: ["Initial Artist"],
                        },
                    ],
                }),
            )
            .mockResolvedValueOnce(
                successfulResponse({
                    statistics: {
                        totalMs: 3720000,
                    },
                }),
            )
            .mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => ({
                    message: "Refresh failed",
                }),
            })
            .mockResolvedValueOnce(
                successfulResponse({
                    topTracks: [],
                }),
            )
            .mockResolvedValueOnce(
                successfulResponse({
                    statistics: {
                        totalMs: 0,
                    },
                }),
            );

        vi.stubGlobal("fetch", fetchMock);

        await import("../dashboard.js");

        await vi.waitFor(() => {
            expect(
                document.querySelector("#total-time-value").textContent,
            ).toBe("1h 2m");
        });

        const refreshButton = document.querySelector(
            "#refresh-statistics-button",
        );

        refreshButton.click();

        await vi.waitFor(() => {
            expect(
                document.querySelector("#refresh-message").textContent,
            ).toBe("Statistics could not be refreshed.");

            expect(
                document.querySelector("#total-time-value").textContent,
            ).toBe("Unavailable");

            expect(refreshButton.disabled).toBe(false);
            expect(refreshButton.textContent).toBe(
                "Refresh statistics",
            );
        });
    });
});