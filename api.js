const BACKEND_URL = "http://127.0.0.1:3000";

// Demo mode lets the deployed frontend be tested without backend credentials.
const DEMO_MODE =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("demo") === "true";

export function isDemoMode() {
    return DEMO_MODE;
}

// Keep authentication, JSON handling, and backend error messages consistent
// across all frontend API requests.
async function requestBackend(path, options = {}) {
    const response = await fetch(`${BACKEND_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message ||
                data.error ||
                `Backend request failed: ${response.status}`,
        );
    }

    return data;
}

export async function getBackendHealth() {
    if (DEMO_MODE) {
        return { status: "ok", demo: true };
    }

    return requestBackend("/health");
}

export async function registerUser({
    email,
    displayName,
    password,
}) {
    if (DEMO_MODE) {
        return {
            message: "Demo account created",
            email,
            displayName,
        };
    }

    return requestBackend("/register", {
        method: "POST",
        body: JSON.stringify({
            email,
            displayName,
            password,
        }),
    });
}

export async function loginUser({ email, password }) {
    if (DEMO_MODE) {
        return {
            message: "Demo login successful",
            email,
        };
    }

    return requestBackend("/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export async function getTopArtists(limit = 3) {
    if (DEMO_MODE) {
        return {
            topArtists: [
                { artistName: "Taylor Swift" },
                { artistName: "The Weeknd" },
                { artistName: "Lady Gaga" },
            ].slice(0, limit),
        };
    }

    return requestBackend(`/api/top-artists?limit=${limit}`);
}

export async function getTopTracks(limit = 3) {
    if (DEMO_MODE) {
        return {
            topTracks: [
                {
                    trackName: "Cruel Summer",
                    artistNames: ["Taylor Swift"],
                },
                {
                    trackName: "Blinding Lights",
                    artistNames: ["The Weeknd"],
                },
                {
                    trackName: "Bad Romance",
                    artistNames: ["Lady Gaga"],
                },
            ].slice(0, limit),
        };
    }

    return requestBackend(`/api/top-tracks?limit=${limit}`);
}

export async function getTimeListened() {
    if (DEMO_MODE) {
        return {
            statistics: {
                totalMs: 6840000,
            },
        };
    }

    return requestBackend("/api/time-listened");
}