import { NextResponse } from 'next/server';

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'http://api.weatherapi.com/v1';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'London';
  const days = searchParams.get('days') || '3';

  const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${days}&aqi=no`);
  
  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch forecast data' }, { status: response.status });
  }

  const data = await response.json();

  if (!data.forecast || !data.forecast.forecastday) {
    return NextResponse.json({ error: 'Invalid forecast data structure' }, { status: 500 });
  }
// ... existing code ...
const forecastData = data.forecast.forecastday.map((day: { date: string; day: { avgtemp_c: number; avghumidity: number; }; hour: { pressure_mb: number; }[]; }) => ({
    
    date: day.date,
    temperature: day.day.avgtemp_c,
    humidity: day.day.avghumidity,
    pressure: day.hour[12].pressure_mb // Using noon pressure as average
  }));

  return NextResponse.json(forecastData);
}