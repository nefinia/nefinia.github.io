# SensoryVerse Project Structure

This document provides an overview of the SensoryVerse project organization for development and business purposes.

## Directory Structure

```
SensoryVerse/
├── 📄 Documentation
│   ├── README.md              # Project overview and technical specs
│   ├── BUSINESS_PLAN.md       # Startup strategy and financial planning
│   ├── DEPLOYMENT.md          # Hosting and deployment guide
│   └── PROJECT_STRUCTURE.md   # This file
│
├── 🌐 Web Application
│   ├── index.html             # Main landing page
│   ├── quiz.html              # Personality assessment interface
│   ├── games.html             # Games hub and navigation
│   │
│   ├── 🎮 Interactive Games
│   ├── echopattern.html       # Memory/perception challenge
│   ├── sound_focus.html       # Attention/reaction game
│   ├── quick_reframe.html     # Mental flexibility test
│   └── memory_match.html      # Memory comparison game
│
├── 🧠 Assessment Engine
│   ├── quiz.js                # Quiz logic and flow control
│   ├── NeuroSky_Profiles.js   # Personality type definitions
│   └── types_tips.js          # Personalized learning advice
│
└── 🎨 Assets & Branding
    ├── SensoryVerse.png       # Logo and favicon
    ├── images/                # Additional visual assets
    └── [CSS embedded in HTML] # Styling and design
```

## Component Responsibilities

### Core Platform (`index.html`)
- **Purpose**: Main entry point and brand introduction
- **Features**: Navigation, branding, call-to-action
- **Audience**: First-time visitors, general public

### Assessment System
#### Quiz Interface (`quiz.html`)
- **Purpose**: Interactive personality assessment
- **Features**: Progress tracking, responsive design, results display
- **Integration**: Uses `quiz.js`, `NeuroSky_Profiles.js`, `types_tips.js`

#### Quiz Engine (`quiz.js`)
- **Purpose**: Assessment logic and user interaction
- **Features**: Question flow, scoring algorithm, result calculation
- **Data**: Manages user responses and profile matching

#### Personality Profiles (`NeuroSky_Profiles.js`)
- **Purpose**: Comprehensive personality type definitions
- **Features**: 8-dimensional cognitive profiles, detailed descriptions
- **Usage**: Referenced by quiz results and tip generation

#### Learning Tips (`types_tips.js`)
- **Purpose**: Personalized advice system
- **Features**: Type-specific and combination advice
- **Application**: Post-assessment guidance and insights

### Games Platform (`games.html`)
#### Hub Interface
- **Purpose**: Games discovery and navigation
- **Features**: Game descriptions, unified branding
- **Design**: Card-based layout with clear calls-to-action

#### Individual Games
1. **EchoPattern** (`echopattern.html`)
   - Memory and perception testing
   - Audio-visual sequence challenges
   - Performance tracking and adaptation

2. **Sound Focus** (`sound_focus.html`)
   - Attention and reaction time measurement
   - Progressive difficulty environments
   - Accuracy and speed analytics

3. **Quick Reframe** (`quick_reframe.html`)
   - Cognitive flexibility assessment
   - Rule-switching challenges
   - Mental agility training

4. **Memory Match** (`memory_match.html`)
   - Memory preference identification
   - Visual vs. verbal memory testing
   - Comparative performance analysis

## Development Workflow

### File Dependencies
```
index.html (standalone)
├── SensoryVerse.png

quiz.html
├── quiz.js
├── NeuroSky_Profiles.js
├── types_tips.js
└── SensoryVerse.png

games.html (standalone)
├── SensoryVerse.png

[individual games] (each standalone)
└── SensoryVerse.png (optional)
```

### Code Architecture

#### Frontend Framework: Vanilla JavaScript
- **Rationale**: No dependencies, fast loading, maximum compatibility
- **Benefits**: Easy deployment, reduced complexity, better performance
- **Trade-offs**: More manual coding, limited advanced features

#### Styling Approach: Embedded CSS
- **Current**: Styles embedded in HTML `<style>` tags
- **Benefits**: Single-file components, no external dependencies
- **Future**: Consider extracting to separate CSS files for maintainability

#### Data Storage: LocalStorage
- **Purpose**: User preferences and basic analytics
- **Scope**: Browser-local, temporary storage
- **Future**: Consider backend integration for persistence

## Business Organization

### Intellectual Property
- **Code**: Proprietary (CosmoVentures)
- **Branding**: SensoryVerse trademark (pending)
- **Content**: Original assessment methodology
- **Dependencies**: None (self-contained)

### Quality Assurance

#### Testing Strategy
- **Manual Testing**: Cross-browser compatibility
- **User Testing**: Cognitive assessment validation
- **Performance**: Load time optimization
- **Accessibility**: WCAG compliance checking

#### Security Considerations
- **Data Privacy**: No sensitive data collection
- **Client-Side**: All processing in browser
- **Third-Party**: Ko-fi integration only
- **Future**: GDPR compliance for EU users

### Maintenance Responsibilities

#### Regular Tasks
- [ ] Browser compatibility testing
- [ ] Performance monitoring
- [ ] User feedback integration
- [ ] Content updates and improvements

#### Quarterly Reviews
- [ ] Analytics analysis
- [ ] Feature usage evaluation
- [ ] Competitive analysis
- [ ] Technical debt assessment

## Scaling Roadmap

### Phase 1: Current State
- Static web application
- Client-side processing
- Basic analytics
- Free access model

### Phase 2: Enhanced Platform
- User account system
- Progress tracking
- Premium features
- Payment integration

### Phase 3: Full Platform
- Backend API
- Mobile applications
- Advanced analytics
- Enterprise features

## Development Setup

### Local Environment
```bash
# Minimal setup - any HTTP server
cd SensoryVerse
python3 -m http.server 8080
# Access: http://localhost:8080
```

### Version Control
```bash
# Current repository structure
nefinia.github.io/
├── SensoryVerse/    # This project
├── other-projects/  # Additional portfolio items
└── main-site/       # Personal website files
```

### Deployment Options
- **GitHub Pages**: Free, automatic
- **Netlify**: Professional, features
- **Custom Domain**: Branding optimization
- **CDN**: Global performance

---

*This structure document should be updated as the project evolves and new components are added.*