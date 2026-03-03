const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

// 📂 Load lokale CBS data
const gemeentenData = JSON.parse(
    fs.readFileSync("./gemeenten.json", "utf-8")
);

app.get("/api/gemeente", (req, res) => {

    const city = (req.query.city || "Rotterdam").toLowerCase();

    const bevolking = gemeentenData[city] || 150000;

    res.json({
        city,
        bevolking,
        woningen: Math.round(bevolking * 0.45),
        mobiliteit: Math.round(bevolking * 0.6),
        veiligheid: Math.round(bevolking * 0.02),
        energie: ["A", "B", "C"][Math.floor(Math.random() * 3)]
    });

});

app.listen(10000, () => {
    console.log("Server running with local CBS data");
});
