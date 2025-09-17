const express = require("express");
const { sequelize } = require("./database/db_conn");
const commonConstants = require("./common/constants");
const authRoutes = require("./routes/authRoutes")
const app = express();

const PORT = process.env.PORT

app.use("/api", authRoutes);

sequelize.authenticate()
  .then(()=> {
    console.log(commonConstants.DATABASE_CONNECTION.SUCCESS);
  })
  .catch((error) => {
    console.log(commonConstants.DATABASE_CONNECTION.FAILED + error)
  })

app.listen(PORT, () => console.log(
  commonConstants.SERVCER_CONNECTION.SUCCESS + PORT
))