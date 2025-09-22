const express = require("express");

const passport = require("passport");
const session = require("express-session");
require("./utilities/passport"); // register strategy

const sequelize = require("./database/db_conn");

const User = require("./models/user");
const Ticket = require("./models/ticket");
const Category = require("./models/category");

const commonConstants = require("./common/constants");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const categoryRoutes = require("./routes/categoryRoutes");


const app = express();
app.use(express.json());
const PORT = process.env.PORT

// Session middleware must be before routes
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/category", categoryRoutes);

sequelize
  .sync()
  .then(()=> {
    console.log(commonConstants.DATABASE_CONNECTION.SUCCESS);
  })
  .catch((error) => {
    console.log(commonConstants.DATABASE_CONNECTION.FAILED + error)
  })

app.listen(PORT, () => console.log(
  commonConstants.SERVER_CONNECTION.SUCCESS + PORT
))