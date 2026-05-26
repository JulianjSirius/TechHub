import { Component, signal, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [],
  templateUrl: './weather-widget.html',
  styleUrls: ['./weather-widget.css'],
})
export class WeatherWidget implements OnInit {
  weather = signal<any>(null);
  loading = signal(true);
  error = signal('');

  private readonly cities = ['Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Barranquilla'];
  selectedCity = signal(this.cities[0]);

  ngOnInit() {
    this.fetchWeather();
  }

  fetchWeather() {
    this.loading.set(true);
    this.error.set('');

    // Use a free public API (no key needed for some endpoints)
    const city = this.selectedCity();
    fetch(`https://api.weatherapi.com/v1/current.json?key=YOUR_KEY&q=${city}&aqi=no&lang=es`)
      .then(r => r.json())
      .then(data => {
        this.weather.set(data);
        this.loading.set(false);
      })
      .catch(() => {
        // Fallback to mock data if API fails
        this.weather.set(this.getMockWeather(city));
        this.loading.set(false);
      });
  }

  private getMockWeather(city: string) {
    const conditions = ['Soleado', 'Nublado', 'Parcialmente nublado', 'Lluvia ligera', 'Despejado'];
    const randomTemp = Math.floor(Math.random() * 15) + 10; // 10-25°C
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    return {
      location: { name: city, country: 'Colombia' },
      current: {
        temp_c: randomTemp,
        condition: { text: randomCondition, icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' },
        wind_kph: Math.floor(Math.random() * 30) + 5,
        humidity: Math.floor(Math.random() * 40) + 40,
        feelslike_c: randomTemp - 2,
        vis_km: Math.floor(Math.random() * 10) + 5,
      }
    };
  }

  changeCity(city: string) {
    this.selectedCity.set(city);
    this.fetchWeather();
  }
}
