import {
    getTimeListened,
    getTopArtists,
    getTopTracks,
} from "./api.js";

const topArtistValue = document.querySelector("#top-artist-value");
const topTrackValue = document.querySelector("#top-track-value");
const totalTimeValue = document.querySelector("#total-time-value");

function showListMessage(list, message) {
    list.replaceChildren();

    const item = document.createElement("li");
    item.textContent = message;
    list.appendChild(item);
}

function renderArtists(artists) {
    if (!artists.length) {
        showListMessage(topArtistValue, "No artist data available yet.");
        return;
    }

    topArtistValue.replaceChildren();

    artists.forEach((artist) => {
        const item = document.createElement("li");
        item.textContent = artist.artistName;
        topArtistValue.appendChild(item);
    });
}

function renderTracks(tracks) {
    if (!tracks.length) {
        showListMessage(topTrackValue, "No track data available yet.");
        return;
    }

    topTrackValue.replaceChildren();

    tracks.forEach((track) => {
        const item = document.createElement("li");
        const artists = Array.isArray(track.artistNames)
            ? track.artistNames.join(", ")
            : "";

        item.textContent = artists
            ? `${track.trackName} - ${artists}`
            : track.trackName;

        topTrackValue.appendChild(item);
    });
}

function formatListeningTime(totalMs) {
    const totalMinutes = Math.floor(totalMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
        return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
}

async function loadDashboardStatistics() {
    try {
        const [
            artistsResponse,
            tracksResponse,
            listeningTimeResponse,
        ] = await Promise.all([
            getTopArtists(3),
            getTopTracks(3),
            getTimeListened(),
        ]);

        renderArtists(artistsResponse.topArtists ?? []);
        renderTracks(tracksResponse.topTracks ?? []);

        const totalMs =
            listeningTimeResponse.statistics?.totalMs ?? 0;

        totalTimeValue.textContent = formatListeningTime(totalMs);
    } catch (error) {
        console.error("Failed to load dashboard statistics:", error);

        totalTimeValue.textContent = "Unavailable";
        showListMessage(
            topArtistValue,
            "Statistics could not be loaded.",
        );
        showListMessage(
            topTrackValue,
            "Statistics could not be loaded.",
        );
    }
}

loadDashboardStatistics();