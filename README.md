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
- **JWT** - JSON Web Tokens for authentication
- **Zod** - TypeScript-first schema validation
- **CORS** - Cross-Origin Resource Sharing support

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
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
   npm install

   # Create a .env file in the backend directory with:
   # MONGODB_URI=your_mongodb_connection_string
   # JWT_SECRET=your_jwt_secret
   # PORT=3000 (or your preferred port)
   ```

3. **Set up the Frontend**

   ```bash
   cd ../frontend
   npm install

   # Create a .env file in the frontend directory with:
   # VITE_BACKEND_URL=http://localhost:3000
   ```

## 🏃‍♂️ Running the Application

1. **Start the Backend**

   ```bash
   cd backend
   npm run dev
   ```

   The backend will be available at `http://localhost:3001`

2. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
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

#### Sign In 🔓

```http
POST /app/v1/signin
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
  "token": "jwt_token_here"
}
```

### Content Management

#### Get All Content 🔒

```http
GET /app/v1/content
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

#### Add New Content 🔒

```http
POST /app/v1/content
```

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

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

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

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

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

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
