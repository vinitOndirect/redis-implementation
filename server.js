const app = require("./app");

const PORT = 8090 || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
