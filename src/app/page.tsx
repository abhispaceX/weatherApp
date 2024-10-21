'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Droplets, Wind, Thermometer, MapPin } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { subDays, differenceInDays, format } from 'date-fns'
import { motion } from 'framer-motion'
import DailyForecast from '@/components/Dailyforecast'

interface WeatherData {
  date: string
  temperature: number
  maxTemp: number
  minTemp: number
  humidity: number
  precipitation: number
  pressure: number
  condition: string
  conditionIcon: string
  hourly: Array<{
    time: string
    temp: number
    wind: number
    pressure: number
    chanceOfRain: number
  }>
}

interface CurrentWeather {
  id: string
  temperature: number
  humidity: number
  pressure: number
}

const cities = [
  "London", "New York", "Tokyo", "Paris", "Sydney", "Dubai",
  "Hyderabad", "New Delhi", "Bangalore", "Mumbai", "Chennai", "Kolkata",
  "Singapore", "Hong Kong", "Berlin", "Rome", "Moscow", "Toronto"
]

const WeatherDashboard: React.FC = () => {
  const today = new Date()
  const fourteenDaysAgo = subDays(today, 7)

  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [forecastData, setForecastData] = useState<WeatherData[]>([])
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather[]>([])
  const [city, setCity] = useState('London')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const fetchCurrentWeather = useCallback(async (cityName: string) => {
    try {
      const response = await fetch(`/api/current?city=${cityName}`)
      const data = await response.json()
      setCurrentWeather(Array.isArray(data) ? data : [data])
    } catch (error) {
      console.error('Error fetching current weather:', error)
    }
  }, [])

  const fetchWeatherData = useCallback(async (cityName: string) => {
    try {
      const response = await fetch(`/api/forecast?city=${cityName}&days=30`)
      const data = await response.json()
      if (Array.isArray(data)) {
        setWeatherData(data)
      }
    } catch (error) {
      console.error('Error fetching weather data:', error)
    }
  }, [])

  const handleCityChange = (newCity: string) => {
    setCity(newCity)
    fetchCurrentWeather(newCity)
    fetchWeatherData(newCity)
    setForecastData([]) // Clear forecast data when city changes
  }

  useEffect(() => {
    fetchCurrentWeather(city)
    fetchWeatherData(city)
  }, [fetchCurrentWeather, fetchWeatherData, city])

  const fetchForecastData = async () => {
    if (!startDate || !endDate) return

    const daysDifference = differenceInDays(endDate, startDate)
    if (daysDifference > 14) {
      alert('Please select a date range of up to 14 days.')
      return
    }

    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd')
      const formattedEndDate = format(endDate, 'yyyy-MM-dd')
      const response = await fetch(`/api/forecast?city=${city}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`)
      const data = await response.json()
      if (Array.isArray(data)) {
        setForecastData(data)
      }
    } catch (error) {
      console.error('Error fetching forecast data:', error)
    }
  }

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchForecastData()
  }

  const chartData = useMemo(() => {
    return (forecastData.length > 0 ? forecastData : weatherData).map(day => ({
      date: day.date,
      temperature: day.temperature,
      humidity: day.humidity,
      pressure: day.pressure
    }))
  }, [forecastData, weatherData])

  const todaysForecast = useMemo(() => weatherData[0], [weatherData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-2 sm:p-4 md:p-6 lg:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <Card className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden border-t border-l border-white/50 mb-4 sm:mb-8">
          <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-center text-blue-900 tracking-tight">Weather Forecast</h1>
            
            {/* City Selection */}
            <div className="mb-4 sm:mb-6 max-w-md mx-auto">
              <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select a city
              </label>
              <div className="relative">
                <Select onValueChange={handleCityChange} defaultValue={city}>
                  <SelectTrigger id="city-select" className="w-full bg-white border-2 border-blue-300 rounded-lg py-2 pl-3 pr-10 text-left cursor-default focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <div className="flex items-center">
                      <MapPin className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <SelectValue placeholder="Choose a city" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-auto bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    {cities.map((cityName) => (
                      <SelectItem key={cityName} value={cityName} className="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-100">
                        {cityName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Today's Forecast */}
            {todaysForecast && (
              <div className="mb-4 sm:mb-6">
                <DailyForecast
                  date={todaysForecast.date}
                  temperature={todaysForecast.temperature}
                  maxTemp={todaysForecast.maxTemp}
                  minTemp={todaysForecast.minTemp}
                  humidity={todaysForecast.humidity}
                  precipitation={todaysForecast.precipitation}
                  condition={todaysForecast.condition}
                  conditionIcon={todaysForecast.conditionIcon}
                  hourly={todaysForecast.hourly}
                  weeklyForecast={weatherData.slice(0, 7)}
                />
              </div>
            )}

            {/* Current Weather Display */}
            <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {currentWeather.map((sensor) => (
                <motion.div
                  key={sensor.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg rounded-xl overflow-hidden">
                    <CardContent className="p-3">
                      <h2 className="text-base sm:text-lg font-semibold mb-2">Sensor {sensor.id}</h2>
                      <div className="flex items-center justify-between mb-1">
                        <Thermometer className="h-4 w-4" />
                        <p className="text-sm">{sensor.temperature?.toFixed(1)}°C</p>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <Droplets className="h-4 w-4" />
                        <p className="text-sm">{sensor.humidity?.toFixed(1)}%</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Wind className="h-4 w-4" />
                        <p className="text-sm">{sensor.pressure?.toFixed(1)} hPa</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Date Selection Form */}
            <form onSubmit={handleDateSubmit} className="mb-4 sm:mb-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-end">
              <div className="w-full sm:w-auto">
                <label className="block mb-1 text-sm font-medium text-blue-900">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => {
                    setStartDate(date)
                    if (date && endDate) {
                      if (differenceInDays(endDate, date) > 7) {
                        setEndDate(subDays(date, -7) > today ? today : subDays(date, -7))
                      }
                    }
                  }}
                  selectsStart
                  startDate={startDate ?? undefined}
                  endDate={endDate ?? undefined}
                  minDate={fourteenDaysAgo}
                  placeholderText="dd-MM-yyyy"
                  maxDate={today}
                  dateFormat="dd-MM-yyyy"
                  className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="w-full sm:w-auto">
                <label className="block mb-1 text-sm font-medium text-blue-900">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate ?? undefined}
                  endDate={endDate ?? undefined}
                  minDate={startDate ? startDate : fourteenDaysAgo}
                  maxDate={today}
                  disabled={!startDate}
                  placeholderText="dd-MM-yyyy"
                  dateFormat="dd-MM-yyyy"
                  className="w-full px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 text-sm">
                Get Forecast
              </Button>
            </form>

            {/* Weather Data Cards */}
            <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {(forecastData.length > 0 ? forecastData : weatherData).map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-blue-900 text-xs sm:text-sm">{new Date(day.date).toLocaleDateString()}</p>
                        <img src={day.conditionIcon} alt={day.condition} className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <Thermometer className="h-4 w-4 text-red-500" />
                        <p className="text-blue-800 text-xs sm:text-sm">{day.temperature.toFixed(1)}°C</p>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <p className="text-blue-800 text-xs sm:text-sm">{day.humidity?.toFixed(1)}%</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Wind className="h-4 w-4 text-gray-500" />
                        <p className="text-blue-800 text-xs sm:text-sm">{day.pressure?.toFixed(1)} hPa</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Weather Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {['temperature', 'humidity', 'pressure'].map((metric) => (
                <Card key={metric} className="bg-white/80 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden">
                  <CardContent className="p-3 sm:p-4">
                    <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 capitalize text-blue-900">{metric} Trend</h2>
                    <div className="h-48 sm:h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                          <XAxis dataKey="date" stroke="#666" tick={{fontSize: 10}} />
                          <YAxis stroke="#666" tick={{fontSize: 10}} />
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', fontSize: '10px' }} />
                          <Legend wrapperStyle={{fontSize: '10px'}} />
                          <Line 
                            type="monotone" 
                            dataKey={metric} 
                            stroke={metric === 'temperature' ? '#ef4444' : metric === 'humidity' ? '#3b82f6' : '#8b5cf6'} 
                            strokeWidth={2}
                            dot={{ stroke: 'white', strokeWidth: 2, fill: metric === 'temperature' ? '#ef4444' : metric === 'humidity' ? '#3b82f6' : '#8b5cf6', r: 3 }}
                            activeDot={{ r: 5 }}
                            name={`${metric.charAt(0).toUpperCase() + metric.slice(1)}`} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default WeatherDashboard
