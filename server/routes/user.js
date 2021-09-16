module.exports = function (app, db) {
  // Add user
  app.post("/api/user", async function (req, res) {
    const newUser = { ...req.body };

    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ username: newUser.username });
    if (!user) {
      usersCollection.insertOne({ ...newUser });
      res.send({ user: newUser, err: null });
    } else {
      res.send({ user: null, err: "User already exists with that username" });
    }
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
