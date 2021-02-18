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

  john
  coco123

  catherine
  green123
*/

let res = [
  db.Users.drop(),
  db.Users.insert({
    username: "admin",
    email: "admin@pallete.com",
    passwordHash: "$2a$10$bxJKUiIq6oJszXroZjhpae/ql5GQGc8kSV/rPOpS6Gag5E00ixOqC",
  }),
  db.Users.insert({
    username: "john",
    email: "john@pallete.com",
    passwordHash: "$2a$10$yMe2NYkbWOLfiGknUYvbbeUDW38LVd/3tuzy.OVVemCjxYC1bUZUe",
  }),
  db.Users.insert({
    username: "catherine",
    email: "catherine@pallete.com",
    passwordHash: "$2a$10$QHw1WpS0ZNTuIuv9KwkGJOJGhWi2J4W/uHmqsu7Sb9KXQ.ZSxHbLa",
  }),
];

printjson(res);

print("End of mongodb init script");
