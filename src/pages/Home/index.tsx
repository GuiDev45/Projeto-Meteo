import axios from "axios";
import { useState } from "react";

interface WindData {
  speed: number;
  angle: number;
  dir: string;
}

interface CurrentWeatherData {
  icon: string;
  icon_num: number;
  summary: string;
  temperature: number;
  wind: WindData;
  precipitation: {
    total: number;
    type: string;
  };
  cloud_cover: number;
}

interface HourlyWeatherData {
  date: string;
  weather: string;
  icon: number;
  summary: string;
  temperature: number;
  wind: WindData;
  cloud_cover: {
    total: number;
  };
  precipitation: {
    total: number;
    type: string;
  };
}

interface WeatherData {
  lat: string;
  lon: string;
  elevation: number;
  timezone: string;
  units: string;
  current: CurrentWeatherData;
  hourly: {
    data: HourlyWeatherData[];
  };
  daily: null;
}

/*
Request
{
    "place_id": "piracicaba",
    "language": "en", não vai precisar usar, free só tem "en"
    "unit": "metric" 
}

current: Situação climática atual
daily: Previsões para cada dia inteiro
hourly: Previsões com resolução horária
all: Todas as seções

https://www.meteosource.com/client/interactive-documentation#/Point%20weather/point_point_get

https://www.meteosource.com/
*/

const apiKey = "4cup3f9he2shjrrmr2pl238pbr995gejaok6pzvp";
const baseUrl = "https://www.meteosource.com/api/v1/free/";

export class MeteoApi {
  async getDataTest(place_id: string): Promise<WeatherData> {
    const response = await axios.get<WeatherData>(
      `${baseUrl}point?place_id=${place_id}&sections=current%2Chourly&language=en&units=metric&key=${apiKey}`,
    );
    return response.data;
  }
}

export default function Home() {
  const [place, setPlace] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const meteoApi = new MeteoApi();
    const data = await meteoApi.getDataTest(place);
    setWeatherData(data);
  };

  return (
    <div>
      <div>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="place"
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            placeholder="Digite o local..."
          />
          <button type="submit">Procurar</button>
        </form>

        {weatherData && (
          <div>
            <h1>Condições Atuais</h1>
            <p>Temperatura: {weatherData.current.temperature} °C</p>
            <p>Fuso horário: {weatherData.timezone}</p>
            <p>Vento: {weatherData.current.wind.speed} m/s</p>
            <p>Nuvens: {weatherData.current.cloud_cover} %</p>
          </div>
        )}
      </div>
    </div>
  );
}
