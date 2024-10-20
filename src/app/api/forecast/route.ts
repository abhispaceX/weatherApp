import { NextResponse } from 'next/server';

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'http://api.weatherapi.com/v1';

interface ForecastDay {
  date: string;
  day: {
    avgtemp_c: number;
    avghumidity: number;
    condition: {
      text: string;
    };
  };
  hour: Array<{
    pressure_mb: number;
  }>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'London';
  const days = searchParams.get('days') || '30';
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');

  try {
    let url: string;
    if (start_date && end_date) {
      url = `${BASE_URL}/history.json?key=${API_KEY}&q=${city}&dt=${start_date}&end_dt=${end_date}`;
    } else {
      url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=${days}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    let forecastData;
    if (data.forecast) {
      forecastData = data.forecast.forecastday;
    } else if (data.history) {
      forecastData = data.history.forecastday;
    } else {
      throw new Error('Invalid data structure');
    }

    const processedData = forecastData.map((day: ForecastDay) => ({
      date: day.date,
      temperature: day.day.avgtemp_c,
      humidity: day.day.avghumidity,
      pressure: day.hour[12].pressure_mb,
      condition: day.day.condition.text
    }));

    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return NextResponse.json({ error: 'Failed to fetch forecast data' }, { status: 500 });
  }
}
