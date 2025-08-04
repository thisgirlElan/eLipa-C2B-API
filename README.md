# eLipa-C2B-API

Sample REST API integration

## 👔 Features include:

- An interface for the user to key in details.
- Payment gateway payment option
- Virtual Account payment option

## 📋 App Preview

- The first screen allows the user to input their details and choose mode of payment i.e by generating a virtual account or paying via the eLipa Gateway.

<img width="70%" height="50%" alt="Screenshot 2025-08-04 235636" src="https://github.com/user-attachments/assets/48f2dd4b-40c0-45b6-8ce2-f1da00ebaff0" />


- The payment gateway screen offers the user the channel(s) they could opt to complete payment with and the necessary steps to complete payment.
  
<img width="70%" height="50%" alt="PGW Channels" src="https://github.com/user-attachments/assets/ec068b8b-d598-4bb7-9f94-d0fd5b24af31" />

<img width="70%" height="50%" alt="PGW Steps" src="https://github.com/user-attachments/assets/25270ae3-7c6b-4879-a323-6f7b6a986afd" />


- For virtual account payment, they simply generate the account and use the details to make payment. (You might need to customize a guide for clients to complete payment)
  
<img width="70%" height="50%" alt="virtual account" src="https://github.com/user-attachments/assets/cc89e0af-0644-405f-9c35-91b0e89c8b58" />



Clone this repo:
```
git clone https://github.com/thisgirlElan/eLipa-C2B-API.git
```

Import dependencies 
- With npm
```
npm install
```

Start express server
- With node
```
node express.js
```

When the server is up and running, open the `index.html` file on your browser.

### Good to Know
- The integration uses a simple HTML form for user input
- Scripting has been done with JS to fetch and send data to the server for rendering.
- Express.js has been utilized for server side rendering.

## 👨‍💻 You're ready! Make it yours. 

- Tinker and develop!!🎉


