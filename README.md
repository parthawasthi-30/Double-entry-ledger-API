# Double-Entry-Ledger-API

An advanced, scalable backend ledger API built using **Node.js, Express.js, and MongoDB**, designed to handle secure financial transactions and maintain accurate accounting records.

The application follows the **Double-Entry Bookkeeping System**, ensuring that every financial transaction has corresponding debit and credit entries. It focuses on data consistency, transaction reliability, security, and fault tolerance.

### Key Features

- **JWT Authentication & Authorization:** Secure user authentication using JSON Web Tokens.
- **Double-Entry Accounting:** Maintains balanced debit and credit entries for every transaction.
- **Idempotent Transactions:** Prevents duplicate financial operations using unique idempotency keys.
- **MongoDB Transactions:** Uses MongoDB sessions to ensure atomicity and consistency.
- **Account Management:** Create and manage user accounts and ledger balances.
- **Transaction History:** Maintains detailed records of financial activities.
- **Email Notifications:** Sends transaction-related email notifications.
- **Input Validation:** Validates incoming requests to prevent invalid transactions.
- **Error Handling:** Centralized error-handling middleware for consistent API responses.
- **Secure API Endpoints:** Protects sensitive routes using authentication middleware.

### Advanced Backend Concepts

- ACID transaction principles.
- Atomic financial operations.
- Database consistency and integrity.
- RESTful API architecture.
- Middleware-based request processing.
- Secure password hashing.
- Environment-based configuration.
- Prevention of duplicate transaction processing.

### Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT
- **Password Security:** bcrypt
- **Notifications:** Nodemailer
- **API Testing:** Postman
- **Version Control:** Git & GitHub

### Project Objective

The primary objective of this project is to understand how real-world financial systems handle transactions, maintain accurate accounting records, prevent duplicate operations, and ensure database consistency under concurrent requests.

The project demonstrates practical backend engineering skills by implementing financial business logic rather than relying on basic CRUD operations.
