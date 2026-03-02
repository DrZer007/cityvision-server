const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/gemeente", async (req, res) => {

    const city = req.query.city || "Rotterdam";

    // Simulatie met realistische NL cijfers (stabiel)
    const data = {
        Amsterdam: { bevolking: 921402 },
        Rotterdam: { bevolking: 655468 },
        Utrecht: { bevolking: 361924 },
        DenHaag: { bevolking: 562839 },
        Eindhoven: { bevolking: 244780 }
    };

    let bevolking = data[city]?.bevolking || 150000;

    res.json({
        city,
        bevolking: bevolking,
        woningen: Math.round(bevolking * 0.45),
        mobiliteit: Math.round(bevolking * 0.6),
        veiligheid: Math.round(bevolking * 0.02),
        energie: ["A", "B", "C"][Math.floor(Math.random() * 3)]
    });

});

app.listen(10000, () => {
    console.log("Server running");
});
