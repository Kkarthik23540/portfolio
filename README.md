# 🚀 K Karthik Reddy — Personal Portfolio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://kurmathikarthikreddy-portfolio.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Kkarthik23540-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Kkarthik23540/portfolio)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-K_Karthik_Reddy-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com)
[![License](https://img.shields.io/badge/License-MIT-teal?style=for-the-badge)](LICENSE)

A modern, high-performance, and responsive personal portfolio website crafted for **K Karthik Reddy**, Computer Science Engineering graduate from Jaya Prakash Narayan College of Engineering (JNTUH). Designed with an engineering-first mindset, micro-interactions, clean glassmorphism aesthetics, dynamic dark/light mode, and fluid responsiveness.

---

## 🌟 Live Demo

Explore the live portfolio at:  
👉 **[https://kurmathikarthikreddy-portfolio.vercel.app/](https://kurmathikarthikreddy-portfolio.vercel.app/)**

---

## ✨ Key Highlights & Features

### 🎨 Visual & Interactive Experience
- **Interactive Dot Mesh Canvas:** Custom HTML5 canvas engine rendering a dynamic coordinate mesh with cursor-following constellations, proximity glows, and card-boundary repulsion.
- **Dynamic Card Spotlight Effect:** Mouse-tracking radial gradient overlays that follow pointer movement over project, skill, and certification cards.
- **Hero Typewriter Effect:** Character-by-character typewriter animation for heading presentation with automatic cursor blink.
- **Animated Numerical Statistics:** Animated metric counters powered by cubic easing (`easeOutCubic`) triggering upon scroll entry.
- **Scroll Progress Indicator:** Real-time top progress bar tracking reading completion.
- **Seamless Dark & Light Themes:** Instant zero-flash theme persistence via `localStorage` and `prefers-color-scheme`, complete with animated SVG toggle iconography.

### 📱 Architecture & Performance
- **Zero-Dependency Vanilla Core:** Built using vanilla modern JavaScript (ES6+), semantic HTML5, and modular CSS with CSS custom properties (variables) — bundled with **Vite** for ultra-fast load times.
- **Section-Wise CSS Architecture:** Clean, modular stylesheet partitioned into 18 organized segments with detailed comment banners for effortless maintenance.
- **Responsive Layout System:** Engineered with CSS Grid and Flexbox across desktop, tablet, and mobile breakpoints (1200px, 1024px, 900px, 860px, 768px, 600px, and 480px).
- **Asynchronous AJAX Contact Form:** Client-side input validation, error alerts, loading state spinners, and smooth async feedback.
- **Accessibility & Reduced Motion:** Full compliance with `prefers-reduced-motion`, semantic heading structure, focus states, and comprehensive ARIA labeling.
- **SEO & Social Optimization:** Pre-configured with Open Graph metadata, Twitter Cards, JSON-LD Schema.org structured data, XML sitemap, and Google Search Console verification.

---

## 📂 Sections Overview

| Section | Description |
| :--- | :--- |
| **Hero** | Personal introduction, typewriter headline, quick stats panel, call-to-action buttons, and availability badge. |
| **About** | Academic background from JNTUH, engineering focus, and core technical interests. |
| **Skills** | Categorized technical competencies: Programming, Web Technologies, Frameworks & Libraries, Databases, Mobile App Dev, and Tools. |
| **Education** | Academic milestones: B.Tech (CSE), Intermediate (MPC), and Secondary School Certificate (SSC). |
| **Projects** | Featured software projects: **DineSpot** (Restaurant Booking), **Human Stress Detection** (Machine Learning), and **Mobile App Development** (Flutter). |
| **Certifications** | Industry credentials: Flutter Development Internship (Excelerate) and Introduction to Cyber Security (CISCO Networking Academy). |
| **Contact** | Direct outreach form with live validation alongside direct GitHub and LinkedIn profile links. |

---

## 🛠️ Tech Stack

- **Markup:** HTML5 (Semantic & SEO structured)
- **Styling:** Modern CSS3 (Variables, Grid, Flexbox, Glassmorphism, Keyframes)
- **Scripting:** Modern JavaScript (ES6+ Modules, HTML5 Canvas API, IntersectionObserver)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Analytics:** [@vercel/analytics](https://vercel.com/analytics)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 📁 Repository Structure

```text
portfolio/
├── index.html              # Main HTML entry with semantic markup & SEO metadata
├── styles.css              # 18-section structured modular CSS stylesheet
├── script.js               # Canvas animations, theme switching & interaction logic
├── package.json            # Project manifest & build scripts
├── vite.config.js          # Vite build tool configuration
├── public/                 # Static assets served at root
│   ├── favicon.svg         # Modern vector favicon
│   ├── og-image.png        # Social sharing banner (Open Graph & Twitter)
│   ├── robots.txt          # Search engine crawler instructions
│   └── sitemap.xml         # XML sitemap for SEO discovery
└── README.md               # Project documentation
```

---

## 💻 Local Development Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 1. Clone the repository
```bash
git clone https://github.com/Kkarthik23540/portfolio.git
cd portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start local development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application with Hot Module Replacement (HMR).

### 4. Build for production
```bash
npm run build
```
This compiles and bundles minified HTML, CSS, and JS into the `dist/` directory.

### 5. Preview the production build locally
```bash
npm run preview
```

---

## 📬 Contact & Connect

**K Karthik Reddy**  
- **GitHub:** [@Kkarthik23540](https://github.com/Kkarthik23540)  
- **Email:** [kkarthik23540@gmail.com](mailto:kkarthik23540@gmail.com)  
- **Portfolio:** [https://kurmathikarthikreddy-portfolio.vercel.app/](https://kurmathikarthikreddy-portfolio.vercel.app/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
