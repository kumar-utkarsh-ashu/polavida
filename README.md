# Pola Vida Website — Project Handover Manual

## 1. Project Overview
This repository contains the complete, production-ready frontend website for **Pola Vida** (Tantra, Healing & Transformation).
The project delivers **29 complete pages** with a dual-design toggle allowing instant switching between:
- **Design Version A (Faithful)**: Approved classical design structure with light headers, distinct warm container panels, and balanced layout hierarchy.
- **Design Version B (Immersive)**: Editorial layout featuring full-bleed hero visuals, transparent sticky navigation, deep burgundy backgrounds, and immersive aesthetic treatments.

The user's design preference is automatically persisted across navigation and page reloads via localStorage and URL parameter synchronization (`?v=a` / `?v=b`).

---

## 2. Directory Structure

```
Pola-Vida-Website-Handover-Updated/
│
├── index.html                   # Homepage (Dual Design, Video Slider)
├── about.html                   # About Pola Vida
├── tantra-for-all.html          # Core Tantra Philosophy
├── for-women.html               # Tantra for Women
├── for-men.html                 # Tantra for Men
├── for-couples.html             # Tantra for Couples
├── private-retreats.html        # Private Retreats & Coaching
├── tantra-coaching.html         # Somatic Coaching
├── retreats.html                # Retreats & Workshops Overview (Autoplay Retreat Video)
├── retreat.html                 # Single Retreat Detail Page
├── training.html                # Practitioner Training Journey (Modules 1-5 in Single Row)
├── events.html                  # Event Calendar & Schedule
├── shop.html                    # Courses, E-books & Audio (Sacred Geometry layered behind buttons)
├── product.html                 # Single Product Detail
├── courses.html                 # Online Video Courses Overview (Sacred Geometry layered behind buttons)
├── course.html                  # Single Course Syllabus
├── lesson.html                  # Online Course Video Player & Resources
├── testimonials.html            # Client Stories & Testimonials
├── contact.html                 # Contact & Inquiries Form
├── booking.html                 # Session Booking Flow
├── cart.html                    # Shopping Cart
├── checkout.html                # Checkout Experience
├── order-confirmed.html         # Order Confirmation & Next Steps
├── account.html                 # Member Dashboard
├── login.html                   # Account Login & Password Reset
├── privacy.html                 # Privacy Policy
├── terms.html                   # Terms & Conditions
├── imprint.html                 # Legal Notice / Imprint
├── 404.html                     # Custom 404 Error Page
│
├── assets/
│   ├── css/
│   │   └── style.css            # Consolidated stylesheet for Design A & Design B
│   ├── js/
│   │   └── main.js              # Core UI interactions, theme switcher, modal & cart logic
│   ├── img/                     # 126 photography, artwork, mandalas, and WebP icons
│   ├── video/                   # 4 MP4 video assets including background retreat video & testimonials
│   └── fonts/                   # Font documentation (fonts are embedded self-contained)
│
├── favicon.svg                  # Brand favicon (Vector SVG)
├── favicon.png                  # Brand favicon (High-resolution PNG)
├── favicon.ico                  # Brand favicon (Multi-resolution ICO)
├── robots.txt                   # Search crawler directives (noindex for staging)
├── netlify.toml                 # Static hosting configuration and cache headers
└── README.md                    # This handover document
```

---

## 3. Technologies & Frameworks
- **Zero-Dependency Architecture**: Pure HTML5, modern CSS3 (Custom Properties, Flexbox, Grid), and Vanilla JavaScript (ES6+).
- **Self-Contained Fonts**: Cormorant Garamond font assets are embedded as base64 within CSS; Jost is loaded via clean system fallbacks, requiring no third-party CDNs.
- **Embedded SVG Sprites**: UI icons and sacred geometry (Mandala & Sri Yantra symbols) are packaged directly within the markup for instant rendering with zero network latency.
- **Modern Media Standards**: Optimized WebP imagery with high-density srcset resolution fallbacks, and compressed H.264 MP4 videos.

---

## 4. How to Run the Website Locally

### Option 1: Direct File Access (No Server Required)
Simply double-click `index.html` or open any HTML file directly in any modern browser (Chrome, Safari, Firefox, Edge). All assets use relative paths.

### Option 2: Local HTTP Server (Recommended)
If using a local development server:

- **Using Python 3**:
  ```bash
  python -m http.server 8000
  ```
  Then open `http://localhost:8000` in your web browser.

- **Using Node.js (`npx serve`)**:
  ```bash
  npx serve .
  ```

- **Using VS Code Live Server**:
  Right-click `index.html` and choose **"Open with Live Server"**.

---

## 5. Deployment Guide
The website is 100% static and ready to deploy to any static hosting service:
- **Netlify**: Drag and drop the root folder into the Netlify Dashboard (or link repository). A `netlify.toml` file is already included.
- **Vercel / Cloudflare Pages / GitHub Pages**: Deploy directly without any build commands (`Build command: none`, `Output directory: .`).
- **Traditional Hosting (cPanel / Apache / Nginx)**: Upload all files directly to `public_html` or web root directory.

---

## 6. Key Features & Implementation Notes
1. **Interactive Design Switcher**:
   - Switch between **Design A** and **Design B** using the floating toggle button on the bottom corner of every page.
2. **Audio & Video Integration**:
   - Background video in Retreats (`assets/video/pola_vida_video.mp4`) features clean loop autoplay with zero overlay click interference.
   - Homepage video carousel includes the updated 1-minute client video testimonial (`assets/video/testimonial-1.mp4`).
3. **Cart & Booking Mock Flow**:
   - The cart (`cart.html`) and checkout flow preserve items in `localStorage` for complete prototype demonstrations.
4. **Maintenance**:
   - To update content, edit the text directly in the respective HTML file.
   - Global styling rules, colors, and typography variables can be updated in `assets/css/style.css`.
