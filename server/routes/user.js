module.exports = function (app, db, upload) {
  // Add user
  app.post(
    "/api/user",
    upload.single("profileImage"),
    async function (req, res) {
      console.log(req.body);
      const newUser = {
        id: Number(req.body.id),
        username: req.body.username,
        password: req.body.password,
        image: req.file.filename,
        email: req.body.email,
        role: req.body.role,
      };

      const usersCollection = db.collection("users");
      const user = await usersCollection.findOne({
        username: newUser.username,
      });

      if (!user) {
        usersCollection.insertOne({ ...newUser });
        delete newUser.password;
        res.send({ user: newUser, err: null });
      } else {
        res.send({ user: null, err: "User already exists with that username" });
      }
    }
  );

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

    console.log(updatedUser);

    const usersCollection = db.collection("users");
    usersCollection.updateOne({ id: userID }, { $set: { ...updatedUser } });

    res.send({ success: true });
  });
};
