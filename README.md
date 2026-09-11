# Second Brain Application

A modern web application for organizing and managing your digital content, from articles and videos to personal notes and resources on yt or twitter orlinkedIn using the respective links

## 🚀 Features

- **Content Organization**: Save and categorize various types of content (articles, videos, links)
- **Tagging System**: Organize content with custom tags for easy retrieval
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User Authentication**: Secure signup and login functionality
- **Content Sharing**: Share your collections with others via unique links
- **Modern UI**: Clean, intuitive interface built with modern design principles

## 🛠️ Tech Stack

### Frontend

- **React 19** - Latest React version with concurrent features
- **TypeScript** - Type-safe JavaScript for better developer experience
- **Vite** - Next-generation frontend tooling for fast development
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Zustand** - Lightweight state management solution
- **React Router** - Client-side routing
- **Axios** - Promise-based HTTP client

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** (via Mongoose) - NoSQL database for flexible data storage
- **JWT** - Short-lived access tokens and rotating refresh tokens stored in HttpOnly cookies
- **Zod** - TypeScript-first schema validation
- **CORS** - Cross-Origin Resource Sharing support

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v9 or higher)
- MongoDB (local or cloud instance)

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd second-brain-application
   ```

2. **Set up the Backend**

   ```bash
   cd backend
   pnpm install

   # Create a .env file in the backend directory with:
   ```

# MONGODB_URI=your_mongodb_connection_string

# ACCESS_TOKEN_SECRET=your_access_token_secret

# REFRESH_TOKEN_SECRET=your_refresh_token_secret

# FRONTEND_URL=http://localhost:5173

````

3. **Set up the Frontend**

```bash
cd ../frontend
pnpm install

# Create a .env file in the frontend directory with:
# VITE_BACKEND_URL=http://localhost:3001
````

## 🏃‍♂️ Running the Application

1. **Start the Backend**

   ```bash
   cd backend
   pnpm dev
   ```

   The backend will be available at `http://localhost:3001`

2. **Start the Frontend**
   ```bash
   cd frontend
   pnpm dev
   ```
   The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
second-brain-application/
├── backend/               # Backend server code
│   ├── src/               # Source files
│   ├── dist/              # Compiled TypeScript files
│   ├── .env               # Environment variables
│   └── package.json       # Backend dependencies
│
└── frontend/              # Frontend React application
    ├── public/            # Static files
    ├── src/               # Source files
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Page components
    │   ├── store/         # State management
    │   └── App.tsx        # Main application component
    └── package.json       # Frontend dependencies
```

## 📚 API Documentation

### Authentication

#### Sign Up 🔓

```http
POST /app/v1/signup
```

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

#### Login 🔓

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "message": "logging in....",
  "user": {
    "id": "user_id",
    "username": "username"
  }
}
```

The access token and refresh token are returned as cookies, not JSON fields:

- `accessToken`: HttpOnly cookie, valid for 15 minutes, scoped to `/`
- `refreshToken`: HttpOnly cookie, valid for 7 days, scoped to `/api/auth/refresh`
- `csrfToken`: readable cookie used with the `X-CSRF-Token` header for state-changing requests

Cookies are `SameSite=Strict` and use `Secure` in production. The legacy
`POST /app/v1/signin` route remains available for compatibility.

#### Refresh Session 🔒

```http
POST /api/auth/refresh
```

Refresh tokens are checked against the MongoDB `refresh_tokens` collection and
rotated after every successful request. Reuse of a revoked refresh token
revokes all refresh tokens for that user.

#### Get Current User 🔒

```http
GET /api/auth/me
```

#### Logout 🔒

```http
POST /api/auth/logout
```

The refresh-token record is revoked and all authentication cookies are cleared.

For `POST`, `PUT`, `PATCH`, and `DELETE` requests, send the value of the
`csrfToken` cookie in the `X-CSRF-Token` request header. Axios requests in the
frontend do this automatically.

### Content Management

#### Get All Content 🔒

```http
GET /app/v1/content
```

Authentication cookies must be included with the request.

#### Add New Content 🔒

```http
POST /app/v1/content
```

Authentication cookies and the `X-CSRF-Token` header are required.

**Request Body:**

```json
{
  "link": "string",
  "type": "youtube | twitter | linkedIn",
  "title": "string",
  "tags": ["string"]
}
```

#### Delete Content 🔒

```http
DELETE /app/v1/content
```

Authentication cookies, the `X-CSRF-Token` header, and `Content-Type: application/json` are required.

**Request Body:**

```json
{
  "contentId": "string"
}
```

### Sharing

#### Create Shareable Link 🔒

```http
POST /app/v1/brain/share
```

Authentication cookies, the `X-CSRF-Token` header, and `Content-Type: application/json` are required.

**Request Body:**

```json
{
  "share": true
}
```

**Response:**

```json
{
  "link": "unique_shareable_link"
}
```

#### View Shared Content 🔓 (No auth needed)

```http
GET /app/v1/brain/:sharelink
```

**URL Parameters:**

- `sharelink`: The unique shareable link ID

## 🤔 Why These Technologies?

- **React 19 + TypeScript**: Provides a robust, type-safe foundation for building maintainable UIs
- **Vite**: Offers lightning-fast development server and optimized builds
- **Tailwind CSS**: Enables rapid UI development with utility-first CSS
- **Zustand**: Simple yet powerful state management without the boilerplate of Redux
- **Node.js/Express**: Lightweight and efficient backend with great TypeScript support
- **MongoDB**: Flexible schema design perfect for varied content types
- **JWT**: Secure, stateless authentication
