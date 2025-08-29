import React, { useCallback, useEffect, useState } from 'react';

// Types for the weather widget
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

interface WeatherConfig {
    apiKey: string;
    defaultLocation: string;
    units: string;
}

interface WeatherWidgetProps {
    config: WeatherConfig;
    onConfigChange: (config: WeatherConfig) => void;
    onRemove?: () => void;
    size?: string;
    pluginApi: any;
}

// Weather Widget Component
const WeatherWidget: React.FC<WeatherWidgetProps> = ({
    config,
    onConfigChange,
    pluginApi
}) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [configModalOpened, setConfigModalOpened] = useState<boolean>(false);
    const [tempConfig, setTempConfig] = useState<WeatherConfig>({
        apiKey: config.apiKey || '',
        defaultLocation: config.defaultLocation || '',
        units: config.units || 'metric'
    });

    const fetchWeather = useCallback(async () => {
        if (!config.apiKey || !config.defaultLocation) {
            setError('API key and location required');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await pluginApi.http.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(config.defaultLocation)}&appid=${config.apiKey}&units=${config.units || 'metric'}`
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
                units: config.units || 'metric'
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
    }, [config.apiKey, config.defaultLocation, config.units, pluginApi]);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

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

    const handleSaveConfig = async () => {
        try {
            // Save to plugin storage
            await pluginApi.storage.set('config', tempConfig);

            // Update widget config
            onConfigChange(tempConfig);

            setConfigModalOpened(false);

            if (pluginApi?.notifications) {
                pluginApi.notifications.show({
                    title: 'Configuration Saved',
                    message: 'Weather widget settings updated successfully',
                    color: 'green'
                });
            }
        } catch (error: any) {
            if (pluginApi?.notifications) {
                pluginApi.notifications.show({
                    title: 'Save Error',
                    message: 'Failed to save configuration',
                    color: 'red'
                });
            }
        }
    };

    const openConfigModal = () => {
        setTempConfig({
            apiKey: config.apiKey || '',
            defaultLocation: config.defaultLocation || '',
            units: config.units || 'metric'
        });
        setConfigModalOpened(true);
    };

    // Loading state
    if (loading) {
        return (
            <div style={{
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '16px',
                height: '160px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: '#868e96' }}>Loading weather...</div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !weather) {
        return (
            <div style={{
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '16px',
                height: '160px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: '#fa5252', marginBottom: '8px' }}>
                        {error || 'Weather data unavailable'}
                    </div>
                    <button
                        onClick={openConfigModal}
                        style={{
                            padding: '4px 8px',
                            fontSize: '12px',
                            backgroundColor: '#f1f3f5',
                            border: '1px solid #dee2e6',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Configure
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div style={{
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '16px',
                height: '160px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                }}>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>Weather</div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                            onClick={() => fetchWeather()}
                            style={{
                                padding: '4px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#868e96',
                                fontSize: '12px'
                            }}
                            title="Refresh"
                        >
                            🔄
                        </button>
                        <button
                            onClick={openConfigModal}
                            style={{
                                padding: '4px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#868e96',
                                fontSize: '12px'
                            }}
                            title="Settings"
                        >
                            ⚙️
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ fontSize: '20px', marginRight: '8px' }}>{weather.icon}</div>
                        <div>
                            <div style={{ fontSize: '18px', fontWeight: '600' }}>
                                {weather.temperature}°{weather.units === 'metric' ? 'C' : 'F'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#868e96' }}>{weather.location}</div>
                        </div>
                    </div>

                    <div style={{
                        fontSize: '14px',
                        color: '#868e96',
                        textTransform: 'capitalize'
                    }}>
                        {weather.description}
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ fontSize: '12px', color: '#868e96' }}>
                            💧 {weather.humidity}%
                        </div>
                        <div style={{ fontSize: '12px', color: '#868e96' }}>
                            💨 {weather.windSpeed} {weather.units === 'metric' ? 'm/s' : 'mph'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Configuration Modal */}
            {configModalOpened && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '24px',
                        width: '400px',
                        maxWidth: '90vw'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}>
                            <h3 style={{ margin: 0 }}>Weather Widget Configuration</h3>
                            <button
                                onClick={() => setConfigModalOpened(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '20px',
                                    cursor: 'pointer'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                                    OpenWeatherMap API Key
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your API key"
                                    value={tempConfig.apiKey}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                                    Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., New York, NY"
                                    value={tempConfig.defaultLocation}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempConfig(prev => ({ ...prev, defaultLocation: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                                    Temperature Units
                                </label>
                                <select
                                    value={tempConfig.units}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTempConfig(prev => ({ ...prev, units: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="metric">Celsius (°C)</option>
                                    <option value="imperial">Fahrenheit (°F)</option>
                                </select>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '8px',
                                marginTop: '16px'
                            }}>
                                <button
                                    onClick={() => setConfigModalOpened(false)}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#f1f3f5',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveConfig}
                                    disabled={!tempConfig.apiKey || !tempConfig.defaultLocation}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: (!tempConfig.apiKey || !tempConfig.defaultLocation) ? '#e9ecef' : '#228be6',
                                        color: (!tempConfig.apiKey || !tempConfig.defaultLocation) ? '#868e96' : 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: (!tempConfig.apiKey || !tempConfig.defaultLocation) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

module.exports = WeatherWidget;
