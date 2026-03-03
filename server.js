const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

let gemeentenData = {};

async function loadCBSData() {
    try {
        const response = await fetch(
            "https://opendata.cbs.nl/ODataApi/odata/84583NED/TypedDataSet?$format=json"
        );
        const json = await response.json();

        json.value.forEach(row => {
            if (row.RegioS && row.Bevolking_1) {
                gemeentenData[row.RegioS.toLowerCase()] = row.Bevolking_1;
            }
        });

        console.log("CBS data geladen");
    } catch (err) {
        console.log("CBS laden mislukt:", err.message);
    }
}

app.get("/api/gemeente", async (req, res) => {

    const city = (req.query.city || "Rotterdam").toLowerCase();

    let bevolking = gemeentenData[city] || 150000;

    res.json({
        city,
        bevolking,
        woningen: Math.round(bevolking * 0.45),
        mobiliteit: Math.round(bevolking * 0.6),
        veiligheid: Math.round(bevolking * 0.02),
        energie: ["A", "B", "C"][Math.floor(Math.random() * 3)]
    });
});

app.listen(10000, async () => {
    console.log("Server running");
    await loadCBSData();
});
