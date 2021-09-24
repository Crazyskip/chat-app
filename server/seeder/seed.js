const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

const users = [
  {
    id: 1,
    username: "super",
    password: "12345",
    image: "ef10f1a6efw.jpg",
    email: "super@gmail.com",
    role: "super admin",
  },
  {
    id: 2,
    username: "admin",
    password: "12345",
    image: "adK3Vu70DEQ.jpg",
    email: "group@gmail.com",
    role: "group admin",
  },
  {
    id: 3,
    username: "user3",
    password: "12345",
    image: "dfc9031c2bo.jpg",
    email: "user3@gmail.com",
    role: "member",
  },
  {
    id: 4,
    username: "user4",
    password: "12345",
    image: "IFxjDdqK_0U.jpg",
    email: "user4@gmail.com",
    role: "member",
  },
  {
    id: 5,
    username: "user5",
    password: "12345",
    image: "r077pfFsdaU.jpg",
    email: "user5@gmail.com",
    role: "member",
  },
  {
    id: 6,
    username: "user6",
    password: "12345",
    image: "xgTMSz6kegE.jpg",
    email: "user6@gmail.com",
    role: "member",
  },
];

const groups = [
  {
    name: "Group 1",
    assistants: [3],
    members: [4, 5],
    channels: [
      {
        id: 1,
        name: "general",
        members: [4, 5],
        messages: [
          { user: 1, message: "Hello from super admin" },
          { user: 4, message: "Hello super admin" },
        ],
      },
      {
        id: 2,
        name: "secret",
        members: [4],
        messages: [
          { user: 1, message: "Hello from super admin" },
          { user: 4, message: "Hello super admin" },
        ],
      },
    ],
  },
  {
    name: "Group 2",
    assistants: [4],
    members: [3, 5, 6],
    channels: [
      {
        id: 1,
        name: "general",
        members: [4, 5, 6],
        messages: [
          { user: 1, message: "Welcome to general" },
          { user: 1, message: "Hello from super admin" },
          { user: 3, message: "Hello super admin" },
        ],
      },
      {
        id: 2,
        name: "assignment",
        members: [4, 6],
        messages: [
          { user: 1, message: "Hello from super admin" },
          { user: 4, message: "Hello super admin" },
          { user: 6, message: "I am user 6" },
        ],
      },
    ],
  },
];

async function seedUsers(db) {
  await db.collection("users").drop();
  const usersCollection = db.collection("users");
  await usersCollection.insertMany(users);

  console.log("Seeded Users");
}

async function seedGroups(db) {
  await db.collection("groups").drop();
  const groupsCollection = db.collection("groups");
  await groupsCollection.insertMany(groups);

  console.log("Seeded Groups");
}

async function seed() {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db("chat");

  await seedUsers(db);
  await seedGroups(db);

  client.close();
}

seed();
