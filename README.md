## 🌐 Live Demo

🔗 **Live Application:** [Trello Lite](https://trello-lite-tqso.vercel.app)

# 🚀 Trello Lite
Trello Lite is a full-stack project management application built with
the MERN stack. It helps users manage projects and tasks through a clean
dashboard, Kanban board, notifications, profile management, and secure
authentication.

## ✨ Features

-   User registration and login
-   JWT-based authentication and protected routes
-   Forgot and reset password functionality
-   Create and manage projects
-   Create and manage tasks
-   Kanban board for task organization
-   Notifications with unread count
-   User profile management
-   Profile picture upload
-   Change password
-   Dark and light mode
-   Responsive mobile sidebar and layout

## 🛠️ Tech Stack

### Frontend

-   React.js
-   Vite
-   React Router DOM
-   Axios
-   Tailwind CSS
-   React Icons
-   React Hot Toast

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT
-   bcryptjs

### Deployment

-   Frontend: Vercel
-   Backend: Render
-   Database: MongoDB Atlas

## 📁 Project Structure

``` text
trello-lite/
├── client/                 # React frontend
│   ├── src/
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

``` bash
git clone https://github.com/Sa49733/trello-lite.git
cd trello-lite
```

### 2. Install backend dependencies

``` bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

``` env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
```

Start the backend:

``` bash
npm run dev
```

### 3. Install frontend dependencies

Open another terminal:

``` bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

``` env
VITE_API_URL=your_backend_api_url
```

Start the frontend:

``` bash
npm run dev
```

## 🔐 Security

-   Passwords are hashed using bcryptjs.
-   Protected routes use JSON Web Tokens (JWT).
-   Sensitive credentials are stored in environment variables.
-   Never commit `.env` files, database credentials, email app
    passwords, or secret keys to GitHub.

## 📱 Responsive Design

Trello Lite includes a responsive layout with a mobile-friendly
navigation sidebar, allowing the application to be used on both desktop
and mobile devices.

## 🚀 Deployment

The frontend can be deployed on Vercel and the backend on Render. Add
all required environment variables to the deployment platform before
deploying.

## 👨‍💻 Author

**Saurabh Yadav**

-   GitHub: `Sa49733`

## 📄 License

This project is created for learning and portfolio purposes.
