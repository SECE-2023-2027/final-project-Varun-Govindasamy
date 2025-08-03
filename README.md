# Personal Inspiration Gallery

A modern, responsive web application where users can create their personal collection of inspiring images, quotes, and media. Built with Next.js, Express.js, and MongoDB.

## ✨ Features

### 🔐 Authentication
- **User Registration & Login**: Secure JWT-based authentication
- **Persistent Sessions**: HTTP-only cookies for security
- **Password Hashing**: bcrypt for secure password storage

### 🖼️ Gallery Management
- **Upload Inspirations**: Add images with titles, descriptions, and tags
- **Smart Organization**: Tag-based categorization and search
- **Responsive Gallery**: Beautiful grid layout with hover animations
- **Image Storage**: Cloudinary integration for optimized image handling

### 🎨 Modern UI/UX
- **Dark Theme**: Elegant dark mode interface
- **Smooth Animations**: Framer Motion for fluid interactions
- **Mobile Responsive**: Optimized for all device sizes
- **Toast Notifications**: Real-time feedback for user actions

### 🔍 Advanced Features
- **Search & Filter**: Find inspirations by title, description, or tags
- **Drag & Drop Upload**: Intuitive file upload experience
- **Modal View**: Full-screen inspiration viewing
- **Edit & Delete**: Complete CRUD operations

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **Framer Motion** - Animation library
- **CSS Modules** - Scoped styling
- **React Hot Toast** - Notification system
- **React Dropzone** - File upload handling

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload middleware
- **Cloudinary** - Image storage and optimization

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (optional, for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal_information_gallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   Make sure MongoDB is running locally or use MongoDB Atlas

4. **Start the development servers**
   
   Terminal 1 - Backend:
   ```bash
   npm run server
   ```
   
   Terminal 2 - Frontend:
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
personal_information_gallery/
├── src/
│   └── app/
│       ├── components/          # Reusable UI components
│       │   ├── Navbar.js
│       │   └── Navbar.module.css
│       ├── context/            # React contexts
│       │   └── AuthContext.js
│       ├── gallery/            # Gallery page
│       │   ├── page.js
│       │   └── gallery.module.css
│       ├── login/             # Login page
│       │   ├── page.js
│       │   └── auth.module.css
│       ├── register/          # Register page
│       │   ├── page.js
│       │   └── auth.module.css
│       ├── upload/            # Upload page
│       │   ├── page.js
│       │   └── upload.module.css
│       ├── globals.css        # Global styles
│       ├── layout.js          # Root layout
│       ├── page.js           # Home page
│       └── page.module.css   # Home page styles
├── server/                   # Backend API
│   ├── models/              # Database models
│   │   ├── User.js
│   │   └── Inspiration.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   └── inspirations.js
│   ├── middleware/          # Custom middleware
│   │   └── auth.js
│   └── index.js            # Express server
├── public/                 # Static assets
├── .env                   # Environment variables
├── .env.example          # Environment template
├── package.json         # Dependencies and scripts
└── README.md           # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user

### Inspirations
- `GET /api/inspirations` - Get user's inspirations
- `POST /api/inspirations` - Create new inspiration
- `PUT /api/inspirations/:id` - Update inspiration
- `DELETE /api/inspirations/:id` - Delete inspiration

## 🎨 Design System

### Color Palette
- **Background**: `#0a0a0a` - Deep black
- **Card**: `#1a1a1a` - Dark gray
- **Primary**: `#6366f1` - Indigo blue
- **Secondary**: `#262626` - Medium gray
- **Destructive**: `#ef4444` - Red
- **Border**: `#262626` - Border gray

### Typography
- **Primary Font**: Geist Sans
- **Monospace**: Geist Mono

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Create a new service on Railway or Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy the backend service

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in environment variables

## 🧪 Testing

The application includes:
- Form validation on both client and server
- Error handling and user feedback
- Responsive design testing
- File upload validation
- Authentication flow testing

## 📈 Future Enhancements

- [ ] Google OAuth integration
- [ ] Public/Private inspiration toggle
- [ ] Social sharing features
- [ ] Inspiration categories
- [ ] Advanced search filters
- [ ] Bulk operations
- [ ] Export functionality
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Framer Motion for smooth animations
- Cloudinary for image optimization
- MongoDB for the flexible database solution

---

Built with ❤️ using Next.js, Express.js, and MongoDB
