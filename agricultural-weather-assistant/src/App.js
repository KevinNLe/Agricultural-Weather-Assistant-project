import React, { useState, useEffect } from 'react';
import { Upload, Cloud, Droplets, Wind, ThermometerSun, Sprout, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AgriculturalWeatherAssistant = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('dashboard');

  // Parse CSV data
  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = values[i]?.trim();
      });
      return obj;
    });
  };

  // Handle file upload
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
          generateInsights(parsed);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        setLoading(false);
      }
    };
    
    reader.readAsText(file);
  };

  // Generate farming insights
  const generateInsights = (data) => {
    if (!data || data.length === 0) return;

    const recent = data.slice(-7);
    const latestTemp = parseFloat(recent[recent.length - 1].Temperature || 0);
    const avgHumidity = recent.reduce((sum, d) => sum + parseFloat(d.Humidity || 0), 0) / recent.length;
    const totalRainfall = recent.reduce((sum, d) => sum + parseFloat(d.Precip || 0), 0);

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
  };

  // Prepare chart data
  const getChartData = () => {
    if (!weatherData || weatherData.length === 0) return [];
    
    return weatherData.slice(-30).map(d => ({
      date: d['Formatted Date']?.split(' ')[0] || d.Date || '',
      temp: parseFloat(d.Temperature) || 0,
      humidity: parseFloat(d.Humidity) || 0,
      rainfall: parseFloat(d.Precip) || 0,
      wind: parseFloat(d['Wind Speed']) || 0
    }));
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sprout className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-800">Agricultural Weather Assistant</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setView('dashboard')}
                className={`px-4 py-2 rounded-lg ${view === 'dashboard' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setView('analytics')}
                className={`px-4 py-2 rounded-lg ${view === 'analytics' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Analytics
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Upload Section */}
        {weatherData.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center">
              <Upload className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Weather Data</h2>
              <p className="text-gray-600 mb-6">Upload your weatherHistory.csv file to get started</p>
              <label className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition">
                Choose CSV File
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Analyzing weather data...</p>
          </div>
        )}

        {weatherData.length > 0 && view === 'dashboard' && (
          <>
            {/* Current Weather Cards */}
            {currentWeather && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Temperature</p>
                      <p className="text-3xl font-bold text-gray-800">{parseFloat(currentWeather.Temperature).toFixed(1)}°C</p>
                    </div>
                    <ThermometerSun className="w-12 h-12 text-orange-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Humidity</p>
                      <p className="text-3xl font-bold text-gray-800">{parseFloat(currentWeather.Humidity).toFixed(0)}%</p>
                    </div>
                    <Droplets className="w-12 h-12 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Wind Speed</p>
                      <p className="text-3xl font-bold text-gray-800">{parseFloat(currentWeather['Wind Speed']).toFixed(1)} km/h</p>
                    </div>
                    <Wind className="w-12 h-12 text-cyan-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Precipitation</p>
                      <p className="text-3xl font-bold text-gray-800">{parseFloat(currentWeather.Precip).toFixed(1)} mm</p>
                    </div>
                    <Cloud className="w-12 h-12 text-gray-500" />
                  </div>
                </div>
              </div>
            )}

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

        {weatherData.length > 0 && view === 'analytics' && (
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
      </div>
    </div>
  );
};

export default AgriculturalWeatherAssistant;