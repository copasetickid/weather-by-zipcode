var path = require("path"),
    express = require("express"),
    zipdb = require("zippity-do-dah"),
    ForecastIo = require("forecastio");

var app = express();
var weather = new ForecastIo("6ea0bbb684dad6b280c4e67e3c551eb0");

app.use(express.static(path.resolve(__dirname, "public")));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("index");
});

app.get(/^\/(\d{5})$/, function(req, res, next) {
  var zipcode = req.params[0];
  var location = zipdb.zipcode(zipcode);
  if(!location.zipcode) {
    next();
    return;
  }

  var latitude = location.latitude,
      longitude = location.longitude;

  weather.forecast(latitude, longitude, function(err, data) {
    if(err) {
      next();
      return;
    }

    res.json({ zipcode: zipcode, temperature: data.currently.temperature});
  });
});

app.use(function(req, res) {
  res.status(404).render("404");
});

app.listen(3000);
