const app = require("./src/app");

const PORT = process.env.PORT || 3055;

app.listen(PORT, () => {
  console.log(`Service is listening on http://localhost:${PORT}`);
});
