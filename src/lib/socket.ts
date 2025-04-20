import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000"; // Replace with server URL

// Initialize the socket instance
const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // Prevent auto-connection; connect manually when needed
});

export default socket;
