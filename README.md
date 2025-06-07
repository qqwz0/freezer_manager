# Freezer Manager App

A **Freezer Manager** is a React-based web application that helps you organize and track items in your freezers. It utilizes **Firebase Firestore** for real-time data storage, **Tailwind CSS** and **Flowbite-React** for UI components, and **QR code** scanning for quick product lookup and editing.

---

## Features

* **Multiple Freezers**: Create, edit, and delete freezers.
* **Organize by Shelves**: Within each freezer, manage multiple shelves.
* **Product Management**: Add, edit, or delete products with details such as quantity, unit, category, freezing date, expiration date, and photo.
* **Expiration Tracking**: Visual indicators for expired, expiring soon, or fresh items.
* **QR Code Integration**: Generate and scan QR codes to quickly locate and edit products.
* **Dark/Light Mode**: Automatic theme toggle based on user preferences.
* **Responsive Design**: Mobile-friendly layout with adaptive components.
* **Toast Notifications**: Success and error feedback via **react-toastify**.

---

## Tech Stack

* **Frontend**: React, React Router
* **UI**: Tailwind CSS, Flowbite-React, Swiper.js
* **Backend**: Firebase Firestore (Authentication, CRUD operations)
* **State Management**: React Context & Hooks
* **Utilities**: react-toastify, html5-qrcode, date utilities

---

## Folder Structure

```
src/
├── assets/               # Static files: images, fonts, icons—importable by any feature
├── features/             # **Feature-first modules**, each encapsulates its own UI + logic
│   ├── auth/             # Authentication feature
│   │   └── components/   # Login, SignUp forms and related UI pieces
│   └── freezers/         # Freezer-management feature
│       ├── components/   # FreezerCarousel, Freezer, Shelf, ShelfProduct, ProductModal, etc.
│       └── hooks/        # Domain hooks: useFreezers, useCategories, etc.
├── pages/                # **Page-level** views (Home.jsx, Dashboard.jsx, Login.jsx, SignUp.jsx)
├── routes/               # Route wrappers and definitions (ProtectedRoute, PublicRoute, etc.)
├── services/             # External integrations: Firestore CRUD services, Cloudinary, QR, etc.
└── shared/               # **Cross-cutting** utilities, UI primitives, and generic hooks
    ├── hooks/            # Reusable hooks (useModal, useQrScanner, useAuth, etc.)
    ├── ui/               # Design-system components (Button, Modal, FormInput, Header, LoadingScreen)
    └── utils/            # Pure helper functions (date formatting, image utils, validation)
    
```

---

## Usage

1. **Sign Up / Login**: Create an account or log in.
2. **Dashboard**: View list of freezers in a carousel.
3. **Add Freezer**: Click **New Freezer**.
4. **Manage Shelves**: Inside a freezer, add/edit/delete shelves.
5. **Manage Products**: Add products to shelves, upload photos, set expiration.
6. **Scan QR Code**: Quickly locate a product by scanning its QR.

---

## Performance & Optimization

* **Code Splitting**: Lazy load `FreezerCarousel` component.
* **Memoization**: `React.memo`, `useMemo`, `useCallback` to prevent unnecessary re-renders.
* **Context**: Centralized `FreezerContext` to avoid prop drilling.

---

## Testing

> *Testing strategy coming soon...*

---

<sup>Built with ❤️ by Настя.</sup>
