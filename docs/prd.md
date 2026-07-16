# WardConnect Design PRD renamed to k-project

**Version:** 1.0
**Type:** UX/UI Design Product Requirements Document
**Platform:** Progressive Web App (PWA)
**Target Audience:** Primary: 40+ years old • Secondary: General Public (18–40)

---

# 1. Vision

Design a **modern, trustworthy, and accessible civic application** that allows residents to communicate with their ward office effortlessly.

WardConnect should feel like **the digital front desk of a ward office**, not a government website.

The experience should be:

* Simple enough for first-time smartphone users.
* Modern enough that younger users enjoy using it.
* Accessible for elderly users.
* Fast and uncluttered.

---

# 2. Design Principles

### Human First

Design for people, not government processes.

---

### Simplicity Over Features

One clear action per screen.

---

### Accessibility by Default

Accessibility should be integrated—not hidden in settings.

---

### Trustworthy

Users should feel confident that their complaint has been received and is being handled.

---

### Familiar

Follow Material Design interaction patterns with a neo-soft visual style.

---

# 3. Design Language

## Visual Style

* Material Design 3
* Neo-soft UI
* Rounded Components
* Soft Shadows
* Calm Colors
* Large Touch Targets
* Minimal Visual Noise

---

## Keywords

* Warm
* Friendly
* Modern
* Clean
* Calm
* Trustworthy
* Accessible
* Human

---

## Avoid

* Glassmorphism
* Neumorphism
* Cyberpunk
* Heavy Gradients
* Dashboard-style layouts
* Dense tables

---

# 4. Color System

Primary
* Forest Green

Secondary
* Emerald

Accent
* Teal

Success
* Green

Warning
* Amber

Danger
* Red

Background
* Warm Off White

Cards
* White

Text
* Charcoal

Border
* Light Gray

---

# 5. Typography

Primary Font
* Inter / Geist

Scale

Display
* 36

Heading
* 28

Title
* 22

Body
* 17

Small
* 15

Caption
* 13

Button
* 16 Medium

---

# 6. Navigation

Bottom Navigation

```
🏠 Home
🛠 Services
💬 Chat
👤 Profile
```

Persistent on every authenticated page.

---

# 7. Complete User Flow

```
Splash
↓
Language Selection
↓
Onboarding
↓
OTP Login
↓
Home
↓
Services
    ↓
Report Issue
    ↓
Choose Category
    ↓
Choose Issue
    ↓
Location
    ↓
Photo
    ↓
Voice/Text
    ↓
Review
    ↓
Success
↓
My Issues
↓
Chat
↓
Profile
```

---

# 8. Pages

---

# Splash Screen

Purpose
* Brand recognition.

Components
* Logo
* App Name
* Loading Animation

---

# Language Selection

Purpose
* Choose preferred language.

Components
* English
* Malayalam
* Continue

Future
* Tamil
* Hindi

---

# Onboarding (3 Screens)

Screen 1
* Report issues quickly.

Screen 2
* Stay updated with ward news.

Screen 3
* Connect directly with your councillor.

Buttons
* Skip
* Next
* Get Started

---

# Login

Purpose
* Authenticate resident.

Components
* Phone Number
* Send OTP
* OTP Verification
* Resend OTP
* Continue

---

# Home Dashboard

Purpose
* Central hub.

## Sections

### Greeting
* Good Morning
* Resident Name
* Ward Number

### Emergency Contacts
Quick Call Cards
* Police
* Ambulance
* Fire Force
* KSEB
* Water Authority
* Ward Office

### Broadcast Banner
* Pinned announcements.

Examples
* Water supply interruption.
* Emergency alert.
* Public notice.

### Latest News
* Scrollable cards.

Each card
* Image
* Title
* Date
* Read More

### Quick Actions
* Report Issue
* My Issues
* Chat
* Emergency Contacts

### Recent Issues
* Last 3 complaints.
* Status chip.
* View All button.

---

# Services

Purpose
* All available citizen services.

## Sections

### Report an Issue
* Primary CTA.

### My Issues
* Track complaints.

### Emergency Contacts
* Direct calling.

### Ward Information
* Ward office details.

Future
* Certificates
* Payments
* Public Requests

---

# Report Issue

Multi-step Wizard

## Step 1
Choose Category

Categories
* Water
* Electricity
* Road
* Street Light
* Waste
* Drainage
* Public Property
* Trees
* Animals
* Others

## Step 2
Choose Specific Issue
Dynamic list.

Example:
* **Water**: No Supply, Leakage, Low Pressure, Contaminated Water, Illegal Connection, Other
* **Road**: Pothole, Broken Road, Water Logging, Broken Footpath, Other
* **Electricity**: Power Outage, Broken Pole, Transformer, Loose Wire, Other
* **Street Light**: Not Working, Always On, Broken Pole, Damaged Wiring, Other
* **Waste**: Garbage Not Collected, Overflowing Bin, Illegal Dumping, Dead Animal, Other

Continue similarly for every department.

## Step 3
Location
* Current GPS
* Search Address
* Map Pin
* Landmark

## Step 4
Evidence
* Take Photo
* Upload Photo
* Record Voice
* Write Description

## Step 5
Priority
* Low
* Medium
* High
* Emergency

## Step 6
Review
* Everything shown.
* Edit button.
* Submit

---

# Submission Success

* Illustration
* Complaint ID
* Estimated Response
* Return Home
* Track Complaint

---

# My Issues

Purpose
* Track all complaints.

## Filters
* All
* Open
* Assigned
* In Progress
* Resolved
* Closed

Issue Card
* Category
* Issue
* Date
* Status
* Complaint ID

Issue Details
* Status Timeline (Submitted, Assigned, In Progress, Resolved)
* Officer Comments
* Images
* Voice Notes
* Location
* Share
* Delete (Before Assignment)

---

# News

Purpose
* Community updates.

Components
* Search
* Categories
* News Cards (Image, Date, Read Full, Share)

---

# Broadcast Messages

Purpose
* Important announcements.
* Sticky alerts.
* Emergency notifications.
* Public notices.

---

# Chat

Purpose
* Connect with ward office.

Chat List
* Ward Councillor
* Ward Office
* Support

Chat Screen
* Messages
* Typing
* Voice Messages
* Images
* Complaint Reference Sharing
* Read Status

Future
* AI Assistant

---

# Profile

Purpose
* Resident account.

Sections
* Personal Information
* Phone Number
* Ward
* Address
* Language
* Accessibility
* Notifications
* Help
* About
* Privacy
* Logout

---

# Accessibility

Purpose
* Universal usability.

Features
* Adjust Font Size
* Text to Speech
* Read Screen
* High Contrast
* Reduce Motion
* Language Switch
* Voice Navigation (Future)

---

# Notifications
* Complaint Updates
* Broadcasts
* News
* Emergency Alerts
* Chat Messages

---

# Empty States
* No Issues
* No News
* No Messages
* No Notifications
* Friendly illustrations.

---

# Error States
* No Internet
* Server Error
* Location Disabled
* Camera Permission
* Microphone Permission
* Retry actions.

---

# Loading States
* Skeleton cards.
* Button loaders.
* Progress indicators.

---

# Components Library
* Buttons
* Cards
* Navigation Bar
* Search
* Chip
* Badge
* Stepper
* Timeline
* Accordion
* Bottom Sheet
* Dialog
* Toast
* FAB
* Avatar
* Status Chip
* Alert Banner
* Voice Recorder
* Image Picker
* Map Picker

---

# Motion Design

* Duration: 200–300ms
* Animations: Fade, Slide, Scale, Container Transform
* Micro-interactions: Button Press, Card Hover, Bottom Nav Transition, Stepper Progress, Success Animation

---

# Accessibility Requirements
* Minimum 48×48dp touch targets
* WCAG AA color contrast
* Screen reader compatibility
* Full keyboard support (PWA/Desktop)
* Clear focus indicators
* Persistent labels under navigation icons
* Voice guidance for key workflows

---

# Future Roadmap

## Phase 2
* Push notifications
* AI-powered issue categorization
* Duplicate complaint detection
* Live issue map
* Polls & surveys
* Event registrations
* Digital certificates
* Online payments
* Service request scheduling

## Phase 3
* AI civic assistant
* Voice-first complaint filing
* Video complaint support
* Real-time officer tracking
* Smart department routing
* Predictive issue analytics

---

# Final UX Goal

A resident should be able to **open the app, report an issue, and receive a complaint ID in under two minutes**—without reading a manual or needing assistance.

The experience should feel **approachable for a 50-year-old resident**, while still being polished and efficient enough that a 20-year-old would choose to use it over calling the ward office.
