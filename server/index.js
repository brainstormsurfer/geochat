import express from "express";
const app = express();
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("hello server is started");
});

io.on("connection", (socket) => {
  console.log(`user connected of the id: ${socket.id}`);

  socket.on("disconnect", () => {
    disconnectEventHandler(socket.id);
  });
});

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`);
});

// Socket events
const disconnectEventHandler = (id) => {
  console.log(`user (id: ${id}) - disconneted`);
};
