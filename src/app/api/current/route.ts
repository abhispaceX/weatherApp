import { NextResponse } from 'next/server';

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'http://api.weatherapi.com/v1';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'London';

  const response = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=no`);
  
  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: response.status });
  }

  const data = await response.json();

  return NextResponse.json({
    id: 'sensor1',
    temperature: data.current.temp_c,
    humidity: data.current.humidity,
    pressure: data.current.pressure_mb
  });
}