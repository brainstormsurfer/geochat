import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;
const ADMIN = "Admin";

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const expressServer = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// state
const UsersState = {
  users: [],
  setUsers: function (newUsersArray) {
    this.users = newUsersArray;
  },
};

const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:5500", "http://127.0.0.1:5500"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // Upon connection - only to user
  socket.emit("message", buildMsg(ADMIN, "Welcome to the chat!"));

  // Upon connection - when entering a room
  socket.on("enterRoom", ({ name, room }) => {
    // leave previous room
    const prevRoom = getUser(socket.id)?.room;

    if (prevRoom) {
      socket.leave(prevRoom);
      io.to(prevRoom).emit(
        "message",
        buildMsg(ADMIN, `${name} has left the room`)
      );
    }

    const user = activateUser(socket.id, name, room);

    // Cannoot update previous room users list until after the state update in activate user
    if (prevRoom) {
      io.to(prevRoom).emit("userList", { users: getUsersInRoom(prevRoom) });
    }

    // join room
    socket.join(user.room);

    // To user who joined
    socket.emit(
      "message",
      buildMsg(ADMIN, `You have joined the ${user.room} chat room`)
    );

    // To everyone else
    socket.broadcast
      .to(user.room)
      .emit("message", buildMsg(ADMIN, `${user.name} has joined the room`));

    // Update user list for a room
    io.to(user.room).emit("userList", {
      users: getUsersInRoom(user.room),
    });

    // Update room list for everyone
    io.emit("roomList", {
      rooms: getAllActiveRooms(),
    });
  });

  // When user disconnets - to all others
  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    userLeavesApp(socket.id);

    if (user) {
      // Emit a message to the room the user just left
      io.to(user.room).emit(
        "message",
        buildMsg(ADMIN, `${user.name} has left the room`)
      );

      // Emit a user list message to update the user list for everyone in the room
      io.to(user.room).emit("userList", {
        users: getUsersInRoom(user.room),
      });

      // Update the rooms list for all users by emitting a message to all connected sockets
      io.emit("roomList", {
        rooms: getAllActiveRooms(),
      });
    }

    console.log(`User ${socket.id} disconnected`);
  });

  // Listening for a message event
  socket.on("message", ({ name, text }) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      io.to(room).emit("message", buildMsg(name, text));
    }
  });

  // Listen for activity
  socket.on("activity", (name) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      socket.broadcast.to(room).emit("activity", name);
    }
  });
});

function buildMsg(name, text) {
  return {
    name,
    text,
    time: new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(new Date()),
  };
}

// User functions
function activateUser(id, name, room) {
  const user = { id, name, room };
  // Filter an array of users by excluding the user with the specified ID, ensuring no duplicates from the previous room, and preparing for activation in a new room.
  UsersState.setUsers([
    ...UsersState.users.filter((user) => user.id !== id),
    user,
  ]);
  return user;
}

function userLeavesApp(id) {
  //filter out the user who has left the application, returning the updated array without the departed user.
  UsersState.setUsers(UsersState.users.filter((user) => user.id !== id));
}

function getUser(id) {
  return UsersState.users.find((user) => user.id === id);
}

function getUsersInRoom(room) {
  return UsersState.users.filter((user) => user.room === room);
}

function getAllActiveRooms() {
  // equivallent to Array.from(new Set(...
  return [...new Set(UsersState.users.map((user) => user.room))];
}
