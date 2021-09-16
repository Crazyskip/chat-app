module.exports = function (app, db) {
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
};
