import {
    afterEach,
    beforeEach,
    describe,
    expect,
    test,
    vi,
} from "vitest";

const mocks = vi.hoisted(() => ({
    loginUser: vi.fn(),
    registerUser: vi.fn(),
}));

// Mock the API so these tests focus on authentication-page behaviour.
vi.mock("../api.js", () => mocks);

const authPageMarkup = `
    <form id="register-form">
        <input name="email">
        <input name="displayName">
        <input name="password">
        <p id="register-message"></p>
    </form>

    <form id="login-form">
        <input name="email">
        <input name="password">
        <p id="login-message"></p>
    </form>
`;

function fillInput(formSelector, fieldName, value) {
    document.querySelector(
        `${formSelector} [name="${fieldName}"]`,
    ).value = value;
}

function submitForm(formSelector) {
    document.querySelector(formSelector).dispatchEvent(
        new Event("submit", {
            bubbles: true,
            cancelable: true,
        }),
    );
}

async function waitForAsyncHandler() {
    await new Promise((resolve) => setTimeout(resolve, 0));
}

async function loadAuthPage() {
    document.body.innerHTML = authPageMarkup;

    const fakeWindow = {
        location: {
            href: "",
        },
    };

    vi.stubGlobal("window", fakeWindow);
    await import("../auth.js");

    return fakeWindow;
}

describe("authentication page", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        vi.resetModules();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        document.body.innerHTML = "";
    });

    test("successful login calls the API and redirects to connect.html", async () => {
        mocks.loginUser.mockResolvedValueOnce({});

        const fakeWindow = await loadAuthPage();

        fillInput("#login-form", "email", "user@example.com");
        fillInput("#login-form", "password", "correct-password");

        submitForm("#login-form");
        await waitForAsyncHandler();

        expect(mocks.loginUser).toHaveBeenCalledWith({
            email: "user@example.com",
            password: "correct-password",
        });
        expect(fakeWindow.location.href).toBe("connect.html");
    });

    test("failed login displays the backend error message", async () => {
        mocks.loginUser.mockRejectedValueOnce(
            new Error("Invalid email or password"),
        );

        await loadAuthPage();

        fillInput("#login-form", "email", "user@example.com");
        fillInput("#login-form", "password", "wrong-password");

        submitForm("#login-form");
        await waitForAsyncHandler();

        const message = document.querySelector("#login-message");

        expect(message.textContent).toBe("Invalid email or password");
        expect(message.dataset.error).toBe("true");
    });

    test("successful registration logs the user in and redirects", async () => {
        mocks.registerUser.mockResolvedValueOnce({});
        mocks.loginUser.mockResolvedValueOnce({});

        const fakeWindow = await loadAuthPage();

        fillInput("#register-form", "email", "new@example.com");
        fillInput("#register-form", "displayName", "New User");
        fillInput("#register-form", "password", "strong-password");

        submitForm("#register-form");
        await waitForAsyncHandler();

        expect(mocks.registerUser).toHaveBeenCalledWith({
            email: "new@example.com",
            displayName: "New User",
            password: "strong-password",
        });
        expect(mocks.loginUser).toHaveBeenCalledWith({
            email: "new@example.com",
            password: "strong-password",
        });
        expect(fakeWindow.location.href).toBe("connect.html");
    });

    test("registration failure displays the error and does not log in", async () => {
        mocks.registerUser.mockRejectedValueOnce(
            new Error("Email is already registered"),
        );

        await loadAuthPage();

        fillInput(
            "#register-form",
            "email",
            "existing@example.com",
        );
        fillInput(
            "#register-form",
            "displayName",
            "Existing User",
        );
        fillInput(
            "#register-form",
            "password",
            "strong-password",
        );

        submitForm("#register-form");
        await waitForAsyncHandler();

        const message = document.querySelector("#register-message");

        expect(message.textContent).toBe("Email is already registered");
        expect(message.dataset.error).toBe("true");
        expect(mocks.loginUser).not.toHaveBeenCalled();
    });

    test("registration succeeds but shows a fallback when automatic login fails", async () => {
        mocks.registerUser.mockResolvedValueOnce({});
        mocks.loginUser.mockRejectedValueOnce(
            new Error("Login failed"),
        );

        await loadAuthPage();

        fillInput("#register-form", "email", "new@example.com");
        fillInput("#register-form", "displayName", "New User");
        fillInput("#register-form", "password", "strong-password");

        submitForm("#register-form");
        await waitForAsyncHandler();

        const message = document.querySelector("#register-message");

        expect(message.textContent).toBe(
            "Account created, but automatic login failed. Please log in manually.",
        );
        expect(message.dataset.error).toBe("true");
    });
});