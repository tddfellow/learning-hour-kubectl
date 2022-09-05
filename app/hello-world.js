import express from "express";

const app = express();
app.use(express.json());

app.get("/status", (req, res) => {
    console.log("received GET /status");
    res.send({ok: true});
});

app.get("/hello", (req, res) => {
    const name = req.query.name ?? "world";
    console.log(`received GET /hello with name=${name}`);
    res.send({message: `hello, ${name}!`});
});

const port = parseFloat(process.env.PORT ?? "8080");

app.listen(port, () => console.log(`Listening on port :${port}`));

const secretApp = express();
secretApp.use(express.json());

secretApp.get("/secret", (req, res) => {
    res.send({ message: "this is a secret endpoint!" });
});

const secretPort = parseFloat(process.env.SECRET_PORT ?? "9090");

secretApp.listen(secretPort, () => console.log(`Listening on secret port :${secretPort}`));
