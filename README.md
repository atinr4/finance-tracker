# Finance Tracker

A modern, full-stack personal finance management application built with React, TypeScript, and Material-UI. Track expenses, manage investments, and visualize your financial data with beautiful charts and analytics.

## Features

### Dashboard
- Real-time financial overview with key metrics
- Interactive charts and graphs
- Recent transactions list
- Expense distribution analysis
- Customizable time range filters

### Transactions
- Add, edit, and delete transactions
- Categorize expenses and income
- Filter by date, type, and category
- Export transactions to CSV
- Search functionality

### Investments
- Track multiple investments
- Investment performance metrics
- Category-wise investment distribution
- Edit and delete investment records

### Currency Support
- INR (Indian Rupee) formatting
- Proper number formatting with Indian convention (e.g., 1,00,000)
- Support for large numbers with compact notation

## Tech Stack

### Frontend (Web)
- React 18
- TypeScript
- Material-UI (MUI)
- Recharts for data visualization
- React Router for navigation
- Local Storage for data persistence

### Shared Package
- Common types and constants
- Shared utilities
- Type definitions

### Mobile (In Development)
- React Native
- Native Navigation
- Shared business logic with web

## Project Structure

```
finance-tracker/
├── packages/
│   ├── web/                 # Web application
│   │   ├── src/
│   │   │   ├── components/  # Reusable components
│   │   │   ├── pages/      # Main page components
│   │   │   ├── utils/      # Utility functions
│   │   │   └── App.tsx     # Main application
│   │   └── package.json
│   ├── mobile/             # Mobile application
│   │   ├── src/
│   │   │   ├── screens/    # Mobile screens
│   │   │   └── navigation/ # Navigation setup
│   │   └── package.json
│   └── shared/             # Shared package
│       ├── src/
│       │   ├── constants.ts # Shared constants
│       │   └── types.ts    # Type definitions
│       └── package.json
└── package.json            # Root package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/atinr4/finance-tracker.git
cd finance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the web application:
```bash
cd packages/web
npm start
```

## Development

### Web Application
- Located in `packages/web`
- Uses Create React App
- Material-UI for components
- Recharts for charts
- Local Storage for data persistence

### Shared Package
- Located in `packages/shared`
- Contains shared types and constants
- Used by both web and mobile apps

### Mobile Application
- Located in `packages/mobile`
- React Native implementation
- Shares core logic with web

## Key Components

### Dashboard
- Financial overview cards
- Area chart for income/expense trends
- Pie chart for expense distribution
- Recent transactions list

### Currency Formatting
- Uses Intl.NumberFormat for INR
- Supports Indian number system
- Handles large numbers with compact notation

## Future Enhancements

1. Backend Integration
   - RESTful API implementation
   - Database integration
   - User authentication

2. Advanced Features
   - Budget planning
   - Financial goals
   - Bill reminders
   - Investment tracking
   - Multi-currency support

3. Mobile Features
   - Offline support
   - Push notifications
   - QR code scanning for bills

4. Data Analysis
   - Advanced analytics
   - Spending patterns
   - Investment insights
   - Budget recommendations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
