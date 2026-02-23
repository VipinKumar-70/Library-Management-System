# Smart Library Management System

A modern **Smart Library Management System** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). This system allows students to **register, login, manage their books, track due dates, and receive notifications** in a secure and efficient way.

---

## 🌟 Features

- **User Authentication & Registration**
  - Email & password validation
  - Password hashing for security
  - Duplicate email or enrollment checks
  - Email verification system
- **Student Dashboard**
  - View borrowed books
  - Track due dates and fines
  - Notifications for overdue books
- **Admin Features (Optional)**
  - Manage students and books
  - Update fines and notifications
- **Responsive UI**
  - Modern design using **React + Tailwind CSS**
- **Backend**
  - RESTful API using **Node.js & Express**
  - Data storage with **MongoDB**
- **Security**
  - Password hashing using **bcrypt**
  - Proper input validation
  - Prevent duplicate users

---

## 💻 Tech Stack

| Layer          | Technology                                  |
| -------------- | ------------------------------------------- |
| Frontend       | React.js, Tailwind CSS, React Router DOM    |
| Backend        | Node.js, Express.js                         |
| Database       | MongoDB, Mongoose                           |
| Authentication | JWT (optional), Bcrypt for password hashing |
| API Requests   | Axios / Fetch API                           |

---

## 🚀 Installation & Setup

1. **Clone the repository:**

```bash
git clone https://github.com/<your-username>/smart-library.git
cd smart-library

```

2. **Backend Setup:**

```bash
cd Backend
npm install
# Create a .env file with:
# PORT=3000
# MONGO_URI=<your_mongodb_connection_string>
npm start

```

3. **Frontend Setup:**

```bash
cd Frontend
npm install
npm start

```

4. Open your browser at http://localhost:5173 (or your Vite/React dev port)

## 🛠 Usage

- Register a new student → email and enrollment must be unique
- Login using registered credentials
- Dashboard displays borrowed books, due dates, and fines
- Admin can manage students and books (if implemented)

## 🔒 Security & Validation

- Password must have:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one number
  - At least one special character
- Duplicate email or enrollment is blocked
- Passwords stored hashed in MongoDB

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request with your changes. Make sure to follow the standard coding conventions and best practices.

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details. [MIT License](LICENSE)

## 📩 Contact

If you have any questions or need further assistance, please don't hesitate to contact me at  
[Vipin Kumar](mailto:vipin70kr@gmail.com). I'll be happy to help!
