# 🎉 Viatge Sorpresa - Surprise Trip Planner

A festive, Mediterranean-themed questionnaire app for organizing surprise trips! Users can select their name, choose locations on interactive maps, and leave notes for trip planning.

## ✨ Features

- **🎯 4-Step Questionnaire Flow**
  - Name selection from Firebase database
  - Interactive map location selection (2 steps)
  - Notes and comments input
- **🗺️ Interactive Maps**
  - Clickable Leaflet maps with location pins
  - Reverse geocoding for city/country names
  - Default Barcelona location
- **🎨 Beautiful UI**
  - Mediterranean, festive design theme
  - Mobile-first responsive layout
  - Smooth animations and transitions
- **🔥 Firebase Integration**
  - Real-time database for user management
  - Automatic response storage
  - Prevents duplicate submissions
- **📱 Mobile Optimized**
  - No-scroll design
  - Touch-friendly interface
  - Responsive across all devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd viatge-sorpresa

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **Maps**: Leaflet + React-Leaflet
- **Database**: Firebase Realtime Database
- **Routing**: React Router DOM
- **State Management**: React Context API

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── pages/              # Main application pages
├── services/           # Firebase and API services
├── assets/             # Static assets
└── App.tsx            # Main application component
```

## 🎯 Usage

1. **User Selection**: Choose your name from the dropdown
2. **First Location**: Click on the map to select where you think the trip will be
3. **Second Location**: Click on the map to select your dream destination
4. **Notes**: Add any additional comments or preferences
5. **Submit**: Complete the questionnaire and get your countdown!

## 🔧 Configuration

### Firebase Setup
Update `src/firebase.ts` with your Firebase configuration:
```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};
```

### Database Structure
The app expects the following Firebase structure:
```
/users
  - 0: "User Name 1"
  - 1: "User Name 2"
  - ...

/respostes
  - [auto-generated-id]
    - name: "User Name"
    - lat_1: 41.3851
    - lon_1: 2.1734
    - lat_2: 48.8566
    - lon_2: 2.3522
    - notes: "User notes"
    - timestamp: 1703123456789
```

## 🎨 Design Theme

- **Colors**: Mediterranean blues, warm oranges, and golden accents
- **Typography**: Fredoka One for titles, Poppins for body text
- **Style**: Festive, mysterious, and playful
- **Animations**: Smooth transitions and hover effects

## 📱 Mobile Features

- **No-scroll design**: Everything fits in viewport
- **Touch-optimized**: Large touch targets
- **Responsive maps**: Full-screen map interaction
- **Fast loading**: Optimized for mobile networks

## 🚀 Deployment

The app is ready for deployment on:
- Vercel
- Netlify
- Firebase Hosting
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ for surprise trip planning! 🗺️✨**
