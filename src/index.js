const express = require("express");
const https = require("follow-redirects").https;

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
  console.log("Bienvenido");
  res.send("Bienvenido");
});

app.post("/send-sms", (req, res) => {
  const { to, message } = req.body;

  const options = {
    hostname: "xlmn2l.api.infobip.com",
    path: "/sms/2/text/advanced",
    method: "POST",
    headers: {
      Authorization:
        "App 839413fc853804d702ff26df6b1e180a-0439488c-c402-41b0-8a8d-09a73aa94ba1",
      "Content-Type": "application/json",
    },
  };

  const infobipRequest = https.request(options, (infobipRes) => {
    let chunks = [];

    infobipRes.on("data", (chunk) => {
      chunks.push(chunk);
    });

    infobipRes.on("end", () => {
      let body = Buffer.concat(chunks);
      console.log(body.toString());
      res.send("SMS sent!");
    });
  });

  const data = JSON.stringify({
    messages: [
      {
        to: to,
        from: "ServiceSMS",
        text: message,
      },
    ],
  });

  infobipRequest.write(data);

  infobipRequest.end();
});

app.listen(PORT, () => {
  console.log("SMS API listening on port 3000");
});
