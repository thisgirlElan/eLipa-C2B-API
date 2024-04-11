document
  .getElementById("paymentForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const fields = {};

    formData.forEach(function (value, key) {
      fields[key] = value;
    });

    // Define your fields
    fields.currency = "MWK"; // "ZMW" for Zambia;
    fields.reference = Math.random().toString(36).substring(7);
    fields.vid = "demo";

    // Sort the fields alphabetically by key
    const sortedFields = Object.keys(fields)
      .sort()
      .reduce((obj, key) => {
        obj[key] = fields[key];
        return obj;
      }, {});

    // Convert the sorted fields to a URL-encoded query string
    const dataString = new URLSearchParams(sortedFields).toString();

    const hashKey = 'demo';

    // Calculate the HMAC hash
    const hash = CryptoJS.HmacSHA256(dataString, hashKey).toString(
      CryptoJS.enc.Hex
    );

    // Add the hash to the fields
    fields.hash = hash;

    // Log the hash, data string, and payload
    console.log(
      `Hash: ${hash} ::: Data String: ${dataString} ::: Payload: ${JSON.stringify(
        fields
      )}`
    );

    const submitButton = document.getElementById("submitButton");
    submitButton.innerText = "Loading...";
    submitButton.disabled = true;

    // Send the payload to the server
    sendPayload(fields);
  });

function sendPayload(payload) {
  fetch("http://localhost:3000/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Server response:", data);
      const submitButton = document.getElementById("submitButton");
      if (data.status === 200 && data.text === "SUCCESS" && data.redirect_url) {
        // Redirect the user to the redirect_url
        window.location.href = data.redirect_url;
      } else {
        // Reset submit button text and enable it
        submitButton.innerText = "Submit";
        submitButton.disabled = false;
        // Handle other cases if needed
        alert("Payment was not successful");
      }
    })
    .catch((error) => {
      console.error("Error sending payload:", error);
      alert("Error sending payload: " + error.message);
      const submitButton = document.getElementById("submitButton");
      // Reset submit button text and enable it
      submitButton.innerText = "Submit";
      submitButton.disabled = false;
    });
}
