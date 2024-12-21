# Bill Desk 📊

A powerful desktop application for managing bills, generating PDFs, and visualizing financial data with an intuitive dashboard.

## Features ✨

### Dashboard Analytics
- Real-time visualization of billing trends
- Monthly/yearly expense breakdown
- Category-wise spending analysis
- Interactive charts and graphs
- Quick summary of recent transactions

### Bill Management
- Create and edit bills with a user-friendly interface
- Categorize bills by type, date, and status
- Search and filter functionality
- Bulk operations support
- Data persistence using local storage

### PDF Generation & Management
- Generate professional PDF bills instantly
- Customizable bill templates
- Preview bills before generation
- Batch export capabilities
- Easy PDF viewing with integrated PDFJS

## Tech Stack 🛠️

- **Frontend Framework**: [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
  - Fast development and build times
  - Modern React features and hooks
  - Efficient hot module replacement

- **Desktop Framework**: [Electron](https://www.electronjs.org/)
  - Cross-platform desktop application
  - Native OS integration
  - File system access
  - Offline functionality

- **Styling**: [TailwindCSS](https://tailwindcss.com/)
  - Utility-first CSS framework
  - Responsive design
  - Custom theming support
  - Dark/Light mode

- **PDF Processing**: [PDF.js](https://mozilla.github.io/pdf.js/)
  - PDF generation and viewing
  - Document manipulation
  - Preview capabilities

## Installation 🚀

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bill-desk.git
cd bill-desk
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Create desktop executable:
```bash
npm run make
```

## Development Setup 💻

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_APP_NAME=Bill Desk
VITE_STORAGE_KEY=billdesk_storage
```

## Project Structure 📁
```
bill-desk/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── utils/
│   └── App.jsx
├── electron/
│   └── main.js
├── public/
└── package.json
```

## Local Storage 💾
The application uses browser's LocalStorage for data persistence:
- Bills and transactions data
- User preferences
- Application settings
- Dashboard configurations

## Contributing 🤝
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support 🆘
For support, please open an issue in the GitHub repository or contact the maintainers.
