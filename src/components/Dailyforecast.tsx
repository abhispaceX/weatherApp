import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


interface HourlyData {
  time: string;
  temp: number;
  wind: number;
  pressure: number;
  chanceOfRain: number;
}

interface DailyForecastProps {
  date: string;
  temperature: number;
  maxTemp: number;
  minTemp: number;
  humidity: number;
  precipitation: number;
  condition: string;
  conditionIcon: string;
  hourly: HourlyData[];
  weeklyForecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
    conditionIcon: string;
  }>;
}

const DailyForecast: React.FC<DailyForecastProps> = ({
  date,
  temperature,
  humidity,
  precipitation,
  condition, 
  hourly,
  weeklyForecast
}) => {
  const formattedHourly = hourly.map(h => ({
    ...h,
    time: new Date(h.time).getHours() + ':00'
  }));

  return (
    <Card className="bg-gray-900 text-white shadow-2xl rounded-2xl overflow-hidden border-t border-l border-gray-800">
      <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
            <p className="text-xl">{condition}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{temperature}°C</p>
            <p className="text-lg">Precipitation: {precipitation}%</p>
            <p className="text-lg">Humidity: {humidity}%</p>
          </div>
        </div>

        <div className="mb-8">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={formattedHourly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }} />
              <Line type="monotone" dataKey="temp" stroke="#fbbf24" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-8">
          {weeklyForecast.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-sm">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
              <img src={day.conditionIcon} alt={day.condition} className="w-8 h-8 mx-auto my-2" />
              <p className="text-sm font-bold">{day.maxTemp}°</p>
              <p className="text-sm text-gray-400">{day.minTemp}°</p>
            </div>
          ))}
        </div>

        {/* <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3">Time</th>
                <th scope="col" className="px-6 py-3">Temperature</th>
                <th scope="col" className="px-6 py-3">Wind</th>
                <th scope="col" className="px-6 py-3">Pressure</th>
                <th scope="col" className="px-6 py-3">Chance of Rain</th>
              </tr>
            </thead>
            <tbody>
              {formattedHourly.map((hour, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="px-6 py-4">{hour.time}</td>
                  <td className="px-6 py-4">{hour.temp}°C</td>
                  <td className="px-6 py-4">{hour.wind} km/h</td>
                  <td className="px-6 py-4">{hour.pressure} hPa</td>
                  <td className="px-6 py-4">{hour.chanceOfRain}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default DailyForecast;