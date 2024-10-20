'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sun, Cloud, CloudRain, Droplets, Wind } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { subDays, differenceInDays, format } from 'date-fns';

interface WeatherData {
  date: string;
  temperature: number;
  humidity: number;
  pressure: number;
  condition: string;
}

interface CurrentWeather {
  id: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

const WeatherIcon: React.FC<{ condition: string }> = ({ condition }) => {
  switch (condition.toLowerCase()) {
    case 'sunny':
      return <Sun className="h-12 w-12 text-yellow-400" />;
    case 'cloudy':
      return <Cloud className="h-12 w-12 text-gray-400" />;
    case 'rainy':
      return <CloudRain className="h-12 w-12 text-blue-400" />;
    default:
      return <Sun className="h-12 w-12 text-yellow-400" />;
  }
};

const WeatherDashboard: React.FC = () => {
  const today = new Date();
  const fourteenDaysAgo = subDays(today, 14);
  const sevenDaysAgo = subDays(today, 7);

  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [forecastData, setForecastData] = useState<WeatherData[]>([]);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather[]>([]);
  const [city, setCity] = useState('London');
  const [startDate, setStartDate] = useState<Date | null>(sevenDaysAgo);
  const [endDate, setEndDate] = useState<Date | null>(today);

  useEffect(() => {
    fetchWeatherData();
    fetchCurrentWeather();
  }, [city]);

  const fetchCurrentWeather = async () => {
    try {
      const response = await fetch(`/api/current?city=${city}`);
      const data = await response.json();
      setCurrentWeather(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error fetching current weather:', error);
    }
  };

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`/api/forecast?city=${city}&days=30`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setWeatherData(data);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchForecastData = async () => {
    if (!startDate || !endDate) return;

    const daysDifference = differenceInDays(endDate, startDate);
    if (daysDifference > 14) {
      alert('Please select a date range of up to 14 days.');
      return;
    }

    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      const response = await fetch(`/api/forecast?city=${city}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setForecastData(data);
      }
    } catch (error) {
      console.error('Error fetching forecast data:', error);
    }
  };

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchForecastData();
  };

  const chartData = useMemo(() => {
    return (forecastData.length > 0 ? forecastData : weatherData).map(day => ({
      date: day.date,
      temperature: day.temperature,
      humidity: day.humidity,
      pressure: day.pressure,
    }));
  }, [forecastData, weatherData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-100 p-4 md:p-8">
      <Card className="bg-white/80 backdrop-blur-md shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Weather Forecast</h1>
          
          {/* Current Weather Display */}
          <div className="mb-6 flex space-x-4 overflow-x-auto">
            {currentWeather.map((sensor) => (
              <Card key={sensor.id} className="bg-white/60 shadow rounded-lg flex-shrink-0 min-w-[200px]">
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-2">Sensor {sensor.id}</h2>
                  <p>Temperature: {sensor.temperature.toFixed(1)}°C</p>
                  <p>Humidity: {sensor.humidity.toFixed(1)}%</p>
                  <p>Pressure: {sensor.pressure.toFixed(1)} hPa</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Date Selection Form */}
          <form onSubmit={handleDateSubmit} className="mb-6 flex flex-wrap gap-4 justify-center items-end">
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="w-full md:w-auto"
            />
            <div>
              <label className="block mb-1">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => {
                  setStartDate(date);
                  if (date && endDate) {
                    // Ensure endDate is not before startDate
                    if (differenceInDays(endDate, date) > 7) {
                      setEndDate(subDays(date, -7) > today ? today : subDays(date, -7));
                    }
                  }
                }}
                selectsStart
                startDate={startDate ?? undefined}
                endDate={endDate ?? undefined}
                minDate={fourteenDaysAgo}
                maxDate={today}
                dateFormat="dd-MM-yyyy"
                className="border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block mb-1">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                selectsEnd
                startDate={startDate ?? undefined}
                endDate={endDate ?? undefined}
                minDate={startDate ? startDate : fourteenDaysAgo}
                maxDate={today}
                disabled={!startDate}
                dateFormat="dd-MM-yyyy"
                className="border rounded px-2 py-1"
              />
            </div>
            <Button type="submit" className="w-full md:w-auto">Get Forecast</Button>
          </form>

          {/* Weather Data Cards */}
          <div className="mb-8 flex space-x-4 overflow-x-auto">
            {(forecastData.length > 0 ? forecastData : weatherData).map((day, index) => (
              <Card key={index} className="bg-white/60 shadow rounded-lg flex-shrink-0 min-w-[200px]">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold">{new Date(day.date).toLocaleDateString()}</p>
                    <WeatherIcon condition={day.condition} />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <p>{day.temperature.toFixed(1)}°C</p>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <p>{day.humidity.toFixed(1)}%</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Wind className="h-5 w-5 text-gray-500" />
                    <p>{day.pressure.toFixed(1)} hPa</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Weather Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['temperature', 'humidity', 'pressure'].map((metric) => (
              <Card key={metric} className="bg-white/60 shadow rounded-lg overflow-hidden">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-4 capitalize">{metric} Trend</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey={metric} stroke="#8884d8" name={`${metric.charAt(0).toUpperCase() + metric.slice(1)}`} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherDashboard;
