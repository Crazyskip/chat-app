var user = require("./user");

module.exports = function (app, db) {
  app.use("/api/user", user);

  // Get user details
  app.post("/api/auth", async function (req, res) {
    if (!req.body) {
      return res.send({ success: false, errors: {} });
    }

    const username = req.body.username;

    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username: username });

    if (user) {
      res.send({ success: true, user });
    } else {
      res.send({ success: false, errors: {} });
    }
  });

  // Get all users
  app.get("/api/users", async function (req, res) {
    const usersCollection = db.collection("users");
    const users = await usersCollection.find().toArray();
    res.send({ users });
  });

  // Get all groups
  app.get("/api/groups", async function (req, res) {
    const groupsCollection = db.collection("groups");
    const groups = await groupsCollection.find().toArray();
    res.send({ groups });
  });

  /**************** Group ****************/

  // Get Group
  app.get("/api/group/:id", async function (req, res) {
    const groupID = Number(req.params.id);

    const groupsCollection = db.collection("groups");
    const group = await groupsCollection.findOne({ id: groupID });

    res.send({ group });
  });

  // New group
  app.post("/api/group", async function (req, res) {
    const newGroup = { ...req.body };

    const groupsCollection = db.collection("groups");
    await groupsCollection.insertOne({ ...newGroup });

    res.send({ group: newGroup });
  });

  // Update Group
  app.put("/api/group/:id", async function (req, res) {
    const groupID = Number(req.params.id);

    const groupsCollection = db.collection("groups");
    const updatedGroup = req.body;

    await groupsCollection.updateOne(
      { id: groupID },
      { $set: { ...updatedGroup } }
    );

    res.send({ group: updatedGroup });
  });

  // Delete Group
  app.delete("/api/group/:id", async function (req, res) {
    const groupID = Number(req.params.id);

    const groupsCollection = db.collection("groups");
    await groupsCollection.deleteOne({ id: groupID });

    res.send({ success: true });
  });

  // Add Channel
  app.post("/api/group/:id/channel", async function (req, res) {
    const groupID = Number(req.params.id);

    const newChannel = req.body;
    console.log(newChannel);

    const groupsCollection = db.collection("groups");
    await groupsCollection.updateOne(
      { id: groupID },
      { $push: { channels: { ...newChannel } } }
    );

    res.send({ success: true });
  });

  app.put("/api/group/:groupId/channel/:channelId", async function (req, res) {
    const groupID = Number(req.params.groupId);
    const channelID = Number(req.params.channelId);

    const channelName = req.body.channelName;
    const channelMembers = req.body.channelMembers;

    console.log(channelName, channelMembers);

    const groupsCollection = db.collection("groups");
    await groupsCollection.updateOne(
      { id: groupID, "channels.id": channelID },
      {
        $set: {
          "channels.$.name": channelName,
          "channels.$.members": channelMembers,
        },
      }
    );

    res.send({ success: true });
  });

  // Delete Channel
  app.delete(
    "/api/group/:groupId/channel/:channelId",
    async function (req, res) {
      const groupID = Number(req.params.groupId);
      const channelID = Number(req.params.channelId);

      const groupsCollection = db.collection("groups");
      await groupsCollection.updateOne(
        { id: groupID },
        { $pull: { channels: { id: channelID } } }
      );

      res.send({ success: true });
    }
  );

  // Add message
  app.post("/api/group/:groupId/channel/:channelId", async function (req, res) {
    const groupID = Number(req.params.groupId);
    const channelID = Number(req.params.channelId);

    const newMessage = { user: req.body.userID, message: req.body.message };

    const groupsCollection = db.collection("groups");

    await groupsCollection.updateOne(
      { id: groupID, "channels.id": channelID },
      { $push: { "channels.$.messages": { ...newMessage } } }
    );

    res.send({ success: true, message: newMessage });
  });

  /**************** User ****************/

  // Add user
  app.post("/api/user", function (req, res) {
    const newUser = { ...req.body };

    const usersCollection = db.collection("users");
    usersCollection.insertOne({ ...newUser });

    res.send({ user: newUser });
  });

  // Delete user
  app.delete("/api/user/:id", function (req, res) {
    const userID = Number(req.params.id);

    const usersCollection = db.collection("users");
    usersCollection.deleteOne({ id: userID });

    res.send({ success: true });
  });

  // Update User
  app.put("/api/user/:id", function (req, res) {
    const userID = Number(req.params.id);

    const updatedUser = { ...req.body };

    const usersCollection = db.collection("users");
    usersCollection.updateOne({ id: userID }, { $set: { ...updatedUser } });

    res.send({ user: updatedUser });
  });
};
