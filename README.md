
# Subscription Manager

A full-stack web application for tracking and managing recurring subscriptions.

## Features

### 🔐 Authentication & Security
- **User Registration & Login**: Secure user authentication with JWT tokens
- **Admin Panel**: Comprehensive administrative dashboard
- **Password Security**: Bcrypt password hashing
- **Rate Limiting**: API protection against abuse

### 📋 Subscription Management
- **Track Subscriptions**: Add, edit, and manage all recurring subscriptions
- **Smart Categorization**: Organize by Movies, Networking, K-Drama, and more
- **Billing Cycles**: Support for monthly, yearly, weekly, and daily billing
- **Direct Links**: Quick access to subscription websites and cancellation pages
- **Renewal Tracking**: Never miss a renewal date

### 📊 Analytics & Insights
- **Spending Analytics**: Detailed breakdown of subscription costs
- **Category Analysis**: See spending by category with visual charts
- **Monthly/Yearly Estimates**: Understand your total subscription costs
- **Upcoming Renewals**: 30-day renewal forecast

### 🔔 Notifications & Reminders
- **Renewal Alerts**: Get notified before subscriptions renew
- **System Notifications**: Important updates and alerts
- **Email Integration**: (Coming soon) Email notifications
- **SMS Alerts**: (Coming soon) SMS reminder system

### 👥 Admin Features
- **User Management**: View and manage all registered users
- **Category Management**: Create and manage subscription categories
- **System Statistics**: Monitor platform usage and health
- **User Analytics**: Detailed user subscription insights

## Tech Stack

- **Frontend**: React with Vite
- **Backend**: Node.js with Express
- **Database**: MySQL (subscriptionmanager)
- **Authentication**: JWT tokens

## Project Structure

```
subscription-manager/
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
└── README.md         # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL Server** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **npm** or **yarn** package manager

### 🛠️ Installation

#### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

#### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd subscription-manager
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

### 🗄️ Database Setup

1. Create a MySQL database named `subscriptionmanager`
2. Update the `.env` file in the backend directory:
   ```env
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=subscriptionmanager
   ```

The application will automatically create the necessary tables on first run.

## 🎯 Usage

### Default Admin Account
- **Email**: `admin@subscriptionmanager.com`
- **Password**: `admin123`

### User Features
1. **Register/Login**: Create an account or sign in
2. **Add Subscriptions**: Click "Add Subscription" to track new services
3. **Manage Categories**: Organize subscriptions by type
4. **View Analytics**: Check spending insights and trends
5. **Set Reminders**: Get notified before renewals

### Admin Features
1. **User Management**: Monitor and manage user accounts
2. **Category Management**: Create and edit subscription categories
3. **System Overview**: View platform statistics and health

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:backend      # Start only backend
npm run dev:frontend     # Start only frontend

# Production
npm run start            # Start production build
npm run build            # Build frontend for production

# Maintenance
npm run install:all      # Install all dependencies
npm run clean            # Clean node_modules
npm run reset            # Clean and reinstall everything
```

### Development URLs
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`
- **API Health Check**: `http://localhost:3001/api/health`

### Project Structure
```
subscription-manager/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── services/        # API service functions
│   │   └── ...
│   └── package.json
├── backend/                  # Node.js backend
│   ├── config/              # Database configuration
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   └── package.json
├── .github/workflows/       # CI/CD pipelines
├── docker-compose.yml       # Docker configuration
└── package.json            # Root package.json
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### Subscription Endpoints
- `GET /api/subscriptions` - Get user subscriptions
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription
- `GET /api/subscriptions/analytics/summary` - Get analytics

### Admin Endpoints
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/categories` - Category management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for further details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/subscription-manager/issues) page
2. Review the setup instructions
3. Ensure all prerequisites are installed
4. Check the console for error messages

## 🎉 Acknowledgments

- Built with React, Node.js, and MySQL
- Icons and design inspiration from modern web applications
- Security best practices implemented throughout
