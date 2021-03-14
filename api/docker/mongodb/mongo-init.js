print("Start of mongodb init script");

db = db.getSiblingDB("palette-board");
db.createUser({
  user: "user-2OCHv6OaBxQyFsul",
  pwd: "gRU9SvlKLaRGc5AL",
  roles: [{ role: "readWrite", db: "palette-board" }],
});


/*
  admin
  abc123

  John
  coco123

  Catherine
  green123
*/

let res = [
  db.users.drop(),
  db.users.insert({
    username: "admin",
    email: "admin@pallete.com",
    passwordHash: "$2a$10$bxJKUiIq6oJszXroZjhpae/ql5GQGc8kSV/rPOpS6Gag5E00ixOqC",
  }),
  db.users.insert({
    username: "John",
    email: "john@pallete.com",
    passwordHash: "$2a$10$yMe2NYkbWOLfiGknUYvbbeUDW38LVd/3tuzy.OVVemCjxYC1bUZUe",
  }),
  db.users.insert({
    username: "Catherine",
    email: "catherine@pallete.com",
    passwordHash: "$2a$10$QHw1WpS0ZNTuIuv9KwkGJOJGhWi2J4W/uHmqsu7Sb9KXQ.ZSxHbLa",
  }),
  db.posts.insert({
    likesInfo:{
      count: 0,
      users: []
    },
    shortUUID: 'EZKpFe0dOkg',
    palette: [
      '#003049', 
      '#D62828',
      '#F77F00',
      '#FCBF49',
      '#EAE2B7'
    ],
    userId: db.users.find().toArray()[1]._id,
    createdAt: Date.now()
  }),
  db.posts.insert({
    likesInfo:{
      count: 0,
      users: []
    },
    shortUUID: 'rNzpFe0dOkg',
    palette: [
      '#0B3954', 
      '#087E8B',
      '#BFD7EA',
      '#FF5A5F',
      '#C81D25'
    ],
    userId: db.users.find().toArray()[2]._id,
    createdAt: Date.now()
  }),
];

printjson(res);

print("End of mongodb init script");
