# Study Notes Sharing Platform

A web platform for students to upload, share, and access study notes easily. Users can upload documents to Cloudinary, preview them online, and download or like them.

## Live Demo

[Visit Deployed App](https://notes-sharing-system12.vercel.app/) 

## Features

- **Upload & Share Notes** – Users can upload notes and store them on Cloudinary.
- **Preview Documents** – View notes online before downloading.
- **Like & Download** – Engage with notes by liking and downloading them.
- **User Authentication** – Secure login and signup with JWT & cookies.
- **OTP Verification** – Users need to verify OTP during signup.
- **Password Reset** – Users can reset their passwords via email verification.
- **Search & Filter** – Find notes by subject, semester, and more.

## Tech Stack

### Frontend
- React.js
- Redux Toolkit
- React Router DOM
- TailwindCSS
- Axios
- React Hot Toast
- React Icons
- React Spinners
- Redux Persist
- Framer Motion
- JWT Decode
- JS Cookie

### Backend
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- Cloudinary for File Storage
- JWT Authentication with Cookies
- Multer for File Uploads
- Nodemailer for Email Services

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/manoj2990/Notes-Sharing-System.git
   cd Notes-Sharing-System
   ```

2. Backend Setup:
   ```sh
   cd Backend
   npm install
   npm start
   ```

3. Frontend Setup:
   ```sh
   cd Frontend
   npm install
   npm start
   ```

4. Environment Variables:
   Create a `.env` file in both backend and frontend.
   ```env
   # Backend
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret
   PORT=your_backend_port
   MAIL_HOST=your_mail_host
   MAIL_USER=your_mail_user
   MAIL_PASS=your_mail_pass
   FRONTEND_URL=http:

   # Frontend
   REACT_APP_BACKEND_URL=
   ```

## API Endpoints

### Authentication Routes
| Method | Endpoint                 | Description          |
|--------|--------------------------|----------------------|
| POST   | `/signup`                | User signup         |
| POST   | `/login`                 | User login          |
| POST   | `/logout`                | User logout         |
| POST   | `/verify-otp`            | Verify OTP          |
| POST   | `/resend-otp`            | Resend OTP          |
| POST   | `/forgot-password`       | Forgot password     |
| POST   | `/reset-password/:userId/:token` | Reset password |

### Notes Routes
| Method | Endpoint                  | Description        |
|--------|---------------------------|--------------------|
| GET    | `/getNotes`               | Fetch all notes   |
| GET    | `/notes`                  | Search notes      |
| POST   | `/uploadNote`             | Upload new note   |
| DELETE | `/deleteNotes/:id`        | Delete a note     |

### Like Routes
| Method | Endpoint                     | Description     |
|--------|------------------------------|-----------------|
| POST   | `/toggle-like/:id`           | Like/Unlike a note |



## Database Models

### User Model

| Field      | Type    | Required | Unique | Default |
|------------|--------|----------|--------|---------|
| username   | String | Yes      | No     | -       |
| email      | String | Yes      | Yes    | -       |
| password   | String | Yes      | No     | -       |
| year       | String | Yes      | No     | -       |
| branch     | String | Yes      | No     | -       |
| otp        | String | No       | No     | -       |
| otpExpiry  | Date   | No       | No     | -       |
| isVerified | Boolean| No       | No     | false   |
| status     | String | No       | No     | pending |


### Note Model

| Field        | Type       | Required | Unique | Default |
|-------------|-----------|----------|--------|---------|
| subject     | String    | Yes      | No     | -       |
| forClass    | String    | Yes      | No     | -       |
| unit        | Number    | Yes      | No     | -       |
| semester    | Number    | Yes      | No     | -       |
| fileSize    | Number    | Yes      | No     | -       |
| fileType    | String    | Yes      | No     | -       |
| file        | String    | Yes      | No     | -       |
| documentType| String    | Yes      | No     | -       |
| uploadedBy  | ObjectId  | Yes      | No     | -       |
| likes       | Array     | No       | No     | []      |


## Folder Structure

```
/Notes-Sharing-System
│── /Frontend (Frontend Code)
│   ├── /src
│   │   ├── /components (UI Components)
│   │   ├── /pages (Page Components)
│   │   ├── /redux (Redux Store & Slices)
│   │   ├── /utils (Helper Functions)
│   │   ├── /assets (Static Files)
│── /Backend (Backend Code)
│   ├── /models (MongoDB Schemas)
│   ├── /routes (API Endpoints)
│   ├── /controllers (Business Logic)
│   ├── /middleware (Middleware Functions)
│   ├── /utils (Utility Functions)
│── .gitignore
│── README.md
│── package.json
```

## Deployment

1. **Frontend Deployment on Vercel:**
   ```sh
   vercel deploy --prod
   ```

2. **Backend Deployment on Vercel:**
   ```sh
   vercel deploy --prod
   ```

## Contributing

Feel free to fork the repo, create a new branch, and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For queries, reach out to me at [LinkedIn] (https://www.linkedin.com/in/manoj-krumar/)
