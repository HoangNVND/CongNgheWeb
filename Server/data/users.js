import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin",
    email: "nghoangnamdinh@gmail.com",
    password: bcrypt.hashSync("1234", 10),
    isAdmin: true,
  },
  {
    name: "TruongBL",
    email: "builetruong@gmail.com",
    password: bcrypt.hashSync("1234", 10),
  },
  {
    name: "Hello",
    email: "hello@gmail.com",
    password: bcrypt.hashSync("1234", 10),
  },
  {
    name: "Hello World",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("1234", 10),
  },
];
export default users;
