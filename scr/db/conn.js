const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/final-registration", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })

  .then(() => {
    console.log("operation succssful ");
  })
  .catch((err) => {
    console.log("no connection");
  });
