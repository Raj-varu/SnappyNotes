# Contributing to SnappyNotes

Thank you for your interest in contributing to **SnappyNotes**! This project is maintained by [Raj Varu](https://github.com/Raj-varu).

## 🚀 Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/<your-username>/SnappyNotes.git
   cd SnappyNotes
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the local development server**:
   ```bash
   npm run dev
   ```

## 🛠️ Code Structure

- `electron/`: Main process and secure preload script.
- `src/`: React 18 + Vite frontend components, state management, and TipTap rich-text editor.
- `src/utils/zendeskClipboard.js`: Rich HTML to Zendesk-compatible clipboard formatter.
- `src/utils/searchEngine.js`: Fuse.js fuzzy search indexing and query handler.
- `build/`: Icon assets (`icon.ico`, `icon.png`).
- `public/`: Web assets and icons.
- `scripts/`: Release organization and utility automation scripts.

## 📦 Building & Testing

- `npm run build:renderer` – Compile the Vite frontend bundle.
- `npm run package` – Build both portable standalone and setup installer packages.
- `npm run package:portable` – Build portable standalone `.exe`.
- `npm run package:installer` – Build NSIS setup wizard `.exe`.

## 📜 Pull Request Guidelines

1. Create a descriptive feature branch: `git checkout -b feat/your-feature-name`.
2. Commit your changes with clear messages.
3. Push to your branch and open a Pull Request against `main`.
4. Ensure code formatting is clean and all build scripts pass.

---
Thank you for helping make SnappyNotes faster and better for everyone!
