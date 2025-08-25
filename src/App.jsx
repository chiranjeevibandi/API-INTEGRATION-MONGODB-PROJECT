// import React, { useState } from 'react';
// import axios from 'axios';
// import { ClipLoader } from 'react-spinners';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFrown } from '@fortawesome/free-solid-svg-icons';
// import './App.css';

// function WeatherApp() {
//   const [input, setInput] = useState('');
//   const [weather, setWeather] = useState({
//     loading: false,
//     data: {},
//     error: false,
//   });
//   const [saving, setSaving] = useState(false);
//   const [saveMsg, setSaveMsg] = useState('');
//   const [savedData, setSavedData] = useState([]); // NEW state for fetched DB data

//   const toDateFunction = () => {
//     const months = ['January','February','March','April','May','June',
//       'July','August','September','October','November','December'];
//     const WeekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
//     const currentDate = new Date();
//     return `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
//   };

//   const search = async (event) => {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       setWeather({ ...weather, loading: true, error: false });
//       setSaveMsg('');

//       const url = 'https://api.openweathermap.org/data/2.5/weather';
//       const api_key = 'f00c38e0279b7bc85480c3fe775d518c';

//       try {
//         const res = await axios.get(url, {
//           params: { q: input, units: 'metric', appid: api_key },
//         });

//         setWeather({ data: res.data, loading: false, error: false });
//         setInput('');
//       } catch (error) {
//         console.error('API Error:', error);
//         setWeather({ data: {}, loading: false, error: true });
//         setInput('');
//       }
//     }
//   };

//   const handleSave = async () => {
//     if (!(weather.data && weather.data.main)) return;

//     setSaving(true);
//     setSaveMsg('');
//     try {
//       await axios.post('http://localhost:5555/save-weather', {
//         city: weather.data.name,
//         weather: weather.data,
//       });
//       setSaveMsg('✅ Saved to database');
//     } catch (err) {
//       console.error('Failed to save weather:', err);
//       setSaveMsg('❌ Failed to save');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Fetch saved weather data
//   const fetchSavedData = async () => {
//     try {
//       const res = await axios.get('http://localhost:5555/get-weather');
//       setSavedData(res.data);
//     } catch (err) {
//       console.error('Failed to fetch saved data:', err);
//     }
//   };

//   return (
//     <div className="App">
//       <h1 className="app-name">Get Weather...</h1>

//       <div className="search-bar">
//         <input
//           type="text"
//           className="city-search"
//           placeholder="Enter City Name..."
//           value={input}
//           onChange={(event) => setInput(event.target.value)}
//           onKeyDown={search}
//         />
//       </div>

//       {weather.loading && (
//         <div className="loader">
//           <ClipLoader color="black" size={50} />
//         </div>
//       )}

//       {weather.error && (
//         <div className="error">
//           <FontAwesomeIcon icon={faFrown} />{' '}
//           <span style={{ fontSize: '20px' }}>City not found</span>
//         </div>
//       )}

//       {weather.data && weather.data.main && (
//         <>
//           <div className="weather-result">
//             <div className="city-name">
//               <h2>
//                 {weather.data.name}, <span>{weather.data.sys.country}</span>
//               </h2>
//             </div>
//             <div className="date">{toDateFunction()}</div>
//             <div className="icon-temp">
//               <img
//                 src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
//                 alt={weather.data.weather[0].description}
//               />
//               {Math.round(weather.data.main.temp)}
//               <sup className="deg">°C</sup>
//             </div>
//             <div className="des-wind">
//               <p>{weather.data.weather[0].description.toUpperCase()}</p>
//               <p>Wind Speed: {weather.data.wind.speed} m/s</p>
//             </div>
//           </div>

//           <button onClick={handleSave} disabled={saving} style={{ marginTop: 16 }}>
//             {saving ? 'Saving…' : 'Add to database'}
//           </button>
//           {saveMsg && <div style={{ marginTop: 8 }}>{saveMsg}</div>}
//         </>
//       )}

//       <hr />

//       <button onClick={fetchSavedData} style={{ marginBottom: 16 }}>
//         📊 Show Saved Data
//       </button>

//       {savedData.length > 0 && (
//         <table border="1" cellPadding="8" style={{ margin: 'auto', marginTop: 16 }}>
//           <thead>
//             <tr>
//               <th>City</th>
//               <th>Temp (°C)</th>
//               <th>Description</th>
//               <th>Wind</th>
//               <th>Date Saved</th>
//             </tr>
//           </thead>
//           <tbody>
//             {savedData.map((item, index) => (
//               <tr key={index}>
//                 <td>{item.city}</td>
//                 <td>{Math.round(item.weather.main.temp)}</td>
//                 <td>{item.weather.weather[0].description}</td>
//                 <td>{item.weather.wind.speed} m/s</td>
//                 <td>{new Date(item.date).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
// export default WeatherApp;
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
      await axios.post('http://localhost:5555/save-weather', {
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
      const res = await axios.get('http://localhost:5555/get-weather');
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
              <th>Temp (°C)</th>
              <th>Description</th>
              <th>Wind</th>
              <th>Saved At</th>
            </tr>
          </thead>
          <tbody>
            {savedData.map((item) => (
              <tr key={item._id}>
                <td>{item.city}</td>
                <td>{Math.round(item.tempC)}</td>
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
