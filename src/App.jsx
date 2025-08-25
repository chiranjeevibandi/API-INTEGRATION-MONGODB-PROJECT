import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function WeatherApp() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({ loading: false, data: {}, error: false });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [savedData, setSavedData] = useState([]);

  const toDateFunction = () => {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const WeekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const currentDate = new Date();
    return `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
  };

  // Search weather from OpenWeather API
  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setWeather({ ...weather, loading: true, error: false });
      setSaveMsg('');

      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const api_key = 'f00c38e0279b7bc85480c3fe775d518c'; // move to backend later

      try {
        const res = await axios.get(url, {
          params: { q: input, units: 'metric', appid: api_key },
        });
        setWeather({ data: res.data, loading: false, error: false });
        setInput('');
      } catch (error) {
        console.error('API Error:', error);
        setWeather({ data: {}, loading: false, error: true });
        setInput('');
      }
    }
  };

  // Save weather to MongoDB
  const handleSave = async () => {
    if (!(weather.data && weather.data.main)) return;
    setSaving(true);
    setSaveMsg('');
    try {
      await axios.post('https://api-backend-fx9p.onrender.com/save-weather', {
        city: weather.data.name,
        weather: weather.data,
      });
      setSaveMsg('✅ Saved to database');
      fetchSavedData(); // refresh table
    } catch (err) {
      console.error('Failed to save weather:', err);
      setSaveMsg('❌ Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Fetch saved weather data from backend
  const fetchSavedData = async () => {
    try {
      const res = await axios.get('https://api-backend-fx9p.onrender.com/get-weather');
      setSavedData(res.data);
    } catch (err) {
      console.error('Failed to fetch saved data:', err);
    }
  };

  // Fetch saved data on mount
  useEffect(() => {
    fetchSavedData();
  }, []);

  return (
    <div className="App">
      <h1 className="app-name">Get Weather...</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter City Name..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={search}
        />
      </div>

      {weather.loading && <ClipLoader color="black" size={50} />}
      {weather.error && (
        <div>
          <FontAwesomeIcon icon={faFrown} /> City not found
        </div>
      )}

      {weather.data && weather.data.main && (
        <>
          <div>
            <h2>{weather.data.name}, {weather.data.sys.country}</h2>
            <div>{toDateFunction()}</div>
            <div>
              <img src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`} alt="icon" />
              {Math.round(weather.data.main.temp)}°C
            </div>
            <div>{weather.data.weather[0].description.toUpperCase()}</div>
            <div>Wind: {weather.data.wind.speed} m/s</div>
          </div>
          <button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Add to database'}
          </button>
          {saveMsg && <div>{saveMsg}</div>}
        </>
      )}

      <hr />
      <h2>Saved Weather Data</h2>
      {savedData.length > 0 ? (
        <table border="1" cellPadding="8" style={{ margin: "auto", marginTop: 16 }}>
          <thead>
            <tr>
              <th>City</th>
              <th>Temperature</th>
              <th>Description</th>
              <th>Wind Speed</th>
              <th>Saved At</th>
            </tr>
          </thead>
          <tbody>
            {savedData.map((item) => (
              <tr key={item._id}>
                <td>{item.city}</td>
                <td>{Math.round(item.tempC)} °C</td>
                <td>{item.description}</td>
                <td>{item.wind.speed} m/s</td>
                <td>{new Date(item.savedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <div>No data saved yet.</div>}
    </div>
  );
}

export default WeatherApp;
