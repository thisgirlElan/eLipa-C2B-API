const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const tzGateway =
  "https://api-uat.elipa.co.tz/payin/session/create/tz";

app.use(cors());
app.use(bodyParser.json());

app.post("/payment", async (req, res) => {
   console.log("req::",JSON.stringify(req.body));
  try {
    const response = await fetch(tzGateway, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const contentType = response.headers.get("Content-Type");

    console.log("here");

    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();
      console.log("then here");

      res.json(responseData);
    } else {
      const text = await response.text(); // fallback: read HTML or error
      console.error("Unexpected response:", text);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
