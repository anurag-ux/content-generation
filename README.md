# AI Content Generator

A premium, clean light-mode Single Page Application (SPA) interface built with React, Vite, TypeScript, and Tailwind CSS. This client connects to an n8n webhook workflow to generate, preview, and organize editorial content and visual cover assets.

## ✨ Features

- **Intuitive Content Builder**: Choose a topic and configure your preferences for Content Type (Article, Guide, Opinion, Trend Analysis), Tone (Professional, Casual, Inspirational), and Image Style (Photographic, Minimalist, 3D Render).
- **Interactive Wireframe Previews**: View structural wireframes and example headlines updated in real-time as you switch formats before initiating a generation.
- **Auto-Scrolling Loader**: The view automatically focuses on the progressive status loader as soon as generation starts.
- **Two-Column Editorial Interface**: 
  - **Left Side**: Topic title, thematic cover image, and the markdown-parsed article with premium typographic styling (custom tables, blockquotes, and headers).
  - **Right Side**: A sticky sidebar containing Save Actions and a concise **Generation Summary** showing high-precision latency (`⚡ X.X sec` via `performance.now()`), parameters, and calculated **Word Count**.
- **Saved Content Vault**: Save your generated articles locally. Review them anytime using a master-detail history tab equipped with search, detail previews, delete triggers, and timing metrics.

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using light-mode aesthetics)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (with strict module syntax checking)
- **Markdown Parsing**: [Marked](https://marked.js.org/)

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/anurag-ux/content-generation.git
   cd content-generation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will run locally on [http://localhost:5173](http://localhost:5173).

### Production Build

To build the project for production, run:
```bash
npm run build
```
This runs TypeScript compiling (`tsc`) followed by Vite's build pipeline, exporting optimized static assets into the `dist/` directory.

## 🔗 API Integration

The API module at [src/services/api.ts](file:///Users/anurag/Desktop/content-generation/src/services/api.ts) dispatches payload requests directly to the production n8n webhook:
`https://proserv-tool.app.n8n.cloud/webhook/content-generator`

Payload schema sent:
```json
{
  "topic": "Your Topic Name",
  "contentType": "Article",
  "tone": "Professional",
  "imageStyle": "Minimalist"
}
```
Response format expected:
```json
{
  "text": "## Title\n\nArticle body in markdown format...",
  "imageUrl": "https://example.com/generated-image.jpg"
}
```
