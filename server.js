const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

app.get("/api/gemeente", async (req, res) => {

    const city = req.query.city || "Rotterdam";

    try {

        const url = `https://opendata.cbs.nl/ODataApi/odata/84583NED/TypedDataSet?$filter=RegioS eq '${city}'`;

        const response = await fetch(url);
        const json = await response.json();

        if (!json.value || json.value.length === 0) {
            throw new Error("Geen CBS data gevonden");
        }

        const bevolking = json.value[0].Bevolking_1;

        res.json({
            city,
            bevolking,
            woningen: Math.round(bevolking * 0.45),
            mobiliteit: Math.round(bevolking * 0.6),
            veiligheid: Math.round(bevolking * 0.02),
            energie: ["A", "B", "C"][Math.floor(Math.random() * 3)]
        });

    } catch (err) {

        console.log("CBS fout:", err.message);

        res.json({
            city,
            bevolking: 150000,
            woningen: 60000,
            mobiliteit: 50000,
            veiligheid: 3000,
            energie: "B"
        });

    }

});

app.listen(10000, () => {
    console.log("Server running");
});
