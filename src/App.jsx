// import React, { useState } from 'react';
// import axios from 'axios';
// import { ClipLoader } from 'react-spinners';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFrown } from '@fortawesome/free-solid-svg-icons';
// import './App.css';

// function WeatherApp() {
//   const [input, setInput] = useState('');
//   const [weather, setWeather] = useState({ loading: false, data: {}, error: false });
//   const [saving, setSaving] = useState(false);
//   const [saveMsg, setSaveMsg] = useState('');
//   const [savedData, setSavedData] = useState([]);
//   const [isButtonClicked, setIsButtonClicked] = useState(false); // ✅ track button click

//   const toDateFunction = () => {
//     const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
//     const WeekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
//     const currentDate = new Date();
//     return `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
//   };

//   // Searching weather from OpenWeather API
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

//   // Save weather to MongoDB
//   const handleSave = async () => {
//     if (!(weather.data && weather.data.main)) return;
//     setSaving(true);
//     setSaveMsg('');
//     try {
//       await axios.post('https://api-backend-fx9p.onrender.com/save-weather', {
//         city: weather.data.name,
//         weather: weather.data,
//       });
//       setSaveMsg('✅ Saved to database');
//       // fetchSavedData(); 
//     } catch (err) {
//       console.error('Failed to save weather:', err);
//       setSaveMsg('❌ Failed to save');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Fetching saved weather data from backend
//   const fetchSavedData = async () => {
//     setIsButtonClicked(true); // ✅ mark button clicked
//     try {
//       const res = await axios.get('https://api-backend-fx9p.onrender.com/get-weather');
//       setSavedData(res.data);
//     } catch (err) {
//       console.error('Failed to fetch saved data:', err);
//       setSavedData([]); // keep empty on error
//     }
//   };

//   return (
//     <div className="App">
//       <h1 className="app-name">Get Weather...</h1>

//       <div className="search-bar">
//         <input
//           className="search"
//           type="text"
//           placeholder="Enter City Name..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={search}
//         />
//       </div>

//       {weather.loading && <ClipLoader color="black" size={50} />}
//       {weather.error && (
//         <div>
//           <FontAwesomeIcon icon={faFrown} /> City not found
//         </div>
//       )}

//       {weather.data && weather.data.main && (
//         <>
//           <div>
//             <h2>{weather.data.name}, {weather.data.sys.country}</h2>
//             <div>{toDateFunction()}</div>
//             <div>
//               <img src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`} alt="icon" />
//               {Math.round(weather.data.main.temp)}°C
//             </div>
//             <div>{weather.data.weather[0].description.toUpperCase()}</div>
//             <div>Wind: {weather.data.wind.speed} m/s</div>
//           </div>
//           <button onClick={handleSave} disabled={saving}>
//             {saving ? 'Saving…' : 'Add to database'}
//           </button>
//           {saveMsg && <div>{saveMsg}</div>}
//         </>
//       )}

//       <hr />

//       <button onClick={fetchSavedData} style={{ marginBottom: 16 }}>
//         📊 Load Saved Data
//       </button>

//       {/* ✅ only show after button clicked */}
//       {isButtonClicked && (
//         savedData.length > 0 ? (
//           <table border="1" cellPadding="8" style={{ margin: "auto", marginTop: 16 }}>
//             <thead>
//               <tr>
//                 <th>City</th>
//                 <th>Temperature</th>
//                 <th>Description</th>
//                 <th>Wind Speed</th>
//                 <th>Saved At</th>
//               </tr>
//             </thead>
//             <tbody>
//               {savedData.map((item) => (
//                 <tr key={item._id}>
//                   <td>{item.city}</td>
//                   <td>{Math.round(item.tempC)} °C</td>
//                   <td>{item.description}</td>
//                   <td>{item.wind.speed} m/s</td>
//                   <td>{new Date(item.savedAt).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <div style={{ marginTop: 16, color: "red", fontWeight: "bold" }}>
//             ❌ No saved data
//           </div>
//         )
//       )}
//     </div>
//   );
// }

// export default WeatherApp;



import React, { useState } from 'react';
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
  // const [isButtonClicked, setIsButtonClicked] = useState(false); // ✅ track button click
  const [showSavedData, setShowSavedData] = useState(false);
    const [savedData, setSavedData] = useState([]);
  const [editingId, setEditingId] = useState(null); // id of record currently editing
  const [editDescription, setEditDescription] = useState("");
  const toDateFunction = () => {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const WeekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const currentDate = new Date();
    return `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
  };

  // Searching weather from OpenWeather API
  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setWeather({ ...weather, loading: true, error: false });
      setSaveMsg('');

      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const api_key = 'f00c38e0279b7bc85480c3fe775d518c'; 

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
      // await axios.post('https://api-backend-fx9p.onrender.com/save-weather', {
      await axios.post('https://weather-data-tracker-backend.onrender.com/save-weather', {
      // await axios.post('http://localhost:4444/save-weather', {
        city: weather.data.name,
        weather: weather.data,
      });
      setSaveMsg('✅ Saved to database');
      // fetchSavedData(); 
    } catch (err) {
      console.error('Failed to save weather:', err);
      setSaveMsg('❌ Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Fetching saved weather data from backend
  const fetchSavedData = async () => {
    setShowSavedData(true); // ✅ mark button clicked
      if (!showSavedData) {
    // We are about to show data, so fetch it
    try {
      const res = await axios.get("https://weather-data-tracker-backend.onrender.com/get-weather");
      setSavedData(res.data);
      setShowSavedData(true);
    } catch (err) {
      console.error("Failed to fetch saved data:", err);
      setSavedData([]);
      setShowSavedData(false);
    }
  } else {
    // If already showing, hide the data
    setShowSavedData(false);
  }
  };


  const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

  try {
    await axios.delete(`https://weather-data-tracker-backend.onrender.com/delete-weather/${id}`);
    setSavedData(savedData.filter(item => item._id !== id));
  } catch (err) {
    console.error("Failed to delete:", err);
    alert("Failed to delete record.");
  }
};
 // Start editing a record
  const startEditing = (id, currentDescription) => {
    setEditingId(id);
    setEditDescription(currentDescription);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditDescription("");
  };

  // Save updated record (PATCH)
  const handleUpdate = async (id) => {
    try {
      await axios.patch(`https://weather-data-tracker-backend.onrender.com/update-weather/${id}`, {
        description: editDescription,
      });
      // Update UI
      setSavedData(savedData.map(item => 
        item._id === id ? { ...item, description: editDescription } : item
      ));
      cancelEditing();
    } catch (err) {
      console.error("Failed to update:", err);
      alert("Failed to update record.");
    }
  };


  

  return (
    <div className="App">
      <h1 className="app-name">Get Weather...</h1>

      <div className="search-bar">
        <input
          className="search"
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
            <h2>
              {weather.data.name}, {weather.data.sys.country}
            </h2>
            <div>{toDateFunction()}</div>
            <div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                alt="icon"
              />
              {Math.round(weather.data.main.temp)}°C
            </div>
            <div>{weather.data.weather[0].description.toUpperCase()}</div>
            <div>Wind: {weather.data.wind.speed} m/s</div>
          </div>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Add to database"}
          </button>
          {saveMsg && <div>{saveMsg}</div>}
        </>
      )}

      <hr />

      <button onClick={fetchSavedData} style={{ marginBottom: 16 }}>
        {showSavedData ? "Hide Saved Data" : "📊 Load Saved Data"}
      </button>

      {showSavedData &&
        (savedData.length > 0 ? (
          <table border="1" cellPadding="8" style={{ margin: "auto", marginTop: 16 }}>
            <thead>
              <tr>
                <th>City</th>
                <th>Temperature</th>
                <th>Description</th>
                <th>Wind Speed</th>
                <th>Saved At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {savedData.map((item) => (
                <tr key={item._id}>
                  <td>{item.city}</td>
                  <td>{Math.round(item.tempC)} °C</td>
                  <td>
                    {editingId === item._id ? (
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                    ) : (
                      item.description
                    )}
                  </td>
                  <td>{item.wind.speed} m/s</td>
                  <td>{new Date(item.savedAt).toLocaleString()}</td>
                  <td>
                    {editingId === item._id ? (
                      <>
                        <button onClick={() => handleUpdate(item._id)}>Save</button>{" "}
                        <button onClick={cancelEditing}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(item._id, item.description)}
                          style={{ color: "white", backgroundColor: "blue", border: "none", padding: "4px 8px", cursor: "pointer", margin:"5px" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          style={{ color: "white", backgroundColor: "red", border: "none", padding: "4px 8px", cursor: "pointer", margin:"5px" }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ marginTop: 16, color: "red", fontWeight: "bold" }}>
            ❌ No saved data
          </div>
        ))}
    </div>
  );
}

export default WeatherApp;
