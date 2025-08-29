import React, { useEffect, useState } from 'react';
const WeatherWidget = require('../components/WeatherWidget').default;

// Types for the settings page
interface WeatherConfig {
    apiKey: string;
    defaultLocation: string;
    units: string;
}

interface WeatherSettingsPageProps {
    pluginApi: any;
}

// Weather Settings Page Component
const WeatherSettingsPage: React.FC<WeatherSettingsPageProps> = ({ pluginApi }) => {
    const [config, setConfig] = useState<WeatherConfig>({
        apiKey: '',
        defaultLocation: '',
        units: 'metric'
    });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const savedConfig = await pluginApi.storage.get('config');
            if (savedConfig) {
                setConfig(savedConfig);
            }
        } catch (error) {
            console.error('Failed to load config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfigChange = async (newConfig: WeatherConfig) => {
        setConfig(newConfig);
        try {
            await pluginApi.storage.set('config', newConfig);
            if (pluginApi?.notifications) {
                pluginApi.notifications.show({
                    title: 'Settings Saved',
                    message: 'Weather settings have been updated',
                    color: 'green'
                });
            }
        } catch (error) {
            console.error('Failed to save config:', error);
            if (pluginApi?.notifications) {
                pluginApi.notifications.show({
                    title: 'Save Failed',
                    message: 'Failed to save weather settings',
                    color: 'red'
                });
            }
        }
    };

    if (loading) {
        return (
            <div style={{
                padding: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', color: '#868e96' }}>Loading settings...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            padding: '24px',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{
                    margin: '0 0 8px 0',
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#212529'
                }}>
                    Weather Settings
                </h1>
                <p style={{
                    margin: '0',
                    fontSize: '14px',
                    color: '#868e96'
                }}>
                    Configure your weather widget preferences and API settings.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 300px',
                gap: '24px',
                alignItems: 'start'
            }}>
                {/* Settings Form */}
                <div style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '24px'
                }}>
                    <h2 style={{
                        margin: '0 0 16px 0',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#212529'
                    }}>
                        Configuration
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '4px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#495057'
                            }}>
                                OpenWeatherMap API Key
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your API key"
                                value={config.apiKey}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    backgroundColor: 'white'
                                }}
                            />
                            <div style={{
                                marginTop: '4px',
                                fontSize: '12px',
                                color: '#868e96'
                            }}>
                                Get your free API key from{' '}
                                <a
                                    href="https://openweathermap.org/api"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#228be6', textDecoration: 'none' }}
                                >
                                    OpenWeatherMap
                                </a>
                            </div>
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '4px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#495057'
                            }}>
                                Default Location
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., New York, NY"
                                value={config.defaultLocation}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfig(prev => ({ ...prev, defaultLocation: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    backgroundColor: 'white'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '4px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#495057'
                            }}>
                                Temperature Units
                            </label>
                            <select
                                value={config.units}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setConfig(prev => ({ ...prev, units: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value="metric">Celsius (°C)</option>
                                <option value="imperial">Fahrenheit (°F)</option>
                            </select>
                        </div>

                        <div style={{ marginTop: '16px' }}>
                            <button
                                onClick={() => handleConfigChange(config)}
                                disabled={!config.apiKey || !config.defaultLocation}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: (!config.apiKey || !config.defaultLocation) ? '#e9ecef' : '#228be6',
                                    color: (!config.apiKey || !config.defaultLocation) ? '#868e96' : 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: (!config.apiKey || !config.defaultLocation) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Widget */}
                <div>
                    <h3 style={{
                        margin: '0 0 16px 0',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#212529'
                    }}>
                        Preview
                    </h3>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '16px',
                        border: '1px solid #e9ecef'
                    }}>
                        <WeatherWidget
                            config={config}
                            onConfigChange={handleConfigChange}
                            pluginApi={pluginApi}
                        />
                    </div>
                </div>
            </div>

            {/* Additional Information */}
            <div style={{
                marginTop: '32px',
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
            }}>
                <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#212529'
                }}>
                    About Weather Widget
                </h3>
                <p style={{
                    margin: '0',
                    fontSize: '14px',
                    color: '#495057',
                    lineHeight: '1.5'
                }}>
                    This weather widget displays current weather conditions and forecasts for your specified location.
                    It uses the OpenWeatherMap API to fetch real-time weather data. Make sure to configure your API key
                    and location to start receiving weather updates.
                </p>
            </div>
        </div>
    );
};

module.exports = WeatherSettingsPage;
