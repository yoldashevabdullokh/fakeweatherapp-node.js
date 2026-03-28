const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const countries = [
  "Afghanistan","Albania","Algeria","Andorra","Angola",
  "Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus",
  "Belgium","Belize","Benin","Bhutan","Bolivia",
  "Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria",
  "Burkina Faso","Burundi","Cambodia","Cameroon","Canada",
  "Chile","China","Colombia","Costa Rica","Croatia",
  "Cuba","Cyprus","Czech Republic","Denmark","Egypt",
  "Estonia","Finland","France","Georgia","Germany",
  "Greece","Hungary","Iceland","India","Indonesia",
  "Iran","Iraq","Ireland","Israel","Italy",
  "Japan","Jordan","Kazakhstan","Kenya","Kuwait",
  "Kyrgyzstan","Latvia","Lithuania","Luxembourg","Malaysia",
  "Maldives","Mexico","Moldova","Monaco","Mongolia",
  "Montenegro","Morocco","Nepal","Netherlands","New Zealand",
  "Nigeria","North Korea","Norway","Oman","Pakistan",
  "Panama","Peru","Philippines","Poland","Portugal",
  "Qatar","Romania","Russia","Saudi Arabia","Serbia",
  "Singapore","Slovakia","Slovenia","South Africa","South Korea",
  "Spain","Sri Lanka","Sweden","Switzerland","Syria",
  "Tajikistan","Thailand","Turkey","Turkmenistan","Ukraine",
  "United Arab Emirates","United Kingdom","United States","Uruguay",
  "Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

const weatherTypes = ["sunny", "cloud", "rain", "storm", "snow", "fog", "windy"];

/* ========= 1. Har bir davlatga bittadan weather biriktiramiz ========= */
const data = countries.map((country, index) => {
  const status = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  let temp;

  if (status === "snow") {
    temp = +(Math.random() * 12 - 10).toFixed(1); // -10 dan +2 gacha
  } else if (status === "sunny") {
    temp = +(Math.random() * 20 + 20).toFixed(1); // 20 dan 40 gacha
  } else if (status === "rain" || status === "storm") {
    temp = +(Math.random() * 15 + 5).toFixed(1); // 5 dan 20 gacha
  } else if (status === "fog") {
    temp = +(Math.random() * 10).toFixed(1); // 0 dan 10 gacha
  } else if (status === "windy") {
    temp = +(Math.random() * 10 + 15).toFixed(1); // 15 dan 25 gacha (iliq/shamol)
  } else {
    temp = +(Math.random() * 15 + 10).toFixed(1); // 10 dan 25 gacha
  }

  return {
    id: index + 1,
    name: country,
    temp,
    status,
    sana: new Date().toLocaleDateString(),
  };
});

/* ========= 2. API ========= */
app.get("/weather", (req, res) => {
  const q = req.query.name;

  // Agar qidiruv bo'lmasa – hamma davlat
  if (!q || q.trim() === "") {
    return res.json(data);
  }

  // Qidiruv bo'lsa – o'xshash barcha davlatlar
  const result = data.filter((item) =>
    item.name.toLowerCase().includes(q.toLowerCase())
  );

  if (result.length === 0) {
    return res.status(404).json({ message: "Davlat topilmadi" });
  }

  res.json(result);
});

app.listen(3001, () => {
  console.log("Server 3001-portda ishlamoqda...");
});