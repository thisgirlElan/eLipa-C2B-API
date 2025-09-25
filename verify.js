const crypto = require("crypto");

const ipayKey = "ipaykey";

const contentString = `{
  "amount":100,
  "channel":"BANKTRANSFERNGH",
  "channeltype":"COLLECTIONS",
  "code":"REF58F3VEVM41757338247835",
  "commission":3.5,
  "country":"NG",
  "currency":"NGN",
  "datetime":"2025-09-08 13:30:49 UTC",
  "elipa_reference":"sm52demo3170d175733813094727990",
  "expected_amount":100,
  "firstname":"Test",
  "lastname":"Account",
  "message":"SUCCESS",
  "phone":"",
  "reference":"CU111921757338129915",
  "status":"SUCCESS",
  "vat":0.26,
  "vid":"demo"
}`;

const content = JSON.parse(contentString);

const sortedKeys = Object.keys(content).sort();

const urlEncodedString = sortedKeys
  .map((key) => {
    return `${key}=${encodeURIComponent(String(content[key]).trim()).replace(
      /%20/g,
      "+"
    )}`;
  })
  .join("&");

console.log("--- String ---\n", urlEncodedString, "\n");

const hashEncoded = crypto
  .createHmac("sha256", ipayKey)
  .update(urlEncodedString)
  .digest("hex");

console.log("Hash: ", hashEncoded);

const receivedSignature =
  "5e7beb168d9f29057609b07a485593b20dc963008c2c7f7ddb695138b522e25b";

try {
  const valid = crypto.timingSafeEqual(
    Buffer.from(hashEncoded, "hex"),
    Buffer.from(receivedSignature, "hex")
  );

  if (valid) {
    console.log("Signature verified. Payload is authentic.");
  } else {
    console.log("Signature mismatch. Rejecting payload.");
  }
} catch (err) {
  console.log("Invalid signature format or length.");
}
