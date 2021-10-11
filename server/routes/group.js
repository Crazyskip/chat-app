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
    delete updatedGroup._id;

    await groupsCollection.updateOne(
      { _id: groupID },
      { $set: { ...updatedGroup } }
    );

    const newGroup = await groupsCollection.findOne({ _id: groupID });

    res.send({ group: newGroup });
  });

  // Delete Group
  app.delete("/api/group/:id", async function (req, res) {
    try {
      groupID = new ObjectId(req.params.id);
      const groupsCollection = db.collection("groups");
      const result = await groupsCollection.deleteOne({ _id: groupID });

      if (result.deletedCount === 1) {
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    } catch (error) {
      res.send({ success: false });
    }
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
    try {
      const groupID = new ObjectId(req.params.id);
      const newChannel = req.body;

      const groupsCollection = db.collection("groups");
      await groupsCollection.updateOne(
        { _id: groupID },
        { $push: { channels: { ...newChannel } } }
      );

      const group = await groupsCollection.findOne({ _id: groupID });
      const channel = group.channels.find(
        (channel) => channel.id === newChannel.id
      );

      if (channel) {
        res.send({ success: true, channel });
      } else {
        res.send({ success: false });
      }
    } catch (error) {
      res.send({ success: false });
    }
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

    const group = await groupsCollection.findOne({ _id: groupID });

    const channel = group.channels.find(
      (channel) => channel.id === Number(req.params.channelId)
    );

    res.send({ channel: channel, success: true });
  });

  // Delete Channel
  app.delete(
    "/api/group/:groupId/channel/:channelId",
    async function (req, res) {
      const groupID = new ObjectId(req.params.groupId);
      const channelID = Number(req.params.channelId);

      const groupsCollection = db.collection("groups");
      const result = await groupsCollection.updateOne(
        { _id: groupID },
        { $pull: { channels: { id: channelID } } }
      );

      if (result.modifiedCount === 1) {
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    }
  );
};
