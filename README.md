# Qirvo Weather Widget Plugin

A comprehensive weather plugin for Qirvo that displays current weather conditions and forecasts in your daily planner dashboard and provides CLI weather commands.

## Features

- 🌤️ **Current Weather Display**: Real-time weather conditions with temperature, humidity, and wind speed
- 📅 **3-Day Forecast**: Extended weather forecast in your dashboard widget
- 🖥️ **CLI Commands**: Get weather information directly from the command line
- 📍 **Location Support**: Automatic location detection or manual location setting
- ⚙️ **Configurable**: Customizable units, update intervals, and display options
- 🔄 **Auto-Updates**: Automatic weather data refresh at configurable intervals
- 💾 **Offline Support**: Cached weather data when API is unavailable
- 🔧 **Plugin Lifecycle**: Full lifecycle management with install, enable, disable, and update hooks
- 🛡️ **Admin Approval**: Integrated with Qirvo's admin approval workflow
- 🧹 **Clean Scripts**: Built-in cleaning capabilities for development and maintenance
- 📊 **Health Monitoring**: Health check endpoint for admin monitoring
- 🔄 **Configuration Migration**: Automatic config migration during plugin updates

## Installation

### Prerequisites

1. **Qirvo Dashboard**: Ensure you have Qirvo installed and running
2. **Weather API Key**: Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)

### Method 1: Install from Qirvo Plugin Marketplace

1. Open your Qirvo dashboard
2. Navigate to **Plugins** in the sidebar
3. Search for "Weather Widget"
4. Click **Install** on the Weather Widget plugin
5. Configure your API key in the plugin settings

### Method 2: Manual Installation

1. **Download the Plugin**:

   ```bash
   git clone https://github.com/Qirvo/qirvo-weather-plugin.git
   cd plugin-weather-widget
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Build the Plugin**:

   ```bash
   npm run build
   ```

4. **Package for Distribution**:

   ```bash
   npm pack
   ```

5. **Install in Qirvo**:
   - Copy the generated `.tgz` file to your Qirvo plugins directory
   - Or use the Qirvo CLI: `qirvo plugin install ./qirvo-plugin-weather-widget-1.0.0.tgz`

## Configuration

After installation, configure the plugin in your Qirvo dashboard:

1. Go to **Plugins** → **Weather Widget** → **Settings**
2. Add your OpenWeatherMap API key
3. Set your default location (optional)
4. Configure preferences:
   - **Temperature Units**: Celsius or Fahrenheit
   - **Update Interval**: How often to refresh weather data (5-60 minutes)
   - **Show Forecast**: Enable/disable 3-day forecast display

### Configuration Options

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| `apiKey` | OpenWeatherMap API key | - | ✅ |
| `defaultLocation` | Default location for weather | - | ❌ |
| `units` | Temperature units (celsius/fahrenheit) | celsius | ❌ |
| `updateInterval` | Update frequency in minutes (5-60) | 15 | ❌ |
| `showForecast` | Show 3-day forecast in widget | true | ❌ |

## Usage

### Dashboard Widget

Once installed and configured, the weather widget will automatically appear in your Qirvo dashboard sidebar. The widget displays:

- Current temperature and weather conditions
- Location name
- Humidity and wind speed
- 3-day forecast (if enabled)
- Last update time

### CLI Commands

Use the weather plugin from the Qirvo command line:

#### Basic Weather Command

```bash
# Get weather for your default location
qirvo weather

# Get weather for a specific location
qirvo weather "New York, NY"
qirvo weather "London, UK"
qirvo weather "Tokyo, Japan"
```

#### Advanced Options

```bash
# Specify temperature units
qirvo weather "Paris, France" --units fahrenheit
qirvo weather "Berlin, Germany" --units celsius

# Get extended forecast
qirvo weather "Sydney, Australia" --days 5

# Combine options
qirvo weather "Los Angeles, CA" --units fahrenheit --days 7
```

#### Command Aliases

```bash
# Short aliases for quick access
qirvo w "Miami, FL"
qirvo forecast "Seattle, WA" --days 3
```

### Integration with Qirvo Tasks

The weather plugin can integrate with your Qirvo tasks:

```bash
# Add current weather to a task (via plugin API)
qirvo weather add-to-task <task-id>
```

## Architecture

### Modern TSX Component Architecture

The Weather Plugin has been modernized with a clean TypeScript React architecture:

#### Component Structure

```text
src/
├── components/
│   └── WeatherWidget.tsx          # Main widget component
├── pages/
│   ├── WeatherSettingsPage.tsx    # Settings configuration page
│   └── WeatherDashboardPage.tsx   # Weather overview dashboard
└── index.ts                       # Plugin entry point
```

#### Key Features

- **TypeScript TSX Components**: Modern React components with full TypeScript support
- **Page-Based Routing**: Structured routing for `/plugins/weather/settings` and `/plugins/weather/dashboard`
- **CommonJS Compatibility**: Full browser-compatible module system with require() support
- **Mantine UI Integration**: Consistent design system with Qirvo dashboard
- **Plugin Runtime Integration**: Seamless integration with Qirvo's plugin system

#### Module System

The plugin uses CommonJS modules for browser compatibility:

```typescript
// Plugin components can use require() for external dependencies
const React = require('react');
const { Card, Text, Button } = require('@mantine/core');
```

### Plugin Lifecycle

The Weather Plugin follows Qirvo's plugin lifecycle:

1. **Installation**: Plugin files are uploaded and stored in Firebase Storage
2. **Registration**: Plugin is registered in the Qirvo plugin registry
3. **Loading**: Plugin runtime loads components using CommonJS require() system
4. **Execution**: Components render in the dashboard with full React support
5. **Configuration**: Settings are managed through dedicated configuration pages

## Development

### Setting Up Development Environment

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Qirvo/qirvo-weather-plugin.git
   cd plugin-weather-widget
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start development mode**:

   ```bash
   npm run dev
   ```

4. **Run tests**:

   ```bash
   npm test
   ```

5. **Lint code**:

   ```bash
   npm run lint
   ```

### Project Structure

```text
qirvo-weather-plugin/
├── src/
│   ├── index.ts          # Main plugin logic
│   └── widget.tsx        # React dashboard widget
├── dist/                 # Compiled output
├── manifest.json         # Plugin manifest
├── package.json          # NPM package configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

### Building for Production

```bash
# Build the plugin
npm run build

# Create distribution package
npm pack
```

## Troubleshooting

### Common Issues

1. **"Weather API key not configured"**
   - Solution: Add your OpenWeatherMap API key in plugin settings

2. **"No location specified"**
   - Solution: Set a default location in settings or specify location in CLI command

3. **"Failed to fetch weather data"**
   - Check your internet connection
   - Verify your API key is valid
   - Ensure the location name is correct

4. **Widget not updating**
   - Check the update interval setting
   - Verify the plugin is enabled
   - Check browser console for errors

### Debug Mode

Enable debug logging by setting the log level in your Qirvo configuration:

```json
{
  "plugins": {
    "weather-widget": {
      "logLevel": "debug"
    }
  }
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Reporting Issues

Please report issues on our [GitHub Issues](https://github.com/Qirvo/qirvo-weather-plugin/issues) page.

### Feature Requests

Have an idea for a new feature? Open a [Feature Request](https://github.com/Qirvo/qirvo-weather-plugin/issues/new?template=feature_request.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: <plugins@qirvo.ai>
- 📖 Documentation: [Qirvo Plugin Docs](https://docs.qirvo.ai/plugins)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/Qirvo/qirvo-weather-plugin/issues)

## [Changelog](CHANGELOG.md)

---

## Made with ❤️ by the Qirvo Community
