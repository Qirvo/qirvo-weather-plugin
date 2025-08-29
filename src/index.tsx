// Weather Plugin - Main Entry Point
// CommonJS exports for the weather plugin system

const WeatherWidget = require('./components/WeatherWidget');
const WeatherDashboardPage = require('./pages/WeatherDashboardPage');
const WeatherSettingsPage = require('./pages/WeatherSettingsPage');

// Plugin manifest for the weather plugin
const pluginManifest = {
  id: 'qirvo-plugin-weather-widget',
  name: 'Weather Widget',
  version: '1.0.13',
  description: 'Display current weather information with customizable location and units',
  author: 'Qirvo Team',
  pages: {
    settings: '/plugins/weather/settings',
    dashboard: '/plugins/weather/dashboard'
  },
  defaultPage: 'settings',
  widget: {
    component: 'WeatherWidget',
    config: {
      apiKey: '',
      defaultLocation: '',
      units: 'metric'
    }
  }
};

// CommonJS exports
module.exports = {
  WeatherWidget,
  WeatherDashboardPage,
  WeatherSettingsPage,
  pluginManifest,
  default: WeatherWidget
};

