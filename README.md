# Finance Tracker

A cross-platform financial tracking application for managing personal income, expenses, and investments.

## Features

- Track monthly income and expenses
- Manage different expense categories (home loan, garage rent, credit card bills)
- Track investments (mutual funds, recurring deposits)
- Cross-platform support (iOS, Android, Web)
- Beautiful and intuitive user interface
- Offline support
- Secure data storage

## Project Structure

```
finance-tracker/
├── packages/
│   ├── shared/        # Shared TypeScript types and utilities
│   ├── mobile/        # React Native mobile app
│   └── web/          # React web app
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn package manager
- iOS development environment (for iOS)
- Android development environment (for Android)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```

### Running the Applications

#### Mobile App
```bash
# Start the React Native development server
yarn start

# Run on iOS
cd packages/mobile && yarn ios

# Run on Android
cd packages/mobile && yarn android
```

#### Web App
```bash
# Start the web development server
yarn web
```

## Technology Stack

- TypeScript
- React Native (Mobile)
- React (Web)
- Material-UI (Web)
- React Native Paper (Mobile)
- AsyncStorage for local data persistence
- React Navigation for mobile navigation

## License

This project is private and confidential.
