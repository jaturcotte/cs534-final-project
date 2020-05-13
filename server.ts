import express, { Response, Request } from "express";
import { promises as fspromises } from "fs";
import bodyParser from "body-parser";
import { join } from "path";

const app = express();

app.use("/jotto", express.static(join(__dirname, "public_html")));
app.use(bodyParser.json());
const port = process.env.NODE_PORT || 3900;

app.post("/jotto", (req: Request, res: Response) => {
  let f = "";
  if (req.body.agent === "UniformGreedy") {
    f = "uniformgreedy-v-human.csv";
  } else if (req.body.agent === "HGreedy") {
    f = "hgreedy-v-human.csv";
  } else {
    res
      .status(400)
      .contentType("application/json")
      .send(
        JSON.stringify({
          status: 400,
          message: `Invalid agent: ${req.body.agent}`,
        })
      );
    return;
  }
  const filename = join(__dirname, "results", f);
  if (!req.body.results || req.body.results.length > 4096) {
    res
      .status(400)
      .contentType("application/json")
      .send(
        JSON.stringify({
          status: 400,
          message: `Invalid results: ${req.body.results}`,
        })
      );
    return;
  }
  fspromises
    .appendFile(filename, req.body.results)
    .then(() => {
      res
        .status(200)
        .contentType("application/json")
        .send(
          JSON.stringify({
            status: 200,
            message: `Accepted submission`,
          })
        );
      return;
    })
    .catch((reason) => {
      res
        .status(500)
        .contentType("application/json")
        .send(
          JSON.stringify({
            status: 500,
            message: reason,
          })
        );
      return;
    });
});

app.listen(port, () => {
  console.log("Started listening on port " + port + "...");
});
