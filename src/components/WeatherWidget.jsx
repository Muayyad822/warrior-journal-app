import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
      },
      (err) => {
        // Default to a general location or show error if location access denied
        console.error("Location access denied or error:", err);
        setError('Location access needed for local weather.');
        setLoading(false);
      }
    );
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      // Using wttr.in for simple JSON weather data without API key
      const response = await fetch(`https://wttr.in/${lat},${lon}?format=j1`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      const current = data.current_condition[0];
      const area = data.nearest_area[0];

      setWeather({
        temp: current.temp_C,
        desc: current.weatherDesc[0].value,
        humidity: current.humidity,
        feelsLike: current.FeelsLikeC,
        location: area.areaName[0].value
      });
    } catch (err) {
      setError('Could not load weather data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (desc) => {
    const d = desc.toLowerCase();
    if (d.includes('sun') || d.includes('clear')) return <Sun className="w-8 h-8 text-yellow-500" />;
    if (d.includes('rain') || d.includes('drizzle')) return <CloudRain className="w-8 h-8 text-blue-400" />;
    if (d.includes('cloud') || d.includes('overcast')) return <Cloud className="w-8 h-8 text-gray-400" />;
    if (d.includes('wind')) return <Wind className="w-8 h-8 text-gray-500" />;
    return <Sun className="w-8 h-8 text-yellow-500" />;
  };

  const getHealthTip = (temp) => {
    const t = parseInt(temp);
    if (t < 15) return "It's cold! Keep warm to prevent crises. Wear layers.";
    if (t > 30) return "It's hot! Stay hydrated and seek shade.";
    return "Great weather! Maintain your routine.";
  };

  if (loading) return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-48">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-48 text-gray-500">
      <Cloud className="w-10 h-10 mb-2 opacity-50" />
      <p>{error}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative overflow-hidden">
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-500" />
            Local Weather
          </h2>
          <p className="text-sm text-gray-500 mt-1">{weather.location}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-800">{weather.temp}°C</div>
          <div className="text-sm text-gray-500 capitalize">{weather.desc}</div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {getWeatherIcon(weather.desc)}
          <div className="flex flex-col">
             <span className="text-xs text-gray-500 flex items-center gap-1">
               <Droplets className="w-3 h-3" /> Humidity: {weather.humidity}%
             </span>
             <span className="text-xs text-gray-500 flex items-center gap-1">
               <Thermometer className="w-3 h-3" /> Feels like: {weather.feelsLike}°C
             </span>
          </div>
        </div>
      </div>

      <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
        parseInt(weather.temp) < 15 ? 'bg-red-50 text-red-700' : 
        parseInt(weather.temp) > 30 ? 'bg-orange-50 text-orange-700' : 
        'bg-green-50 text-green-700'
      }`}>
        Running Tip: {getHealthTip(weather.temp)}
      </div>
    </div>
  );
};

export default WeatherWidget;
