<div align="center">
  <h1>OSI Drive</h1>
  <p>Secure Cloud Storage Solution with Real-time Collaboration</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![Convex](https://img.shields.io/badge/Convex-5C4DEE?style=flat&logo=convex&logoColor=white)](https://www.convex.dev/)
  [![Clerk](https://img.shields.io/badge/Clerk-000000?style=flat&logo=clerk&logoColor=white)](https://clerk.com/)

  <img src="https://img.shields.io/github/languages/code-size/yourusername/osi-drive" alt="Code Size" />
  <img src="https://img.shields.io/github/commit-activity/m/yourusername/osi-drive" alt="Commit Activity" />
</div>

## 🚀 Features

- **Secure File Storage**: Store and manage your files with end-to-end encryption
- **Real-time Collaboration**: Work together with team members in real-time
- **Organization Management**: Create and manage teams with role-based access control
- **File Previews**: View common file types directly in the browser
- **Responsive Design**: Access your files from any device
- **Search & Organization**: Quickly find files with powerful search and tagging

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: React Query, Context API
- **Backend**: Convex (Serverless)
- **Authentication**: Clerk
- **Database**: Convex (Built on FoundationDB)
- **File Storage**: Convex File Storage
- **Hosting**: Vercel

## 📦 Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Convex account (for backend services)
- Clerk account (for authentication)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/osi-drive.git
   cd osi-drive
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 🏗️ Project Structure

```
osi-drive/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   ├── dashboard/          # Dashboard pages
│   │   ├── _components/    # Reusable components
│   │   └── files/          # File management
├── components/             # Global components
│   └── ui/                 # UI components
├── convex/                 # Convex backend
│   ├── files.ts            # File operations
│   └── schema.ts           # Database schema
├── public/                 # Static files
└── types/                  # TypeScript type definitions
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx convex dev` - Start Convex development server

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Convex](https://www.convex.dev/) - The fullstack TypeScript development platform
- [Clerk](https://clerk.com/) - Authentication and User Management
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework

