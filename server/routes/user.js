module.exports = function (app, db) {
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
