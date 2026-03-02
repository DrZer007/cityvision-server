const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

app.get("/api/gemeente", async (req, res) => {

    const city = req.query.city || "Rotterdam";

    try {

        // CBS gemeenten dataset (live)
        const url = "https://opendata.cbs.nl/ODataApi/odata/37230ned/TypedDataSet?$top=1000";

        const response = await fetch(url);
        const data = await response.json();

        // Zoek gemeente
        let gemeente = data.value.find(g => g.Gemeentenaam_1 === city);

        let bevolking = gemeente?.Bevolking_1 || 150000;

        res.json({
            city,
            bevolking: bevolking,
            woningen: Math.round(bevolking * 0.45),
            mobiliteit: Math.round(bevolking * 0.6),
            veiligheid: Math.round(bevolking * 0.02),
            energie: ["A", "B", "C"][Math.floor(Math.random() * 3)]
        });

    } catch (err) {

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
