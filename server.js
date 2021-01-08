const express = require("express");
const bodyPaser = require("body-parser");
const axios = require("axios");
const parser = require("csv-parse");
const random = require('randomstring')
var cors = require("cors");
const app = express();

app.options("*", cors());
app.use(cors());
app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});





app.post("/", (req, res) => {
  let { url, select_fields } = req.body.csv;
  let validCsv = /\.csv$/.test(url);
  let json = [];
  let result;

  if (validCsv) {
    axios.get(`${url}`).then((response) => {
        parser(response.data, {}, (err, output) => {
          if (err) {
            console.log(err);
          }
          if (select_fields.length > 0) {
            output.map((data, i) => {
              json.push({
                [select_fields[0]]: data[0],
                [select_fields[1]]: data[1],
                [select_fields[2]]: data[2],
              });
            });
          } else {
            json = [...output];
          }
          const conversionKey = random.generate(30);
        result = {
          conversionKey,
          json,
        };
        res.send(result)
        });
        
      });

  } else {
    res.send("Upload a valid csv");
  }
});


app.listen(port, () => {
  console.log(`server started ${port} `);
});
