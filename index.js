import express from "express";
import getHeight from "./getHeight.js";

const app = express();
const port = process.env.PORT || 3000;

app.get("/getHeight/:search", async function (req, res) {
  const { search } = req.params;
  const result = await getHeight(search);

  if (result) {
    return res.status(200).send({
      status: "Ok",
      msg: `The height of ${search} is: ${result}.`,
      value: result,
    });
  }
  return res.status(500).send({
    status: "error",
    msg: `Something went wrong`,
  });
});

app.listen(port, function () {
  console.log("App listening on port: " + port);
});
