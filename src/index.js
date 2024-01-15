const express = require("express");
const https = require("follow-redirects").https;

const app = express();
const PORT = process.env.PORT || 3000; // Puedes cambiar el puerto según tu preferencia

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Bienvida");
  res.send("Bienvida");
});

app.route("/delivery").get(handleDeliveryReceipt).post(handleDeliveryReceipt);

function handleDeliveryReceipt(request, response) {
  const params = Object.assign(request.query, request.body);
  console.log("----------- ESTO ES DEL WEBHOOK ----------");
  console.log(params);

  // Acceder a los objetos anidados y mostrar sus valores
  if (params.results && params.results.length > 0) {
    const firstResult = params.results[0];

    if (firstResult.price) {
      console.log("Price:", firstResult.price);
    }

    if (firstResult.status) {
      console.log("Status:", firstResult.status);
    }

    if (firstResult.error) {
      console.log("Error:", firstResult.error);
    }
  }

  response.status(204).send();
}
app.post("/enviar-mensaje", (req, res) => {
  const options = {
    method: "POST",
    hostname: "xlmn2l.api.infobip.com",
    path: "/sms/2/text/advanced",
    headers: {
      Authorization:
        "App 839413fc853804d702ff26df6b1e180a-0439488c-c402-41b0-8a8d-09a73aa94ba1",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    maxRedirects: 20,
  };

  const apiRequest = https.request(options, (apiRes) => {
    const chunks = [];

    apiRes.on("data", (chunk) => {
      chunks.push(chunk);
    });

    apiRes.on("end", () => {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
      res.status(apiRes.statusCode).send(body.toString());
    });
  });

  apiRequest.on("error", (error) => {
    console.error(error);
    res.status(500).send("Internal Server Error");
  });

  const postData = JSON.stringify({
    messages: [
      {
        destinations: [{ to: "573202424924" }, { to: "573202424924" }],
        from: "ServiceSMS",
        text: "Hello,\n\nThis is a test message from Infobip. Have a nice day!",
      },
    ],
  });

  apiRequest.write(postData);
  apiRequest.end();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
