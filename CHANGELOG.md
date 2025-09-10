# Changelog

All notable changes to the Weather Widget plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.13] - 2025-08-29

### Fixed

- **CommonJS Module Support**: Implemented full CommonJS require() compatibility
  - Fixed "require is not defined" errors in browser environment
  - Added proper module resolution for external dependencies
  - Enhanced plugin runtime compatibility with Qirvo dashboard

### Added

- **TSX Component Architecture**: Modernized plugin with TypeScript React components
  - Created WeatherWidget.tsx with proper TypeScript interfaces
  - Added WeatherSettingsPage.tsx for configuration management
  - Implemented WeatherDashboardPage.tsx for weather overview
  - Proper React hooks integration and state management

- **Page-Based Plugin Structure**: Implemented structured routing system
  - `/plugins/weather/settings` for plugin configuration
  - `/plugins/weather/dashboard` for weather data display
  - Clean separation between widget and page components
  - Enhanced plugin integration with Qirvo dashboard

### Changed

- **Plugin Architecture Modernization**: Migrated to modern React development patterns
  - Converted from JavaScript widget.js to TypeScript TSX components
  - Updated manifest.json to point to default page routes
  - Implemented proper React imports and JSX syntax
  - Enhanced component reusability and maintainability

- **Module System Compatibility**: Ensured browser-compatible module execution
  - Configured TypeScript compilation for CommonJS output
  - Added proper module resolution for plugin dependencies
  - Improved plugin loading reliability and error handling

## [1.0.9] - 2025-08-27

### Changed

- Migrated from complex BasePlugin architecture to simple export structure
- Updated plugin to use React functional component with hooks
- Simplified plugin API to work with new Qirvo plugin runtime system

### Fixed

- Updated package structure to include manifest.json instead of qirvo.plugin.json
- Fixed plugin file loading by ensuring all dist files are included in package
- Resolved TypeScript compilation errors with new architecture
- Improved compatibility with Qirvo plugin runtime system

## [1.0.3] - 2025-08-22

### Added

- Clean project capability with `npm run clean` and `npm run clean:all` scripts
- Enhanced manifest with proper plugin marketplace alignment
- Admin approval workflow support with health checks
- Configuration migration system for version updates
- Proper lifecycle hooks implementation (onInstall, onUninstall, onEnable, onDisable, onUpdate)
- React component rendering support
- Enhanced error handling and user feedback
- CLI command support with aliases
- Security-focused permissions system

### Security

- Added proper permission declarations for network access, storage, and notifications
- API key marked as sensitive in configuration schema
- Health check system for admin monitoring

## [1.0.2] - Previous Release

- Basic weather widget functionality
- OpenWeatherMap API integration
- Dashboard widget support

## [1.0.1] - Previous Release

- Initial plugin structure
- Basic configuration support

## [1.0.0] - Initial Release

- Weather widget plugin for Qirvo
- Current weather and forecast display
- Basic configuration options
