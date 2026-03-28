import React, { useState, useEffect } from "react";
import "./App.css";

const backgrounds = {
  sunny: "https://images.unsplash.com/photo-1506452819137-0422416856b8",
  cloud: "https://images.unsplash.com/photo-1534088568595-a066f710b81f",
  rain: "https://images.unsplash.com/photo-1512511708753-3150cd2ec8ee",
  storm: "https://images.unsplash.com/photo-1511289081-d06dea19014b",
  snow: "https://images.unsplash.com/photo-1491002299891-2210d3483f3e",
  fog: "https://images.unsplash.com/photo-1485236715598-c8879a098917",
  windy: "https://images.unsplash.com/photo-1505672678657-cc7037095e60",
  default: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b"
};

const weatherIcons = {
  sunny: "☀️",
  cloud: "☁️",
  rain: "🌧️",
  storm: "⛈️",
  snow: "❄️",
  fog: "🌫️",
  windy: "💨"
};

const getAdvice = (status, temp) => {
  let advice = "";

  if (status === "sunny") advice = "Quyoshli havo! Ko'chaga chiqish uchun qulay vaqt. Ko'zoynak va spf kremi olishni unutmang.";
  else if (status === "cloud") advice = "Bulutli havo. Kayfiyatni tushirmang, sayr qilish uchun juda qulay ob-havo.";
  else if (status === "rain") advice = "Yomg'irli havo. O'zingiz bilan soyabon oling va issiqroq kiyinib chiqing.";
  else if (status === "storm") advice = "Momaqaldiroq bo'lishi kutilmoqda. Uyda qolganingiz ma'qul. Elektr jihozlarini o'chirib qo'ying.";
  else if (status === "snow") advice = "Qor yog'moqda. Tashqarida sovuq, qalin kiyim va issiq choy tavsiya etiladi!";
  else if (status === "fog") advice = "Tumanli havo. Haydovchilarga o'ta ehtiyot bo'lishni va chiroqlarni yoqishni maslahat beramiz.";
  else if (status === "windy") advice = "Shamoli havo. Yengilroq kiyinib, sayr qilish uchun iliq va yoqimli havo.";

  if (temp > 30) advice += " Shuningdek, havo juda issiq, ko'proq suv ichishni unutmang.";
  else if (temp < 5) advice += " Havo juda sovuq, ehtiyot bo'ling va qalinroq kiyining.";

  return advice;
};

function App() {
  const [inputVal, setInputVal] = useState("");
  const [list, setList] = useState([]);
  const [bgImage, setBgImage] = useState(backgrounds.default);
  const [loading, setLoading] = useState(false);

  const fetchWeather = (name = "") => {
    setLoading(true);
    fetch(`http://localhost:3001/weather?name=${name}`)
      .then((res) => {
        if (!res.ok) throw new Error("Topilmadi");
        return res.json();
      })
      .then((data) => {
        setList(Array.isArray(data) ? data : [data]);
        if (data.length > 0 || !Array.isArray(data)) {
          const firstItem = Array.isArray(data) ? data[0] : data;
          setBgImage(backgrounds[firstItem.status] || backgrounds.default);
        }
      })
      .catch(() => {
        setList([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (inputVal.trim() === "") {
      setList([]);
      setBgImage(backgrounds.default);
      return;
    }

    const timer = setTimeout(() => {
      fetchWeather(inputVal);
    }, 300); // debounce
    return () => clearTimeout(timer);
  }, [inputVal]);

  return (
    <div className="app-main" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="content">
        <h1>Fake Weather App</h1>

        <div className="search-box">
          <input
            type="text"
            placeholder="Davlat nomini yozing..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
        </div>

        {loading && <p>Yuklanmoqda...</p>}

        <div className="cards-box">
          {list.length > 0 ? (
            list.map((item) => (
              <div key={item.id} className="card">
                <h3>{item.name}</h3>
                <span className="temp">{item.temp}°C</span>
                <span className="status">
                  <span className="status-icon">{weatherIcons[item.status]}</span>
                  {item.status}
                </span>
                <div className="advice-box">
                  <strong>Maslahat:</strong> {getAdvice(item.status, item.temp)}
                </div>
                <span className="date">Sana: {item.sana}</span>
              </div>
            ))
          ) : (
            !loading && inputVal.trim() !== "" && <p className="no-results">Ma'lumot topilmadi</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
