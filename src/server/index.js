const { log } = require("console");
const express = require("express");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const { firebase } = require("./firebase/index");
require("dotenv").config();

const app = express();
const server = http.Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const PORT = process.env.PORT || 3002;
const connectedUsers = {};

function generateRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join("-");
}

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/api/triggerSocketNotify", express.json(), (req, res) => {
  try {
    const msgResp = req.body;
    const { SenderID, ReceiverID } = req.body;
    const roomId = generateRoomId(SenderID, ReceiverID);

    io.in(roomId).emit("receiveMessage", {
      msgResp,
    });

    res.json({ message: "Message send successfully" });
  } catch (err) {
    console.log("Error in triggerSocketNotify : ", err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ userId, friendId }, callback) => {
    const roomId = generateRoomId(userId, friendId);
    socket.join(roomId, () => {
      console.log("Joined a room", roomId);
    });
    connectedUsers[userId] = roomId;
    console.log("connected users is : ", connectedUsers);

    callback({ success: true, roomId: roomId });
  });

  socket.on("initiateAudioCall", (details) => {
    const roomId = generateRoomId(details.callerId, details.recipientId);
    try {
      details.meetingId = uuidv4();
      details.roomId = roomId;
      console.log("Meeting Id is : ", details);
      io.in(roomId).emit("playRingtone", details);
    } catch (err) {
      console.log("Error in initiateAudioCall : ", err);
    }
  });

  socket.on("callAccepted", (details) => {
    console.log("Dtais are : ", details);
    const roomId = generateRoomId(details.callerId, details.recipientId);
    try {
      io.in(roomId).emit("accept", details);
    } catch (err) {
      console.log("Error in callAcceptance : ", err);
    }
  });

  socket.on("endCall", (details) => {
    const roomId = generateRoomId(details.SenderId, details.receiverId);
    try {
      io.in(roomId).emit("cutCall", details);
    } catch (err) {
      console.log("Error in callRejection : ", err);
    }
    console.log("Details are end call : ", details);
  });

  socket.on("leaveRoom", ({ userId, friendId }) => {
    const roomId = generateRoomId(userId, friendId);
    socket.leave(roomId, () => {
      console.log("Left room", roomId);
    });
    console.log("connected users after leaving room:", connectedUsers);
    delete connectedUsers[userId];
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected : ", socket.id);
    for (const userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];
        break;
      }
    }
  });
});

app.post("/api/call", express.json(), async (req, res) => {
  try {
    console.log("Inside here ",req.body);
    let {fcmTokens, friendName, userId, id, token, type} = req.body;
    userId = String(userId);
    id = String(id);
    token = String(token);
    let fcmtoken = fcmTokens.toString();
    let callId = uuidv4();
    // fcmTokens.shift();
      const message = {
        tokens: fcmTokens,
        data: {
          navigationId: type,
          callId,
          friendName,
          userId,
          id,
          token,
          fcmtoken,
          pickUp: '1',
        },
        notification: {
          title: "ACTPAL",
          body: "You have a missed call. Open app to preview.",
        },
        android: {
          priority: "high",
        },
        apns: {
          payload: {
            aps: {
              "content-available": 1,
            },
          },
          headers: {
            "apns-priority": "5",
          },
        },
      };
      const {responses} = await firebase.messaging().sendEachForMulticast(message);
      console.log("Responses are : ",responses);
      if (responses[0]?.success){
        res.status(201).json({ code: 1, message: "Call sent successfully", callId, fcmTokens, token});
      } else {
        res.status(500).json({
          code: 0,
          error: "Error sending the call",
        });
      }
  } catch (err) {
    console.log("Error sending the calls : ", err);
    res.status(500).json({
      code: 0,
      error: "Internal Server Error",
    });
  }
});

app.post("/api/endCall", express.json(), async (req, res) => {
  try {
    let {token, callId} = req.body;
    let fcmTokensArray = [];

    if (typeof token === 'string') {
      fcmTokensArray = token.split(',').map(token => String(token));
    } else if (Array.isArray(token)) {
      fcmTokensArray = token.map(token => String(token));
    }
    console.log("Bodyyy is : ", fcmTokensArray, callId);
      const message = {
        tokens: fcmTokensArray,
        data: {
          pickUp: '2',
          callId,
        },
        android: {
          priority: "high",
        },
        apns: {
          payload: {
            aps: {
              "content-available": 1,
            },
          },
          headers: {
            "apns-priority": "5",
          },
        },
      };
      const {responses} = await firebase.messaging().sendEachForMulticast(message);
      console.log("Responses are : ",responses);
      if (responses[0]?.success){
        res.status(201).json({ code: 1, message: "Call sent successfully"});
      } else {
        res.status(500).json({
          code: 0,
          error: "Error sending the call",
        });
      }
  } catch (err) {
    console.log("Error sending the calls : ", err);
    res.status(500).json({
      code: 0,
      error: "Internal Server Error",
    });
  }
});

server.listen(PORT, async () => {
  console.log("Server is running on PORT: ", PORT);
});
