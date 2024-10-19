'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sun, Droplets, Wind } from 'lucide-react';

interface WeatherData {
  id: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

interface ForecastData {
  date: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

const WeatherDashboard: React.FC = () => {
  const [currentData, setCurrentData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [city, setCity] = useState('London');

  useEffect(() => {
    const fetchCurrentData = async () => {
      const response = await fetch(`/api/current?city=${city}`);
      const data = await response.json();
      setCurrentData(data);
    };

    const fetchForecastData = async () => {
      const response = await fetch(`/api/forecast?city=${city}&days=5`);
      const data = await response.json();
      setForecastData(data);
    };

    fetchCurrentData();
    fetchForecastData();
  }, [city]);

  const handleCityChange = (value: string) => {
    setCity(value);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Weather Dashboard</h1>
      
      <div className="mb-4">
        <Select value={city} onValueChange={handleCityChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="London">London</SelectItem>
            <SelectItem value="New York">New York</SelectItem>
            <SelectItem value="Tokyo">Tokyo</SelectItem>
            <SelectItem value="Sydney">Sydney</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {currentData && (
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold">Current Weather in {city}</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <Sun className="h-6 w-6" />
              <p className="text-lg">Temperature: {currentData.temperature.toFixed(1)}°C</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <Droplets className="h-6 w-6" />
              <p className="text-lg">Humidity: {currentData.humidity.toFixed(1)}%</p>
            </div>
            <div className="flex items-center justify-between">
              <Wind className="h-6 w-6" />
              <p className="text-lg">Pressure: {currentData.pressure.toFixed(1)} hPa</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">5-Day Forecast</h2>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature (°C)" />
              <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humidity (%)" />
              <Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#ffc658" name="Pressure (hPa)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherDashboard;