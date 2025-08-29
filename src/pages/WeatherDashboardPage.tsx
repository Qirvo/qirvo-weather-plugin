import React, { useEffect, useState } from 'react';
const WeatherWidget = require('../components/WeatherWidget').default;

// Types for the dashboard page
interface WeatherConfig {
    apiKey: string;
    defaultLocation: string;
    units: string;
}

interface WeatherData {
    location: string;
    temperature: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;
    units: string;
}

interface WeatherDashboardPageProps {
    pluginApi: any;
}

// Weather Dashboard Page Component
const WeatherDashboardPage: React.FC<WeatherDashboardPageProps> = ({ pluginApi }) => {
    const [config, setConfig] = useState<WeatherConfig>({
        apiKey: '',
        defaultLocation: '',
        units: 'metric'
    });
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const savedConfig = await pluginApi.storage.get('config');
            if (savedConfig) {
                setConfig(savedConfig);
                await fetchWeather(savedConfig);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Failed to load config:', error);
            setLoading(false);
        }
    };

    const fetchWeather = async (weatherConfig: WeatherConfig) => {
        if (!weatherConfig.apiKey || !weatherConfig.defaultLocation) {
            setError('API key and location required');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await pluginApi.http.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(weatherConfig.defaultLocation)}&appid=${weatherConfig.apiKey}&units=${weatherConfig.units || 'metric'}`
            );

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();

            // Transform API response
            const weatherData: WeatherData = {
                location: data.name,
                temperature: Math.round(data.main.temp),
                condition: data.weather[0].main,
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                icon: getWeatherEmoji(data.weather[0].main),
                units: weatherConfig.units || 'metric'
            };

            setWeather(weatherData);
        } catch (err: any) {
            setError(err.message);
            if (pluginApi?.notifications) {
                pluginApi.notifications.show({
                    title: 'Weather Error',
                    message: err.message,
                    color: 'red'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const getWeatherEmoji = (condition: string): string => {
        const emojiMap: Record<string, string> = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Fog': '🌫️',
            'Haze': '🌫️'
        };
        return emojiMap[condition] || '🌤️';
    };

    const handleConfigChange = async (newConfig: WeatherConfig) => {
        setConfig(newConfig);
        try {
            await pluginApi.storage.set('config', newConfig);
            await fetchWeather(newConfig);
        } catch (error) {
            console.error('Failed to save config:', error);
        }
    };

    const refreshWeather = () => {
        fetchWeather(config);
    };

    if (loading) {
        return (
            <div style={{
                padding: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', color: '#868e96' }}>Loading weather dashboard...</div>
                </div>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div style={{
                padding: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', color: '#fa5252', marginBottom: '16px' }}>
                        {error || 'Weather data unavailable'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#868e96', marginBottom: '16px' }}>
                        Please configure your weather settings first.
                    </div>
                    <button
                        onClick={() => window.location.href = '/plugins/weather/settings'}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#228be6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                    >
                        Go to Settings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            padding: '24px',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <div>
                    <h1 style={{
                        margin: '0 0 8px 0',
                        fontSize: '28px',
                        fontWeight: '600',
                        color: '#212529'
                    }}>
                        Weather Dashboard
                    </h1>
                    <p style={{
                        margin: '0',
                        fontSize: '16px',
                        color: '#868e96'
                    }}>
                        Current weather conditions for {weather.location}
                    </p>
                </div>
                <button
                    onClick={refreshWeather}
                    style={{
                        padding: '10px 16px',
                        backgroundColor: '#228be6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    🔄 Refresh
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '24px'
            }}>
                {/* Main Weather Card */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #e9ecef',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}>
                        <div style={{ fontSize: '48px', marginRight: '16px' }}>
                            {weather.icon}
                        </div>
                        <div>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '600',
                                color: '#212529',
                                marginBottom: '4px'
                            }}>
                                {weather.temperature}°{weather.units === 'metric' ? 'C' : 'F'}
                            </div>
                            <div style={{
                                fontSize: '18px',
                                color: '#868e96',
                                textTransform: 'capitalize'
                            }}>
                                {weather.description}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px'
                    }}>
                        <div style={{
                            padding: '12px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', marginBottom: '4px' }}>💧</div>
                            <div style={{ fontSize: '14px', color: '#868e96' }}>Humidity</div>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#212529' }}>
                                {weather.humidity}%
                            </div>
                        </div>

                        <div style={{
                            padding: '12px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', marginBottom: '4px' }}>💨</div>
                            <div style={{ fontSize: '14px', color: '#868e96' }}>Wind Speed</div>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#212529' }}>
                                {weather.windSpeed} {weather.units === 'metric' ? 'm/s' : 'mph'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weather Details Card */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #e9ecef',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                    <h3 style={{
                        margin: '0 0 16px 0',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#212529'
                    }}>
                        Weather Details
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '8px 0',
                            borderBottom: '1px solid #f1f3f5'
                        }}>
                            <span style={{ color: '#868e96' }}>Location</span>
                            <span style={{ fontWeight: '500', color: '#212529' }}>{weather.location}</span>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '8px 0',
                            borderBottom: '1px solid #f1f3f5'
                        }}>
                            <span style={{ color: '#868e96' }}>Condition</span>
                            <span style={{ fontWeight: '500', color: '#212529', textTransform: 'capitalize' }}>
                                {weather.condition}
                            </span>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '8px 0',
                            borderBottom: '1px solid #f1f3f5'
                        }}>
                            <span style={{ color: '#868e96' }}>Units</span>
                            <span style={{ fontWeight: '500', color: '#212529' }}>
                                {weather.units === 'metric' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
                            </span>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '8px 0'
                        }}>
                            <span style={{ color: '#868e96' }}>Last Updated</span>
                            <span style={{ fontWeight: '500', color: '#212529' }}>
                                {new Date().toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Widget Preview */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e9ecef',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
                <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#212529'
                }}>
                    Widget Preview
                </h3>
                <div style={{
                    display: 'inline-block',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '16px'
                }}>
                    <WeatherWidget
                        config={config}
                        onConfigChange={handleConfigChange}
                        pluginApi={pluginApi}
                    />
                </div>
            </div>
        </div>
    );
};

module.exports = WeatherDashboardPage;
