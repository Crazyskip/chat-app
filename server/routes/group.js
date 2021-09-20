module.exports = function (app, db, ObjectId) {
  // Get Group
  app.get("/api/group/:id", async function (req, res) {
    const groupID = new ObjectId(req.params.id);

    const groupsCollection = db.collection("groups");
    const group = await groupsCollection.findOne({ _id: groupID });

    res.send({ group });
  });

  // New group
  app.post("/api/group", async function (req, res) {
    const newGroup = { ...req.body };
    delete newGroup._id;

    const groupsCollection = db.collection("groups");
    await groupsCollection.insertOne({ ...newGroup });

    res.send({ group: newGroup });
  });

  // Update Group
  app.put("/api/group/:id", async function (req, res) {
    const groupID = new ObjectId(req.params.id);

    const groupsCollection = db.collection("groups");
    const updatedGroup = req.body;

    await groupsCollection.updateOne(
      { _id: groupID },
      { $set: { ...updatedGroup } }
    );

    res.send({ group: updatedGroup });
  });

  // Delete Group
  app.delete("/api/group/:id", async function (req, res) {
    const groupID = new ObjectId(req.params.id);

    const groupsCollection = db.collection("groups");
    await groupsCollection.deleteOne({ _id: groupID });

    res.send({ success: true });
  });

  // Get Channel
  app.get("/api/group/:groupId/channel/:channelId", async function (req, res) {
    const groupID = new ObjectId(req.params.groupId);

    const groupsCollection = db.collection("groups");
    const group = await groupsCollection.findOne({ _id: groupID });

    const channel = group.channels.find(
      (channel) => channel.id === Number(req.params.channelId)
    );

    res.send({ channel });
  });

  // Add Channel
  app.post("/api/group/:id/channel", async function (req, res) {
    const groupID = new ObjectId(req.params.id);

    const newChannel = req.body;

    const groupsCollection = db.collection("groups");
    await groupsCollection.updateOne(
      { _id: groupID },
      { $push: { channels: { ...newChannel } } }
    );

    res.send({ success: true });
  });

  // Update Channel
  app.put("/api/group/:groupId/channel/:channelId", async function (req, res) {
    const groupID = new ObjectId(req.params.groupId);
    const channelID = Number(req.params.channelId);

    const channelName = req.body.channelName;
    const channelMembers = req.body.channelMembers;

    const groupsCollection = db.collection("groups");
    await groupsCollection.updateOne(
      { _id: groupID, "channels.id": channelID },
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
      const groupID = new ObjectId(req.params.groupId);
      const channelID = Number(req.params.channelId);

      const groupsCollection = db.collection("groups");
      await groupsCollection.updateOne(
        { _id: groupID },
        { $pull: { channels: { id: channelID } } }
      );

      res.send({ success: true });
    }
  );
};
