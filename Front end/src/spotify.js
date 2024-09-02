const authEndpoint = "https://accounts.spotify.com/authorize?";
const clientId = "414414d8645b4746a08bc76b9abd6809";
const redirectUri = "https://localhost:3000";
const scopes = ["user-library-read", "playlist-read-private"];

export const loginEndpoint = `${authEndpoint}client_Id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    "%20"
)}&response_type=token&show_dialog=true`;