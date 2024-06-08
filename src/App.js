import React, { useEffect, useState } from "react";
import './App.css';
import Search from "./components/search/search";
import CurrentWeather from './components/current-weather/current-weather';
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import BackgroundImage from "./components/BackgroundImage";
import Forecast from "./components/forecast/forecast";


function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);

  useEffect(() => {
    requestLocation();
  }, []); // This effect runs once on mount

  useEffect(() => {
    // This effect runs whenever locationPermission changes
    if (locationPermission === false) {
      setCurrentWeather(null); // Clear previous weather data
      setForecast(null); // Clear previous forecast data
    }
  }, [locationPermission]);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          reverseGeocode(latitude, longitude)
            .then((cityName) => {
              fetchWeatherData(latitude, longitude, cityName);
              setLocationPermission(true);
              setIsUsingCurrentLocation(true);
            })
            .catch(console.error);
        },
        (error) => {
          console.error(error);
          setLocationPermission(false);
        }
      );
    } else {
      setLocationPermission(false);
    }
  };

  const reverseGeocode = async (lat, lon) => {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const data = await response.json();
    return data.city || data.locality || data.principalSubdivision || "Unknown Location";
  };

  const fetchWeatherData = (lat, lon, cityName) => {
    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: cityName, ...weatherResponse });
        setForecast({ city: cityName, ...forecastResponse });
      })
      .catch(console.error);
  };

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");
    fetchWeatherData(lat, lon, searchData.label);
    setIsUsingCurrentLocation(false);
  };

  return (
    <div className="container">
      <BackgroundImage />
      {locationPermission === false && <p>Please choose a city to see the weather</p>}
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && (
        <CurrentWeather data={currentWeather} isUsingCurrentLocation={isUsingCurrentLocation} />
      )}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;
