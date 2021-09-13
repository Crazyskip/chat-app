const dataFunctions = require("../dataFunctions");
const data = dataFunctions.getData();

var group = require("./group");
var user = require("./user");

module.exports = function (app, db) {
  app.use("/api/group", group);
  app.use("/api/user", user);

  // Get user details
  app.post("/api/auth", async function (req, res) {
    if (!req.body) {
      return res.send({ success: false, errors: {} });
    }

    const username = req.body.username;

    const users = db.collection("users");

    const user = await users.findOne({ username: username });

    if (user) {
      res.send({ success: true, user });
    } else {
      res.send({ success: false, errors: {} });
    }
  });

  // Get all users
  app.get("/api/users", function (req, res) {
    res.send({ users: data.users });
  });

  // Get all groups
  app.get("/api/groups", function (req, res) {
    res.send({ groups: data.groups });
  });
};
