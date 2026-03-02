const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

app.get("/api/gemeente", async (req, res) => {

    const city = req.query.city || "Rotterdam";

    try {

        // CBS bevolking Nederland (voorbeeld echte bron)
        let bevolking = null;

        try {
            const cbsRes = await fetch(
                "https://opendata.cbs.nl/ODataApi/odata/37296NED/TypedDataSet?$top=1"
            );
            const cbsData = await cbsRes.json();
            bevolking = cbsData.value[0].Bevolking_1;
        } catch (e) {
            bevolking = 17500000;
        }

        // Simpele gemeentefactor (later uitbreiden)
        const cityFactor = {
            Rotterdam: 0.038,
            Amsterdam: 0.053,
            Utrecht: 0.021,
            DenHaag: 0.031
        };

        let factor = cityFactor[city] || 0.02;

        let bevolkingGemeente = Math.round(bevolking * factor);

        res.json({
            city,
            bevolking: bevolkingGemeente,
            woningen: Math.round(bevolkingGemeente * 0.45),
            mobiliteit: Math.round(Math.random() * 1000),
            veiligheid: Math.round(bevolkingGemeente * 0.02),
            energie: ["A", "B", "C"][Math.floor(Math.random() * 3)]
        });

    } catch (err) {
        res.json({ error: "Server fout" });
    }

});

app.listen(10000, () => {
    console.log("Server running");
});