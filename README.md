# Metro Backend & Frontend Project

A real-time metro system management application built with Node.js, Express, MongoDB, Socket.IO, and vanilla JavaScript. The system allows admins to manage stations and create announcements, while providing real-time updates to users through WebSockets.

## 🚀 Features

### Backend
- **Station Management**: Store and retrieve metro stations with sorting capabilities
- **Admin Authentication**: Secure JWT-based login with bcrypt password hashing
- **Real-time Announcements**: Create and broadcast announcements to specific stations in real-time via Socket.IO
- **Rate Limiting**: Protect API endpoints with rate limiting middleware
- **Health Check Endpoint**: `/health` endpoint for monitoring
- **Comprehensive Testing**: Jest test suite with mocked models and services
- **Security**: CORS, Helmet for secure headers, input validation with express-validator

### Frontend
- **Station Display**: View all metro stations in a responsive interface
- **Real-time Updates**: Live station viewer counts and announcements using Socket.IO
- **Admin Panel**: Secure login and announcement creation
- **Interactive UI**: Modern, user-friendly interface with CSS styling

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB)
- **Git**

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/MZK145/Mohamed-s-project-level-4-semester-2-final-project.git
cd Mohamed-s-project-level-4-semester-2-final-project
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection URI and JWT secret:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=AppName
JWT_SECRET=your_strong_secret_key
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend
```

No installation required - the frontend uses vanilla JavaScript. Just serve the files using a local server:

```bash
# If you have Python 3 installed:
python -m http.server 8080

# If you have Node.js http-server installed:
npx http-server -p 8080
```

Open `http://localhost:8080` in your browser.

## 🏃 Running the Application

### Development Mode

**Backend** (from `backend/` directory):

```bash
npm run dev
```

This starts the server with nodemon, automatically restarting on file changes.

**Frontend** (from `frontend/` directory):

```bash
npx http-server -p 8080
```

### Production Mode

**Backend**:

```bash
npm start
```

**Frontend**: Serve the frontend files using a static file server or deploy to a CDN.

## ✅ Testing

Run the test suite:

```bash
cd backend
npm test
```

Expected output:
```
Test Suites: 1 passed
Tests: 5 passed
```

### Test Coverage

The test suite covers:
- Health check endpoint
- Station retrieval and sorting
- Admin login with JWT token generation
- Protected announcement creation (authorization)
- Token validation and error handling

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Endpoints

#### Health Check
```
GET /health
Response: { "status": "ok" }
```

#### Stations
```
GET /stations
Response: Array of stations sorted by line and order
[
  {
    "_id": "...",
    "name": "Helwan",
    "line": "Line 1",
    "order": 1,
    "governorate": "Cairo",
    "city": "Helwan"
  },
  ...
]
```

#### Admin Login
```
POST /auth/login
Body: { "email": "admin@metro.com", "password": "password" }
Response: { "token": "JWT_TOKEN", "role": "admin" }
```

#### Get Announcements for a Station
```
GET /stations/:stationId/announcements
Response: Array of announcements for the station
[
  {
    "_id": "...",
    "stationId": "...",
    "message": "Announcement text",
    "createdAt": "2026-08-16T10:00:00Z"
  },
  ...
]
```

#### Create Announcement (Admin Only)
```
POST /stations/:stationId/announcements
Headers: Authorization: Bearer JWT_TOKEN
Body: { "message": "Announcement text" }
Response: { "_id": "...", "stationId": "...", "message": "Announcement text" }
Status: 201 Created
```

**Authorization Required**: Include JWT token in Authorization header
**Message Validation**: 1-500 characters

## 🔌 WebSocket Events

The application uses Socket.IO for real-time communication:

### Client Events
- **Join Station**: `join-station` - Join a station room for updates
- **Leave Station**: `leave-station` - Leave a station room

### Server Events
- **Viewer Count Update**: `viewer-count` - Updates number of users viewing a station
- **New Announcement**: `new-announcement` - Broadcast new announcement to station room

## 📦 Project Structure

```
backend/
├── controllers/          # Request handlers
├── models/              # MongoDB schemas
├── routes/              # API route definitions
├── middleware/          # Custom middleware (auth, error handling)
├── services/            # Business logic
├── sockets/             # Socket.IO event handlers
├── tests/               # Jest test suite
├── data/                # Seed data
├── .env.example         # Environment variables template
├── app.js              # Express app configuration
├── server.js           # Server entry point
├── jest.config.js      # Jest configuration
└── package.json        # Dependencies

frontend/
├── index.html          # Main HTML file
├── script.js           # JavaScript logic
└── style.css           # Styling
```

## 🛡️ Security Features

1. **JWT Authentication**: Secure token-based admin authentication
2. **Bcrypt Hashing**: Passwords are hashed with salt rounds of 10
3. **Rate Limiting**: 100 requests per 15-minute window
4. **CORS**: Controlled cross-origin requests
5. **Helmet**: Security headers for protection against common attacks
6. **Input Validation**: Express-validator for request validation
7. **Environment Variables**: Sensitive data stored in `.env` (not in git)

## 🚀 Deployment

### Render

The project is configured for deployment on Render:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set up environment variables in Render dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
4. Set the build command: `npm install`
5. Set the start command: `npm start`
6. Deploy

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a cluster
3. Add a database user
4. Whitelist your IP address
5. Get the connection string and add it to `.env`

## 📝 Environment Variables

Required environment variables (see `.env.example`):

- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a pull request

## 📄 License

ISC License

## 👤 Author

Mohamed - Level 4 Semester 2 Final Project

## 🔗 Repository

[GitHub Repository](https://github.com/MZK145/Mohamed-s-project-level-4-semester-2-final-project)

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.

---

**Last Updated**: August 16, 2026
