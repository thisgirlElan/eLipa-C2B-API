const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const nigeriaGateway =
  "https://apis.elipa.global/payments/v2/payin/session/create/ng";
const bankTransfer =
  "https://apis.elipa.global/payments/v2/payin/mobilebanking/initiate/ng/banktransferngh";


app.use(cors());
app.use(bodyParser.json());

app.post("/payment", async (req, res) => {
  console.log("request:::", req.body);
  
  try {
    const response = await fetch(nigeriaGateway, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const responseData = await response.json();

    res.json(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/banktransfer", async (req, res) => {
  try {
    const response = await fetch(bankTransfer, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const responseData = await response.json();

    res.json(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
