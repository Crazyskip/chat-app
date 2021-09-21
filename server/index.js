var express = require("express");
var cors = require("cors");
var app = express();
var http = require("http").Server(app);
var path = require("path");
const multer = require("multer");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

mongoUrl = "mongodb://localhost:27017";
const users = [];

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../dist/chat-app/")));

let server = http.listen(3000, function () {
  let port = server.address().port;
  console.log(`Server listening on port: ${port}`);
});

const mongoClient = new MongoClient(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const main = async () => {
  await mongoClient.connect();

  const dbName = "chat";
  const db = mongoClient.db(dbName);

  // Handle backend routes
  require("./routes/api.js")(app, db, ObjectId, upload);

  app.get("/images/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    res.sendFile(path.join(__dirname, `./images/${imageName}`));
  });

  // Handle frontend routes
  app.all("*", function (req, res) {
    res
      .status(200)
      .sendFile(`/`, { root: path.join(__dirname, "../dist/chat-app/") });
  });

  io.on("connection", (socket) => {
    console.log(`User connection ${socket.id}`);

    socket.on("joinRoom", ({ userID, groupID, channelID }) => {
      const userIndex = users.findIndex((user) => user.userID === userID);
      if (userIndex !== -1) users.splice(userIndex, 1);

      const roomName = `${groupID}-${channelID}`;
      const user = { id: socket.id, userID, roomName };
      users.push(user);

      socket.join(user.roomName);

      console.log(userID + " joined " + roomName);
    });

    socket.on("leaveRoom", ({ userID, groupID, channelID }) => {
      const roomName = `${groupID}-${channelID}`;
      const userIndex = users.findIndex((user) => user.userID === userID);
      if (userIndex !== -1) {
        users.splice(userIndex, 1);
      }
      socket.leave(roomName);
    });

    socket.on("message", async ({ userID, groupID, channelID, message }) => {
      const currentUser = users.find((user) => user.userID === userID);
      const groupsCollection = db.collection("groups");
      const groupObjectId = new ObjectId(groupID);

      await groupsCollection.updateOne(
        { _id: groupObjectId, "channels.id": channelID },
        { $push: { "channels.$.messages": { user: userID, message } } }
      );
      console.log(currentUser.roomName, "Message:", { user: userID, message });
      io.to(currentUser.roomName).emit("message", { user: userID, message });
    });
  });
};

main();
