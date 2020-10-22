const path = require("path");
const express = require("express");
// eslint-disable-next-line import/no-unresolved
const app = require("./public/App.js");

const server = express();

server.use(express.static(path.join(__dirname, "public")));

server.get("*", (req, res) => {
	const { html } = app.render({ url: req.url });

	res.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />
        <link rel='stylesheet' href='/global.css'>
        <link rel='stylesheet' href='/bundle.css'>
      </head>
      <body>
        <div id="app">${html}</div>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `);

	res.end();
});

const port = 3000;
// eslint-disable-next-line no-console
server.listen(port, () => console.log(`Listening on port ${port}`));
