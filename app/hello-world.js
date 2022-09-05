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
