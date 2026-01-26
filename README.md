# AI-Assisted Project & Phase Management System

A full-stack web application for project management with AI-powered performance summaries. Project Managers can create projects, define phases with deadlines, assign developers, and view AI-generated performance reports. Developers can track their assigned phases, update progress, add comments, and view their personal performance summary.

## Features

### For Project Managers
- Create and manage multiple projects
- Define project phases with deadlines
- Assign developers to projects and phases
- View AI-generated performance summaries for:
  - Individual developers
  - Entire projects
- Track project progress and phase completion

### For Developers
- View assigned projects and phases
- Update phase status (pending, in progress, completed, delayed)
- Add comments on phases
- View personal AI-generated performance summary
- Track upcoming deadlines

### AI Performance Analysis
The system analyzes:
- Phase deadlines vs actual completion dates
- On-time delivery rates
- Task completion patterns
- Developer performance metrics

And generates natural language summaries describing performance trends.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (MVC architecture)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with role-based access control
- **Security**: Helmet.js, bcrypt password hashing, CORS
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Build Tool**: Vite
- **Framework**: React 18
- **Styling**: TailwindCSS + Bootstrap
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: React Icons

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Validators, helpers
│   │   └── app.js          # Express app entry
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # State management
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Personal_project
   ```

2. **Setup Backend**
   ```bash
   cd backend
   
   # Install dependencies
   npm install
   
   # Create environment file
   cp .env.example .env
   
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   
   # Install dependencies
   npm install
   ```

4. **Seed the Database (Optional)**
   ```bash
   cd ../backend
   npm run seed
   ```
   This creates sample users and projects for testing.

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs at `http://localhost:5000`

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs at `http://localhost:5173`

4. **Access API Documentation**
   Open `http://localhost:5000/api-docs` in your browser

## Sample Credentials

After running the seeder, use these credentials:

### Manager Account
- **Email**: manager@example.com
- **Password**: Manager123!

### Developer Accounts
- **Email**: dev1@example.com / **Password**: Developer123!
- **Email**: dev2@example.com / **Password**: Developer123!
- **Email**: dev3@example.com / **Password**: Developer123!

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user profile |
| GET | `/api/auth/developers` | List all developers |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get user's projects |
| POST | `/api/projects` | Create project (Manager) |
| GET | `/api/projects/:id` | Get project details |
| PUT | `/api/projects/:id` | Update project (Manager) |
| DELETE | `/api/projects/:id` | Delete project (Manager) |
| POST | `/api/projects/:id/assign` | Assign developers (Manager) |
| POST | `/api/projects/:id/phases` | Add phase (Manager) |

### Phases
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/phases/:id` | Get phase details |
| PUT | `/api/phases/:id` | Update phase status |
| DELETE | `/api/phases/:id` | Delete phase (Manager) |
| POST | `/api/phases/:id/comments` | Add comment |
| GET | `/api/phases/:id/comments` | Get comments |

### AI Summaries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ai/summary/me` | Get my performance |
| GET | `/api/ai/summary/developer/:id` | Get developer summary (Manager) |
| GET | `/api/ai/summary/project/:id` | Get project summary |

## AI Performance Logic

The AI module analyzes developer performance by:

1. **Completion Metrics**
   - Total phases assigned
   - Completed vs pending phases
   - Completion rate percentage

2. **Time Analysis**
   - Comparing deadline dates with actual completion dates
   - Calculating on-time delivery rate
   - Identifying delays and average delay duration

3. **Summary Generation**
   - Natural language description of performance
   - Highlights strengths and areas for improvement
   - Provides actionable insights

### Example AI Summary Output
```
"John completed 8 out of 10 assigned phases. 6 were delivered on time 
(75% on-time rate). Shows strong performance in backend tasks but 
occasionally delays frontend work."
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/project_management
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=24h
CORS_ORIGIN=http://localhost:5173
```

## Architecture Decisions

### SOLID Principles Applied
- **Single Responsibility**: Separate controllers, services, and models
- **Open/Closed**: Role-based middleware is extensible
- **Dependency Inversion**: Services abstract database operations

### Security Measures
- Password hashing with bcrypt (12 rounds)
- JWT tokens with 24-hour expiration
- HTTP security headers via Helmet.js
- Input validation with express-validator
- Role-based access control

### Frontend Architecture
- Component-based UI with reusable elements
- Context API for state management (simpler than Redux for this scale)
- Protected routes with role-based access
- Responsive design with Tailwind utilities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
