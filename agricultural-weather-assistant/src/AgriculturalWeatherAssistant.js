import { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, ThermometerSun, Sprout, TrendingUp, Upload, AlertTriangle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OldAgriculturalWeatherAssistant = () => {
  const [view, setView] = useState('dashboard');
  const [insights, setInsights] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState('none');

  // Sample weather data as fallback
  const sampleData = [
    { date: '2025-11-01', Temperature: 51, Humidity: 62.7, Precip: 2.3, 'Wind Speed': 6 },
    { date: '2025-11-02', Temperature: 52.7, Humidity: 62.8, Precip: 0.0, 'Wind Speed': 10 },
    { date: '2025-11-03', Temperature: 52.8, Humidity: 67.9, Precip: 0.5, 'Wind Speed': 10 },
    { date: '2025-11-04', Temperature: 55.2, Humidity: 49.3, Precip: 8.2, 'Wind Speed': 10 },
    { date: '2025-11-05', Temperature: 58.3, Humidity: 57.2, Precip: 12.5, 'Wind Speed': 17 },
    { date: '2025-11-06', Temperature: 60, Humidity: 47.5, Precip: 5.8, 'Wind Speed': 15 },
    { date: '2025-11-07', Temperature: 57.1, Humidity: 69.8, Precip: 1.2, 'Wind Speed': 9 },
    { date: '2025-11-08', Temperature: 62.8, Humidity: 83.2, Precip: 0.0, 'Wind Speed': 9 },
    { date: '2025-11-09', Temperature: 64.7, Humidity: 74.4, Precip: 0.0, 'Wind Speed': 16 },
    { date: '2025-11-10', Temperature: 40.4, Humidity: 45, Precip: 0.0, 'Wind Speed': 21 },
    { date: '2025-11-11', Temperature: 38.2, Humidity: 41.3, Precip: 0.0, 'Wind Speed': 16 },
    { date: '2025-11-12', Temperature: 50.9, Humidity: 41.4, Precip: 0.0, 'Wind Speed': 15 },
    { date: '2025-11-13', Temperature: 54.5, Humidity: 45.2, Precip: 0.8, 'Wind Speed': 10 },
    { date: '2025-11-14', Temperature: 54.9, Humidity: 38.9, Precip: 3.2, 'Wind Speed': 9 },
    { date: '2025-11-15', Temperature: 59.5, Humidity: 50.1, Precip: 6.7, 'Wind Speed': 13 },
    { date: '2025-11-16', Temperature: 64.4, Humidity: 44.5, Precip: 4.5, 'Wind Speed': 20 },
    { date: '2025-11-17', Temperature: 53.7, Humidity: 30.8, Precip: 2.1, 'Wind Speed': 10 },
    { date: '2025-11-18', Temperature: 55.1, Humidity: 41.7, Precip: 0.3, 'Wind Speed': 12 },
    { date: '2025-11-19', Temperature: 64, Humidity: 47.1, Precip: 0.0, 'Wind Speed': 8 },
    { date: '2025-11-20', Temperature: 61.2, Humidity: 65.3, Precip: 0.0, 'Wind Speed': 9 },
    { date: '2025-11-21', Temperature: 62.7, Humidity: 82.4, Precip: 0.0, 'Wind Speed': 9 },
    { date: '2025-11-22', Temperature: 68.1, Humidity: 66.4, Precip: 0.0, 'Wind Speed': 16 },
    { date: '2025-11-23', Temperature: 61.7, Humidity: 55.5, Precip: 0.0, 'Wind Speed': 8 },
    { date: '2025-11-24', Temperature: 56, Humidity: 52.3, Precip: 0.0, 'Wind Speed': 12 },
    { date: '2025-11-25', Temperature: 59, Humidity: 74.8, Precip: 1.5, 'Wind Speed': 12 },
    { date: '2025-11-26', Temperature: 62.9, Humidity: 72.6, Precip: 5.3, 'Wind Speed': 15 },
    { date: '2025-11-27', Temperature: 45.2, Humidity: 34.3, Precip: 8.9, 'Wind Speed': 15 },
    { date: '2025-11-28', Temperature: 38.3, Humidity: 37.8, Precip: 3.7, 'Wind Speed': 14 },
    { date: '2025-11-29', Temperature: 38.1, Humidity: 40.4, Precip: 1.2, 'Wind Speed': 9 },
    { date: '2025-11-30', Temperature: 43, Humidity: 72.1, Precip: 0.0, 'Wind Speed': 7 }
  ];

  // Load CSV file on component mount
  useEffect(() => {
    loadWeatherData();
  }, []);

  // Function to load weatherdata.csv
  const loadWeatherData = async () => {
    setLoading(true);
    console.log('Loading sample weather data...');
    setWeatherData(sampleData);
    if (sampleData.length > 0) {
      setCurrentWeather(sampleData[sampleData.length - 1]);
    }
    setDataSource('sample');
    setLoading(false);
  };

  // Parse CSV content
  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((header, i) => {
        const value = values[i]?.trim();
        if (header === 'date' || header === 'Date' || header === 'Formatted Date') {
          obj.date = value;
        } else if (header === 'Temperature' || header === 'Temp') {
          obj.Temperature = parseFloat(value) || 0;
        } else if (header === 'Humidity') {
          obj.Humidity = parseFloat(value) || 0;
        } else if (header === 'Precip' || header === 'Precipitation') {
          obj.Precip = parseFloat(value) || 0;
        } else if (header === 'Wind Speed' || header === 'WindSpeed') {
          obj['Wind Speed'] = parseFloat(value) || 0;
        } else {
          obj[header] = value;
        }
      });
      return obj;
    }).filter(row => row.Temperature !== undefined);
  };

  // Handle manual file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const parsed = parseCSV(event.target.result);
        setWeatherData(parsed);
        if (parsed.length > 0) {
          setCurrentWeather(parsed[parsed.length - 1]);
        }
        setDataSource('uploaded');
        setLoading(false);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file. Please check the format.');
        setLoading(false);
      }
    };
    
    reader.readAsText(file);
  };

  // Generate farming insights
  useEffect(() => {
    if (!weatherData || weatherData.length === 0) return;
    
    const recent = weatherData.slice(-7);
    const latestTemp = recent[recent.length - 1].Temperature;
    const avgHumidity = recent.reduce((sum, d) => sum + d.Humidity, 0) / recent.length;
    const totalRainfall = recent.reduce((sum, d) => sum + d.Precip, 0);

    const newInsights = [];

    // Temperature insights
    if (latestTemp > 30) {
      newInsights.push({
        type: 'warning',
        category: 'Temperature',
        message: 'High temperature alert',
        action: 'Increase irrigation frequency. Consider shade netting for sensitive crops.',
        icon: <ThermometerSun className="w-5 h-5" />
      });
    } else if (latestTemp < 10) {
      newInsights.push({
        type: 'warning',
        category: 'Temperature',
        message: 'Low temperature warning',
        action: 'Protect frost-sensitive crops. Consider row covers or polytunnels.',
        icon: <ThermometerSun className="w-5 h-5" />
      });
    } else {
      newInsights.push({
        type: 'success',
        category: 'Temperature',
        message: 'Optimal temperature conditions',
        action: 'Ideal for planting most crops. Continue regular maintenance.',
        icon: <ThermometerSun className="w-5 h-5" />
      });
    }

    // Humidity insights
    if (avgHumidity > 80) {
      newInsights.push({
        type: 'warning',
        category: 'Humidity',
        message: 'High humidity detected',
        action: 'Monitor for fungal diseases. Improve air circulation. Consider fungicide application.',
        icon: <Droplets className="w-5 h-5" />
      });
    } else if (avgHumidity < 40) {
      newInsights.push({
        type: 'info',
        category: 'Humidity',
        message: 'Low humidity conditions',
        action: 'Increase watering frequency. Use mulch to retain soil moisture.',
        icon: <Droplets className="w-5 h-5" />
      });
    }

    // Rainfall insights
    if (totalRainfall > 50) {
      newInsights.push({
        type: 'warning',
        category: 'Rainfall',
        message: 'Heavy rainfall recorded',
        action: 'Check drainage systems. Delay fertilizer application. Monitor for soil erosion.',
        icon: <Cloud className="w-5 h-5" />
      });
    } else if (totalRainfall < 5) {
      newInsights.push({
        type: 'warning',
        category: 'Irrigation',
        message: 'Low rainfall this week',
        action: 'Implement supplemental irrigation. Prioritize water-stressed crops.',
        icon: <Sprout className="w-5 h-5" />
      });
    } else {
      newInsights.push({
        type: 'success',
        category: 'Rainfall',
        message: 'Adequate rainfall',
        action: 'Reduce irrigation. Good conditions for planting and growth.',
        icon: <Cloud className="w-5 h-5" />
      });
    }

    setInsights(newInsights);
  }, [weatherData]);

  // Prepare chart data
  const chartData = weatherData.map(d => ({
    date: d.date,
    temp: d.Temperature,
    humidity: d.Humidity,
    rainfall: d.Precip,
    wind: d['Wind Speed']
  }));

  // Calculate danger levels (0-100 scale)
  const calculateDangerLevel = (temp, humidity, windSpeed) => {
    let tempRisk = 0;
    if (temp > 35) tempRisk = 40;
    else if (temp > 30) tempRisk = 25 + ((temp - 30) / 5) * 15;
    else if (temp > 25) tempRisk = 10 + ((temp - 25) / 5) * 15;
    else if (temp < 5) tempRisk = 40;
    else if (temp < 10) tempRisk = 25 + ((10 - temp) / 5) * 15;
    else if (temp < 15) tempRisk = 10 + ((15 - temp) / 5) * 15;

    let humidityRisk = 0;
    if (humidity > 85) humidityRisk = 30;
    else if (humidity > 75) humidityRisk = 20 + ((humidity - 75) / 10) * 10;
    else if (humidity > 65) humidityRisk = 10 + ((humidity - 65) / 10) * 10;
    else if (humidity < 30) humidityRisk = 30;
    else if (humidity < 40) humidityRisk = 20 + ((40 - humidity) / 10) * 10;
    else if (humidity < 50) humidityRisk = 10 + ((50 - humidity) / 10) * 10;

    let windRisk = 0;
    if (windSpeed > 40) windRisk = 30;
    else if (windSpeed > 30) windRisk = 20 + ((windSpeed - 30) / 10) * 10;
    else if (windSpeed > 20) windRisk = 10 + ((windSpeed - 20) / 10) * 10;
    else if (windSpeed > 15) windRisk = 5 + ((windSpeed - 15) / 5) * 5;

    return {
      windRisk: Math.round(windRisk),
      tempHumidityRisk: Math.round(tempRisk + humidityRisk),
      totalRisk: Math.round(tempRisk + humidityRisk + windRisk)
    };
  };

  // Prepare danger level data
  const dangerData = weatherData.map(d => {
    const risks = calculateDangerLevel(d.Temperature, d.Humidity, d['Wind Speed']);
    return {
      date: d.date,
      windRisk: risks.windRisk,
      combinedRisk: risks.windRisk + risks.tempHumidityRisk,
      totalRisk: risks.totalRisk
    };
  });

  // Custom tooltip for danger chart
  const DangerTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{data.date}</p>
          <p className="text-blue-600">🟦 Wind Risk: {data.windRisk}</p>
          <p className="text-orange-600">🟧 Total Hazard: {data.combinedRisk}</p>
          <p className="text-sm text-gray-500 mt-2">
            {data.combinedRisk < 20 && '✅ Low Risk'}
            {data.combinedRisk >= 20 && data.combinedRisk < 40 && '⚠️ Moderate Risk'}
            {data.combinedRisk >= 40 && data.combinedRisk < 60 && '🔶 High Risk'}
            {data.combinedRisk >= 60 && '🔴 Critical Risk'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Agricultural Weather Assistant
                </h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  {dataSource === 'csv' && <><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Data loaded from weatherdata.csv</>}
                  {dataSource === 'uploaded' && <><span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> Data uploaded from file</>}
                  {dataSource === 'sample' && <><span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span> Using sample data</>}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer flex items-center gap-2 font-medium">
                <Upload className="w-4 h-4" />
                Upload CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick View Selector Cards */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            onClick={() => setView('dashboard')}
            className={`group relative overflow-hidden flex items-start gap-4 p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left w-full ${
              view === 'dashboard' 
                ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 shadow-green-200' 
                : 'bg-white hover:shadow-xl'
            }`}
          >
            <div className={`flex-shrink-0 p-3 rounded-xl transition-all ${
              view === 'dashboard' 
                ? 'bg-green-500 shadow-lg' 
                : 'bg-gray-100 group-hover:bg-green-50'
            }`}>
              <TrendingUp className={`w-7 h-7 ${view === 'dashboard' ? 'text-white' : 'text-gray-600 group-hover:text-green-600'}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 mb-1">Dashboard</h3>
              <p className="text-sm text-gray-600">Overview of current weather, insights and quick stats.</p>
            </div>
            {view === 'dashboard' && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </button>

          <button
            onClick={() => setView('analytics')}
            className={`group relative overflow-hidden flex items-start gap-4 p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left w-full ${
              view === 'analytics' 
                ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 shadow-blue-200' 
                : 'bg-white hover:shadow-xl'
            }`}
          >
            <div className={`flex-shrink-0 p-3 rounded-xl transition-all ${
              view === 'analytics' 
                ? 'bg-blue-500 shadow-lg' 
                : 'bg-gray-100 group-hover:bg-blue-50'
            }`}>
              <Cloud className={`w-7 h-7 ${view === 'analytics' ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 mb-1">Analytics</h3>
              <p className="text-sm text-gray-600">Charts and trends for temperature, humidity and rainfall.</p>
            </div>
            {view === 'analytics' && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            )}
          </button>

          <button
            onClick={() => setView('danger')}
            className={`group relative overflow-hidden flex items-start gap-4 p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left w-full ${
              view === 'danger' 
                ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-500 shadow-orange-200' 
                : 'bg-white hover:shadow-xl'
            }`}
          >
            <div className={`flex-shrink-0 p-3 rounded-xl transition-all ${
              view === 'danger' 
                ? 'bg-orange-500 shadow-lg' 
                : 'bg-gray-100 group-hover:bg-orange-50'
            }`}>
              <AlertTriangle className={`w-7 h-7 ${view === 'danger' ? 'text-white' : 'text-gray-600 group-hover:text-orange-600'}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 mb-1">Risk Analysis</h3>
              <p className="text-sm text-gray-600">View hazard levels and risk assessments for your crops.</p>
            </div>
            {view === 'danger' && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            )}
          </button>
        </div>
        

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading weather data...</p>
          </div>
        )}

        {!loading && weatherData.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-6">Upload a weatherdata.csv file to get started</p>
          </div>
        )}

        {!loading && weatherData.length > 0 && view === 'dashboard' && currentWeather && (
          <>
            {/* Current Weather Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Temperature</p>
                    <p className="text-3xl font-bold text-gray-800">{currentWeather.Temperature.toFixed(1)}°C</p>
                  </div>
                  <ThermometerSun className="w-12 h-12 text-orange-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Humidity</p>
                    <p className="text-3xl font-bold text-gray-800">{currentWeather.Humidity.toFixed(0)}%</p>
                  </div>
                  <Droplets className="w-12 h-12 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Wind Speed</p>
                    <p className="text-3xl font-bold text-gray-800">{currentWeather['Wind Speed'].toFixed(1)} km/h</p>
                  </div>
                  <Wind className="w-12 h-12 text-cyan-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Precipitation</p>
                    <p className="text-3xl font-bold text-gray-800">{currentWeather.Precip.toFixed(1)} mm</p>
                  </div>
                  <Cloud className="w-12 h-12 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Farming Insights */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
                Farming Recommendations
              </h2>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      insight.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-500'
                        : insight.type === 'success'
                        ? 'bg-green-50 border-green-500'
                        : 'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">{insight.icon}</div>
                      <div className="ml-3 flex-1">
                        <h3 className="font-semibold text-gray-800">{insight.category}: {insight.message}</h3>
                        <p className="text-gray-700 mt-1">{insight.action}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">7-Day Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-gray-600 mb-2">Avg Temperature</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {(chartData.slice(-7).reduce((sum, d) => sum + d.temp, 0) / 7).toFixed(1)}°C
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-600 mb-2">Avg Humidity</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(chartData.slice(-7).reduce((sum, d) => sum + d.humidity, 0) / 7).toFixed(0)}%
                  </p>
                </div>
                <div className="text-center p-4 bg-cyan-50 rounded-lg">
                  <p className="text-gray-600 mb-2">Total Rainfall</p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {chartData.slice(-7).reduce((sum, d) => sum + d.rainfall, 0).toFixed(1)} mm
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {!loading && weatherData.length > 0 && view === 'analytics' && (
          <div className="space-y-8">
            {/* Temperature & Humidity Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Temperature & Humidity Trends (Last 30 Days)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temp" stroke="#f97316" name="Temperature (°C)" strokeWidth={2} />
                  <Line type="monotone" dataKey="humidity" stroke="#3b82f6" name="Humidity (%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Rainfall Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Rainfall Analysis (Last 30 Days)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rainfall" fill="#06b6d4" name="Rainfall (mm)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Wind Speed Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Wind Speed Trends (Last 30 Days)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="wind" stroke="#10b981" name="Wind Speed (km/h)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {!loading && weatherData.length > 0 && view === 'danger' && (
          <div className="space-y-8">
            {/* Danger Level Explanation */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
                Agricultural Hazard Risk Assessment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                    <h3 className="font-semibold text-gray-800">🟦 Wind Speed Risk (Blue Layer)</h3>
                  </div>
                  <p className="text-sm text-gray-700">Base risk from wind speed. High winds cause:</p>
                  <ul className="text-sm text-gray-600 mt-2 ml-4 list-disc">
                    <li>Crop lodging (plants blowing over)</li>
                    <li>Soil erosion and dust storms</li>
                    <li>Excessive plant transpiration</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                    <h3 className="font-semibold text-gray-800">🟧 Combined Hazard (Orange Layer)</h3>
                  </div>
                  <p className="text-sm text-gray-700">Total risk including temperature & humidity:</p>
                  <ul className="text-sm text-gray-600 mt-2 ml-4 list-disc">
                    <li>Extreme temperature stress</li>
                    <li>Disease-promoting humidity levels</li>
                    <li>Combined environmental hazards</li>
                  </ul>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Risk Scale (0-100)</h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <div className="w-16 h-4 bg-green-500 rounded mb-1"></div>
                    <p className="text-gray-600">0-20<br/>Low</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-4 bg-yellow-500 rounded mb-1"></div>
                    <p className="text-gray-600">20-40<br/>Moderate</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-4 bg-orange-500 rounded mb-1"></div>
                    <p className="text-gray-600">40-60<br/>High</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-4 bg-red-500 rounded mb-1"></div>
                    <p className="text-gray-600">60-100<br/>Critical</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stacked Area Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Danger Levels: Temperature, Wind Speed & Humidity (0-100 Risk Scale)
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={dangerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    label={{ value: 'Risk Level', angle: -90, position: 'insideLeft' }}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<DangerTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    wrapperStyle={{ paddingBottom: '20px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="windRisk" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    name="🟦 Wind Speed Risk (Base)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="combinedRisk" 
                    stroke="#f97316" 
                    fill="none"
                    strokeWidth={3}
                    name="🟧 Combined Hazard (Temp + Humidity + Wind)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="text-sm text-gray-700">
                  <strong>💡 How to Read:</strong> The blue filled area shows wind-based risk. 
                  The orange line on top shows total hazard after adding temperature and humidity risks. 
                  When the orange line spikes HIGH above the blue area, it means temperature and humidity 
                  are significantly increasing the danger level.
                </p>
              </div>
            </div>

            {/* Current Risk Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Risk Status</h2>
              {dangerData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <Wind className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Wind Risk</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {dangerData[dangerData.length - 1].windRisk}/100
                    </p>
                  </div>
                  <div className="text-center p-6 bg-orange-50 rounded-lg border-2 border-orange-200">
                    <ThermometerSun className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Combined Hazard</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {dangerData[dangerData.length - 1].combinedRisk}/100
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-red-50 rounded-lg border-2 border-red-200">
                    <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Overall Status</p>
                    <p className="text-3xl font-bold">
                      {dangerData[dangerData.length - 1].combinedRisk < 20 && (
                        <span className="text-green-600">✅ Low</span>
                      )}
                      {dangerData[dangerData.length - 1].combinedRisk >= 20 && dangerData[dangerData.length - 1].combinedRisk < 40 && (
                        <span className="text-yellow-600">⚠️ Moderate</span>
                      )}
                      {dangerData[dangerData.length - 1].combinedRisk >= 40 && dangerData[dangerData.length - 1].combinedRisk < 60 && (
                        <span className="text-orange-600">🔶 High</span>
                      )}
                      {dangerData[dangerData.length - 1].combinedRisk >= 60 && (
                        <span className="text-red-600">🔴 Critical</span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* High Risk Periods */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">High Risk Periods</h2>
              <div className="space-y-3">
                {dangerData
                  .map((d, idx) => ({ ...d, idx }))
                  .filter(d => d.combinedRisk >= 40)
                  .slice(-10)
                  .map((d, i) => (
                    <div 
                      key={i}
                      className={`p-4 rounded-lg border-l-4 ${
                        d.combinedRisk >= 60 
                          ? 'bg-red-50 border-red-500' 
                          : 'bg-orange-50 border-orange-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{d.date}</p>
                          <p className="text-sm text-gray-600">
                            Wind: {d.windRisk} | Combined: {d.combinedRisk}
                          </p>
                        </div>
                        <div className="text-right">
                          {d.combinedRisk >= 60 ? (
                            <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-semibold">
                              🔴 Critical
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm font-semibold">
                              🔶 High Risk
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {dangerData.filter(d => d.combinedRisk >= 40).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>✅ No high-risk periods detected in the data!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OldAgriculturalWeatherAssistant;