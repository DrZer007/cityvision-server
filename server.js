const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

app.get("/api/gemeente", async (req, res) => {

    const city = (req.query.city || "Rotterdam").toLowerCase();

    try {

        const response = await fetch(
            "https://opendata.cbs.nl/ODataApi/odata/84583NED/TypedDataSet?$top=1000"
        );

        const json = await response.json();

        let bevolking = 150000;

        for (let row of json.value) {
            if (row.RegioS && row.RegioS.toLowerCase().includes(city)) {
                bevolking = row.Bevolking_1 || bevolking;
                break;
            }
        }

        res.json({
            city,
            bevolking,
            woningen: Math.round(bevolking * 0.45),
            mobiliteit: Math.round(bevolking * 0.6),
            veiligheid: Math.round(bevolking * 0.02),
            energie: ["A", "B", "C"][Math.floor(Math.random() * 3)]
        });

    } catch (err) {

        console.log(err);

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
