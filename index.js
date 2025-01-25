const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { gpt } = require("gpti");
app.use(cors());
const port = process.env.PORT || 3030;
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "pub/index.html"));
});

app.get("/ai", async function (req, res) {
    try {
        let { prompt, uid } = req.query;
        let path = __dirname + "/public/gpt4.json";
        let data = {};

        if (fs.existsSync(path)) {
            data = JSON.parse(fs.readFileSync(path, "utf8"));
        }

        if (!prompt) {
            return res.json({ response: "Missing input query!" });
        }
        if (!uid) {
            return res.json({ response: "Missing ID!" });
        }

        if (!data[uid]) {
            data[uid] = [
                {
                    role: "assistant",
                    content: "Hi! How can I assist you today?",
                },
            ];
        }

        if (prompt === "delete" || prompt === "clear") {
            data[uid] = [];
            fs.writeFileSync(path, JSON.stringify(data, null, 4));
            return res.json({ response: "Your history has successfully cleared" });
        }

        if (prompt === "delete all" || prompt === "clear all") {
            if (uid !== "100055943906136") return res.json({ gpt4: "You don't have permission to do this!" });
            data = {};
            fs.writeFileSync(path, JSON.stringify(data, null, 4));
            return res.json({ response: "All histories have been cleared" });
        }

        data[uid].push({
            role: "user",
            content: prompt,
        });

        gpt.v1(
            {
                messages: data[uid],
                prompt,
                model: "GPT-4",
                markdown: false,
            },
            (err, respond) => {
                if (err != null) {
                    console.log(err);
                    return res.status(500).json({ gpt4: "An error occurred while processing your request." });
                } else {
                  
                    data[uid].push({
                        role: "assistant",
                        content: respond.gpt,
                    });
                    fs.writeFileSync(path, JSON.stringify(data, null, 4));

                    return res.json({ response: respond.gpt });
                }
            },
        );
    } catch (e) {
        return res.status(500).json({
            message: e.message
        });
    }
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log("Listening on port", port);
});
