const { createServer } = require("node:http");
const { pool } = require("./db_conn");

async function CreatePerson(lastName, firstName, age) {
  const res = await pool.query(
      "INSERT INTO persons (lastName, firstName, age) VALUES ($1, $2, $3)",
      [lastName, firstName, age]
    );
}

// CreatePerson("ottsupi", "dev", 24)

const hostname = "0.0.0.0";
const port = 3000;

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

server.listen(port, hostname, () => {
  console.log(`Server running in the container at: ${hostname}:${port}`);
  console.log(`Accessible from the host machine at: http://localhost:${port}/`);
});
