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
    time: new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  return (
    <Card className="bg-gray-900 text-white shadow-2xl rounded-2xl overflow-hidden border-t border-l border-gray-800">
      <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
            <p className="text-lg sm:text-xl">{condition}</p>
          </div>
          <div className="text-right mt-2 sm:mt-0">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold">{temperature}°C</p>
            <p className="text-sm sm:text-base">Precipitation: {precipitation}%</p>
            <p className="text-sm sm:text-base">Humidity: {humidity}%</p>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="h-48 sm:h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedHourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis 
                  dataKey="time" 
                  stroke="#888" 
                  tick={{fontSize: 10}}
                  interval={'preserveStartEnd'}
                  tickFormatter={(value) => value.split(':')[0]}
                />
                <YAxis 
                  stroke="#888" 
                  tick={{fontSize: 10}}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: 'none', 
                    borderRadius: '4px',
                    fontSize: '12px' 
                  }} 
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value}°C`, 'Temperature']}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#fbbf24" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-4">
          {weeklyForecast.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-xs sm:text-sm">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
              <img src={day.conditionIcon} alt={day.condition} className="w-6 h-6 sm:w-8 sm:h-8 mx-auto my-1 sm:my-2" />
              <p className="text-xs sm:text-sm font-bold">{day.maxTemp}°</p>
              <p className="text-xs sm:text-sm text-gray-400">{day.minTemp}°</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyForecast;
