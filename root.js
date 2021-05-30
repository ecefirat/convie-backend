const app = require("./server");
const Port = 5000;

app.listen(process.env.PORT || Port, () => {
  console.log(`it's listening on port ${Port}`);
});
