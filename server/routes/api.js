const data = require("../data.json");
module.exports = function (app, path) {
  app.post("/api/auth", function (req, res) {
    if (!req.body) {
      return res.send({ success: false, errors: {} });
    }

    const username = req.body.username;

    const user = data.users.find((user) => user.username === username);

    if (user) {
      res.send({ success: true, user });
    } else {
      res.send({ success: false, errors: {} });
    }
  });

  app.get("/api/users", function (req, res) {
    res.send({ users: data.users });
  });

  app.put("/api/users/:userID", function (req, res) {
    const userIndex = data.users.findIndex(
      (user) => user.id === Number(req.params.userID)
    );

    if (userIndex === -1) return res.status(404).json({});

    const newUser = { ...req.body };
    data.users[userIndex] = newUser;

    res.send({ user: newUser });
  });

  app.post("/api/group", function (req, res) {
    const newGroup = { ...req.body };
    data.groups.push(newGroup);
    res.send({ group: newGroup });
  });

  app.get("/api/group/:id", function (req, res) {
    const groupID = Number(req.params.id);

    res.send({ group: data.groups.find((group) => group.id === groupID) });
  });

  app.put("/api/group/:id", function (req, res) {
    const groupIndex = data.groups.findIndex(
      (group) => group.id === Number(req.params.id)
    );

    if (groupIndex === -1) return res.status(404).json({});

    const newGroup = { ...req.body };
    data.groups[groupIndex] = newGroup;

    res.send({ group: newGroup });
  });

  app.delete("/api/group/:id", function (req, res) {
    const groupIndex = data.groups.findIndex(
      (group) => group.id === Number(req.params.id)
    );

    if (groupIndex === -1) return res.send({ success: false });

    data.groups.splice(groupIndex, 1);

    res.send({ success: true });
  });

  app.get("/api/groups", function (req, res) {
    res.send({ groups: data.groups });
  });
};
