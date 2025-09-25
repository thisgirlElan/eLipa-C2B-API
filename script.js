document.getElementById("pgwButton").addEventListener("click", () => handleSubmit("gateway"));
document.getElementById("vaButton").addEventListener("click", () => handleSubmit("virtualAccount"));

function handleSubmit(mode) {
  const form = document.getElementById("paymentForm");
  const formData = new FormData(form);
  const fields = {};

  formData.forEach((value, key) => {
    fields[key] = value;
  });

  fields.currency = "NGN";
  fields.reference = Math.random().toString(36).substring(2, 10);
  fields.vid = "demo";

  const sortedFields = Object.keys(fields).sort().reduce((obj, key) => {
    obj[key] = fields[key];
    return obj;
  }, {});

  const dataString = new URLSearchParams(sortedFields).toString();
  const hashKey = "ipaykey"; // Replace with real key in production
  fields.hash = CryptoJS.HmacSHA256(dataString, hashKey).toString(CryptoJS.enc.Hex);

  console.log("datastring:::", dataString);

  const pgwButton = document.getElementById("pgwButton");
  const vaButton = document.getElementById("vaButton");

  if (mode === "virtualAccount") {
    vaButton.innerText = "Loading VA...";
    vaButton.disabled = true;
  } else {
    pgwButton.innerText = "Redirecting...";
    pgwButton.disabled = true;
  }

  fetch("http://localhost:3000/payment", {
    method: "POST",
    headers: { 
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(fields),
  })
    .then((response) => response.json())
    .then((data) => {
      if (mode === "gateway") {
        // console.log("data", console.log("data", JSON.stringify(data, null, 2)));
        
        if (data.status === 200 && data.text === "SUCCESS" && data.redirect_url) {
          window.location.href = data.redirect_url;
        } else {
          pgwButton.innerText = "Pay with Gateway";
          pgwButton.disabled = false;
          alert("An error occurred: " + data.errormessage);
        }
      } else if (mode === "virtualAccount") {
        if (data.status === 200 && data.text === "SUCCESS" && data.sid) {
          initiateBankTransfer(data.sid, fields.vid, hashKey);
        } else {
          vaButton.innerText = "Pay with Virtual Account";
          vaButton.disabled = false;
          alert("An error occurred: " + data.errormessage);
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      pgwButton.innerText = "Pay with Gateway";
      pgwButton.disabled = false;
      vaButton.innerText = "Pay with Virtual Account";
      vaButton.disabled = false;
      alert("An error occurred: " + error.message);
    });
}

function initiateBankTransfer(sid, vid, hashKey) {
  const fields = { sid, vid };
  const sortedFields = Object.keys(fields).sort().reduce((obj, key) => {
    obj[key] = fields[key];
    return obj;
  }, {});

  const dataString = new URLSearchParams(sortedFields).toString();
  fields.hash = CryptoJS.HmacSHA256(dataString, hashKey).toString(CryptoJS.enc.Hex);

  fetch("http://localhost:3000/banktransfer", {
    method: "POST",
    headers: { 
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(fields),
  })
    .then((response) => response.json())
    .then((data) => {
      const vaButton = document.getElementById("vaButton");
      console.log("data: ", data);
      

      if (data.status === 200 && data.text === "SUCCESS" && data.result) {
        const result = data.result;
        console.log("result::::", result);
        document.getElementById("va-account-name").textContent = result.account_name;
        document.getElementById("va-bank-name").textContent = result.bank_name;
        document.getElementById("va-account-number").textContent = result.account_number;
        document.getElementById("va-amount").textContent = result.amount;
        document.getElementById("va-modal").classList.remove("hidden");
      } else {
        alert("Could not retrieve virtual account details: " +  data.errormessage);
      }

      vaButton.innerText = "Pay with Virtual Account";
      vaButton.disabled = false;
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error retrieving virtual account: " + error.message);
      const vaButton = document.getElementById("vaButton");
      vaButton.innerText = "Pay with Virtual Account";
      vaButton.disabled = false;
    });
}

function closeVAModal() {
  document.getElementById("va-modal").classList.add("hidden");
}

function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  }).catch((err) => {
    console.error("Failed to copy text: ", err);
  });
}