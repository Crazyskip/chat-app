module.exports = function (app, db, ObjectId, upload) {
  // Get user details
  app.post("/api/auth", async function (req, res) {
    if (!req.body) {
      return res.send({ success: false, errors: {} });
    }

    const username = req.body.username;
    const password = req.body.password;

    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne(
      {
        username: username,
        password: password,
      },
      { projection: { password: 0, _id: 0 } }
    );
    if (user) {
      res.send({ success: true, user });
    } else {
      res.send({ success: false, errors: {} });
    }
  });

  // Get all users
  app.get("/api/users", async function (req, res) {
    const usersCollection = db.collection("users");
    const users = await usersCollection
      .find({}, { projection: { password: 0, _id: 0 } })
      .toArray();
    console.log(users);
    res.send({ users });
  });

  // Get all groups
  app.get("/api/groups", async function (req, res) {
    const groupsCollection = db.collection("groups");
    const groups = await groupsCollection.find().toArray();
    res.send({ groups });
  });

  /**************** Group ****************/

  require("./group.js")(app, db, ObjectId);

  /**************** User ****************/

  require("./user.js")(app, db, upload);
};
