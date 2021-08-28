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

  app.post("/api/groups", function (req, res) {
    const user = { ...req.body.user };

    if (user.role === "super admin" || user.role === "group admin") {
      return res.send({ groups: data.groups });
    }

    const userGroups = data.groups.filter(
      (group) =>
        group.members.includes(user.id) || group.assistants.includes(user.id)
    );

    res.send({
      groups: userGroups.map((group) => {
        // to copy array not reference
        return {
          ...group,
          channels: group.channels.filter(
            (channel) =>
              channel.members.includes(user.id) ||
              group.assistants.includes(user.id)
          ),
        };
      }),
    });
  });
};
