# Complete Installation Guide for Qirvo Weather Plugin

This guide provides step-by-step instructions for uploading, installing, and using the Qirvo Weather Plugin.

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Qirvo Dashboard** installed and running
2. **Node.js** (version 16 or higher)
3. **NPM** or **Yarn** package manager
4. **OpenWeatherMap API Key** (free at [openweathermap.org](https://openweathermap.org/api))

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Your Weather API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to "API Keys" in your account dashboard
4. Copy your API key (you'll need this later)

### Step 2: Install the Plugin

Choose one of the installation methods below:

#### Option A: Install from Qirvo Marketplace (Recommended)

1. Open your Qirvo dashboard
2. Click **"Plugins"** in the sidebar navigation
3. Search for **"Weather Widget"**
4. Click **"Install"** on the Weather Widget plugin
5. Wait for installation to complete
6. Click **"Configure"** to set up your API key

#### Option B: Manual Installation from Source

1. **Clone the plugin repository:**
   ```bash
   git clone https://github.com/qirvo/plugin-weather-widget.git
   cd qirvo-weather-plugin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the plugin:**
   ```bash
   npm run build
   ```

4. **Create distribution package:**
   ```bash
   npm pack
   ```

5. **Install in Qirvo:**
   ```bash
   # Using Qirvo CLI
   qirvo plugin install ./qirvo-plugin-weather-widget-1.0.0.tgz
   
   # Or copy to plugins directory
   cp qirvo-plugin-weather-widget-1.0.0.tgz ~/.qirvo/plugins/
   ```

### Step 3: Configure the Plugin

1. **Open Plugin Settings:**
   - Go to **Dashboard** → **Plugins** → **Weather Widget** → **Settings**

2. **Add Your API Key:**
   ```
   API Key: [paste your OpenWeatherMap API key here]
   ```

3. **Set Your Location (Optional):**
   ```
   Default Location: New York, NY
   ```

4. **Configure Preferences:**
   - **Temperature Units:** Celsius or Fahrenheit
   - **Update Interval:** 15 minutes (recommended)
   - **Show Forecast:** Enabled

5. **Click "Save Settings"**

### Step 4: Verify Installation

1. **Check Dashboard Widget:**
   - The weather widget should appear in your dashboard sidebar
   - You should see current weather for your location

2. **Test CLI Commands:**
   ```bash
   # Test basic weather command
   qirvo weather
   
   # Test with specific location
   qirvo weather "London, UK"
   ```

## 🔧 Detailed Configuration

### API Key Setup

Your OpenWeatherMap API key is required for the plugin to function:

1. **Free Tier Limits:**
   - 1,000 calls/day
   - 60 calls/minute
   - Perfect for personal use

2. **API Key Security:**
   - Store securely in Qirvo settings
   - Never commit to version control
   - Regenerate if compromised

### Location Configuration

Set up your default location for automatic weather updates:

```json
{
  "defaultLocation": "San Francisco, CA",
  "units": "celsius",
  "updateInterval": 15,
  "showForecast": true
}
```

**Supported Location Formats:**
- City name: `"London"`
- City, Country: `"London, UK"`
- City, State, Country: `"New York, NY, US"`
- Coordinates: `"40.7128,-74.0060"`
- ZIP code: `"10001,US"`

## 📱 Using the Plugin

### Dashboard Widget

The weather widget displays in your Qirvo dashboard sidebar:

**Features:**
- Current temperature and conditions
- Weather icon and description
- Humidity and wind speed
- 3-day forecast (if enabled)
- Auto-refresh every 15 minutes
- Manual refresh button

**Widget Controls:**
- 🔄 **Refresh Button:** Manual weather update
- ⚙️ **Settings:** Quick access to configuration
- 📍 **Location:** Click to change location

### CLI Commands

Access weather information from the command line:

#### Basic Commands
```bash
# Current weather for default location
qirvo weather

# Weather for specific location
qirvo weather "Tokyo, Japan"

# Short alias
qirvo w "Paris, France"
```

#### Advanced Commands
```bash
# Specify temperature units
qirvo weather "Berlin, Germany" --units celsius
qirvo weather "Miami, FL" --units fahrenheit

# Extended forecast
qirvo weather "Sydney, Australia" --days 5

# Combined options
qirvo weather "Vancouver, Canada" --units celsius --days 3
```

#### Command Options

| Option | Description | Example |
|--------|-------------|---------|
| `--units` | Temperature units (celsius/fahrenheit) | `--units fahrenheit` |
| `--days` | Forecast days (1-7) | `--days 5` |
| `--help` | Show command help | `--help` |

### Integration with Qirvo Features

#### Adding Weather to Tasks

```bash
# Add current weather to a specific task
qirvo weather add-to-task [task-id]
```

#### Calendar Integration

Weather information automatically appears in:
- Daily planner view
- Calendar events (if location-based)
- Task scheduling recommendations

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. "API Key Not Configured" Error

**Problem:** Plugin shows "Weather API key not configured"

**Solution:**
1. Go to Plugin Settings
2. Add your OpenWeatherMap API key
3. Save settings and refresh

#### 2. "Location Not Found" Error

**Problem:** Weather command fails with location error

**Solutions:**
- Check spelling of location name
- Try different format: "City, Country"
- Use coordinates: "40.7128,-74.0060"
- Set a default location in settings

#### 3. Widget Not Updating

**Problem:** Weather widget shows old data

**Solutions:**
1. Check internet connection
2. Verify API key is valid
3. Click refresh button manually
4. Check update interval setting
5. Restart Qirvo dashboard

#### 4. CLI Commands Not Working

**Problem:** `qirvo weather` command not found

**Solutions:**
1. Ensure plugin is installed and enabled
2. Restart Qirvo CLI
3. Check plugin status: `qirvo plugin list`
4. Reinstall plugin if necessary

#### 5. Rate Limit Exceeded

**Problem:** "API rate limit exceeded" error

**Solutions:**
- Wait for rate limit to reset (usually 1 hour)
- Increase update interval to reduce API calls
- Upgrade to paid OpenWeatherMap plan if needed

### Debug Mode

Enable detailed logging for troubleshooting:

1. **Enable Debug Logging:**
   ```bash
   qirvo config set plugins.weather-widget.logLevel debug
   ```

2. **View Logs:**
   ```bash
   qirvo logs --plugin weather-widget
   ```

3. **Check Plugin Status:**
   ```bash
   qirvo plugin status weather-widget
   ```

### Log Files

Plugin logs are stored in:
- **Windows:** `%APPDATA%\Qirvo\logs\plugins\weather-widget.log`
- **macOS:** `~/Library/Application Support/Qirvo/logs/plugins/weather-widget.log`
- **Linux:** `~/.config/qirvo/logs/plugins/weather-widget.log`

## 🔄 Updating the Plugin

### Automatic Updates

Qirvo automatically checks for plugin updates:

1. **Enable Auto-Updates:**
   - Go to **Settings** → **Plugins** → **Auto-Update**
   - Enable "Automatically update plugins"

2. **Manual Update Check:**
   ```bash
   qirvo plugin update weather-widget
   ```

### Manual Updates

1. **Download Latest Version:**
   ```bash
   qirvo plugin install @qirvo/plugin-weather-widget@latest
   ```

2. **Update from Source:**
   ```bash
   cd qirvo-weather-plugin
   git pull origin main
   npm run build
   qirvo plugin update ./
   ```

## 🗑️ Uninstalling the Plugin

### Complete Removal

1. **Disable Plugin:**
   ```bash
   qirvo plugin disable weather-widget
   ```

2. **Uninstall Plugin:**
   ```bash
   qirvo plugin uninstall weather-widget
   ```

3. **Clean Up Data (Optional):**
   ```bash
   qirvo plugin cleanup weather-widget
   ```

### Remove from Dashboard

1. Go to **Plugins** → **Weather Widget**
2. Click **"Uninstall"**
3. Confirm removal
4. Restart Qirvo dashboard

## 📊 Performance Optimization

### Reducing API Calls

1. **Increase Update Interval:**
   - Set to 30-60 minutes for less frequent updates
   - Reduces API usage

2. **Disable Forecast:**
   - Turn off 3-day forecast if not needed
   - Saves API calls

3. **Use Caching:**
   - Plugin automatically caches data
   - Serves cached data when API is unavailable

### Memory Usage

The plugin uses minimal resources:
- **Memory:** ~2-5 MB
- **Storage:** ~1 MB for cached data
- **Network:** ~1 KB per API call

## 🔐 Security Considerations

### API Key Security

1. **Never Share API Keys:**
   - Keep your OpenWeatherMap API key private
   - Don't commit to version control

2. **Regenerate if Compromised:**
   - Generate new key at OpenWeatherMap
   - Update in Qirvo settings

3. **Monitor Usage:**
   - Check API usage in OpenWeatherMap dashboard
   - Set up alerts for unusual activity

### Data Privacy

- Weather data is cached locally
- No personal data sent to weather service
- Location data only used for weather requests
- All data encrypted in transit

## 📞 Support and Help

### Getting Help

1. **Documentation:** [Qirvo Plugin Docs](https://docs.qirvo.ai/plugins)
2. **Community:** [Discord Server](https://discord.gg/qirvo)
3. **Email:** plugins@qirvo.ai
4. **Issues:** [GitHub Issues](https://github.com/qirvo/plugin-weather-widget/issues)

### Reporting Bugs

When reporting issues, include:
- Qirvo version
- Plugin version
- Operating system
- Error messages
- Steps to reproduce

### Feature Requests

Submit feature requests on our [GitHub repository](https://github.com/qirvo/plugin-weather-widget/issues/new?template=feature_request.md).

---

## ✅ Installation Checklist

- [ ] OpenWeatherMap API key obtained
- [ ] Plugin installed via marketplace or manually
- [ ] API key configured in settings
- [ ] Default location set (optional)
- [ ] Widget appears in dashboard
- [ ] CLI commands working
- [ ] Weather data displaying correctly

**Congratulations! Your Qirvo Weather Plugin is now ready to use! 🎉**

---

*For additional help, visit our [support page](https://qirvo.ai/support) or join our [community Discord](https://discord.gg/qirvo).*
