module.exports = function (app, path) {
  const users = [
    { username: "super", email: "super@gmail.com", id: 1, role: "super admin" },
    { username: "admin", email: "admin@gmail.com", id: 2, role: "group admin" },
    { username: "user1", email: "user1@gmail.com", id: 3, role: "member" },
    { username: "user2", email: "user2@gmail.com", id: 4, role: "member" },
    { username: "user3", email: "user3@gmail.com", id: 5, role: "member" },
    { username: "user4", email: "user4@gmail.com", id: 6, role: "member" },
    { username: "user5", email: "user5@gmail.com", id: 7, role: "member" },
    { username: "user6", email: "user6@gmail.com", id: 8, role: "member" },
  ];

  const groups = [
    {
      name: "Group 1",
      assistant: 6,
      members: [3, 4, 7],
      channels: [
        { name: "general", members: [3, 4, 7] },
        { name: "important", members: [4] },
      ],
    },
    {
      name: "Group 2",
      assistant: 3,
      members: [4, 5, 6, 7, 8],
      channels: [
        { name: "general", members: [4, 5, 6, 7, 8] },
        { name: "important", members: [4, 6] },
        { name: "assignment talk", members: [4, 5, 7] },
      ],
    },
  ];

  app.post("/api/auth", function (req, res) {
    if (!req.body) {
      return res.send({ success: false, errors: {} });
    }

    const username = req.body.username;

    const user = users.find((user) => user.username === username);

    if (user) {
      res.send({ success: true, user });
    } else {
      res.send({ success: false, errors: {} });
    }
  });

  app.post("/api/groups", function (req, res) {
    const user = { ...req.body.user };

    if (user.role === "super admin" || user.role === "group admin") {
      return res.send({ groups });
    }

    const userGroups = groups.filter(
      (group) => group.members.includes(user.id) || group.assistant === user.id
    );

    res.send({
      groups: userGroups.map((group) => {
        // to copy array not reference
        return {
          ...group,
          channels: group.channels.filter(
            (channel) =>
              channel.members.includes(user.id) || group.assistant === user.id
          ),
        };
      }),
    });
  });
};
