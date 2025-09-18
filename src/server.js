const express = require("express");
const sequelize = require("./database/db_conn");

const User = require("./models/user");

const commonConstants = require("./common/constants");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
app.use(express.json());
const PORT = process.env.PORT

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

sequelize
  .sync()
  .then(()=> {
    console.log(commonConstants.DATABASE_CONNECTION.SUCCESS);
  })
  .catch((error) => {
    console.log(commonConstants.DATABASE_CONNECTION.FAILED + error)
  })

app.listen(PORT, () => console.log(
  commonConstants.SERVCER_CONNECTION.SUCCESS + PORT
))