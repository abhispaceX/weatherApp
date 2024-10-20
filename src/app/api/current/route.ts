import { NextResponse } from 'next/server';

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'http://api.weatherapi.com/v1';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'London';

  try {
    const response = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=no`);
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    // Simulating multiple sensors
    const sensors = ['A', 'B', 'C'].map(id => ({
      id: `sensor${id}`,
      temperature: data.current.temp_c + Math.random() * 2 - 1, // Add some variation
      humidity: data.current.humidity + Math.random() * 5 - 2.5,
      pressure: data.current.pressure_mb + Math.random() * 10 - 5
    }));

    return NextResponse.json(sensors);
  } catch (error) {
    console.error('Error fetching current weather:', error);
    return NextResponse.json({ error: 'Failed to fetch current weather data' }, { status: 500 });
  }
}
