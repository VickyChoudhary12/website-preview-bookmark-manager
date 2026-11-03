# Website URL Preview & Bookmark Manager

A full-stack web application that allows users to register, log in, generate visual previews of websites, and save their favorite website URLs as bookmarks.

## Features

- User registration and login.
- JWT-based authentication.
- Password hashing using bcrypt.
- Submit website URLs to generate visual previews.
- Automated screenshot capture using Playwright and Chromium.
- Save website URLs and screenshot paths in SQLite.
- Display saved websites in a dashboard.
- User-specific bookmark retrieval.
- Responsive React user interface.

## Technology Stack

**Frontend**
- React.js
- Vite
- React Router
- Axios
- CSS
- Lucide React

**Backend**
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite
- JWT Authentication
- Passlib / bcrypt
- Playwright
- Chromium

## Project Structure

```text
website-preview-app/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── screenshots/
│   ├── tests/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md
```

## Prerequisites

Install the following:

- Python 3.10 or later
- Node.js and npm
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd website-preview-app
```

### 2. Backend setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

**Windows:**

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

**Linux/macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Install the Playwright Chromium browser:

```bash
python -m playwright install chromium
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

Backend URL:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend URL:

http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API status |
| GET | `/health` | Health check |
| POST | `/auth/signup` | Register a user |
| POST | `/auth/login` | Authenticate a user |
| POST | `/websites/preview` | Generate and save a website preview |
| GET | `/websites/` | Retrieve authenticated user's saved websites |

Protected endpoints require a JWT Bearer token.

## Application Workflow

1. User registers or logs into the application.
2. Backend validates credentials and generates a JWT access token.
3. User submits a website URL through the dashboard.
4. FastAPI validates the URL and verifies authentication.
5. Playwright launches headless Chromium and opens the submitted website.
6. A screenshot is captured and saved in the backend screenshots directory.
7. Website information and screenshot path are saved in SQLite.
8. The frontend retrieves saved website records and displays visual preview cards.

## Database Design

### Users

Stores user account information:
- id
- name
- email
- hashed_password
- created_at

### Websites

Stores saved website information:
- id
- user_id
- url
- screenshot_path
- created_at

Each website record is associated with its owner through a foreign key.

## Security Considerations

- Passwords are stored as bcrypt hashes.
- JWT tokens protect authenticated API endpoints.
- Backend URL validation includes initial protection against private and internal network addresses.
- Website records are retrieved using the authenticated user's ID.

Additional production hardening is required for SSRF protection, secret management, and private screenshot access.

## Future Improvements

- Frontend signup page.
- Delete and manage saved bookmarks.
- Improved screenshot handling for websites with complex navigation.
- Pagination and search functionality.
- Production deployment.
- Stronger SSRF protection and secure screenshot storage.

## Author

Developed as a full-stack development assignment using React, FastAPI, SQLite, and Playwright.