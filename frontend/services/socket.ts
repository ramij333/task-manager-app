
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");

  socket = io( process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000", {
    withCredentials: true,
    auth: {
      token,
    },
  });
}

export default socket;









