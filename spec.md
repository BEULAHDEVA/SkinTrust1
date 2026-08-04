Build a single self-contained index.html file for an academic study timetable tracker app. This is Mission 1 of 10 — we are only building the shell, navigation, and settings in this step.

---

## WHAT TO BUILD IN THIS MISSION

### 1. HTML Structure
A single index.html with:
- All CSS inside a <style> block in <head>
- All JS inside a <script> block before </body>
- Google Fonts loaded via <link>: "Plus Jakarta Sans" (UI) + "Lora" (headings)
- No external JS libraries, no build tools, works by opening in browser

### 2. Layout Shell
- Fixed top navbar containing:
  - Left: app name "StudyDesk" in Lora font
  - Center: current semester label (from settings, default "Semester 1 – 2025")
  - Right: dark mode toggle button + settings icon button
- Left sidebar (240px wide) with nav links:
  Dashboard, Timetable, Subjects, Tasks, Exams, Focus Mode, Pomodoro, Notes, Settings
  Each link has a relevant emoji icon and a label.
- Main content area (takes remaining width) — shows a placeholder for each section:
  "📚 Dashboard coming in Mission 2" etc.
- On screens < 768px: sidebar collapses, replaced by a bottom tab bar showing 5 main icons

### 3. CSS Variable System (mandatory)
Define all colors as CSS variables in :root for light mode.
Also define a [data-theme="dark"] block that overrides them for dark mode.

Light mode variables:
  --bg-primary: #F8F7F4
  --bg-secondary: #EEECEA
  --bg-card: #FFFFFF
  --text-primary: #1A1A2E
  --text-secondary: #4A4A6A
  --text-muted: #9090A0
  --accent: #1E3A5F
  --accent-hover: #162C4A
  --success: #2D7A4F
  --warning: #B97B0A
  --danger: #B93030
  --info: #1A5FAA
  --border: #DDDBD5
  --shadow: rgba(0,0,0,0.07)

Dark mode overrides:
  --bg-primary: #1A1A2E
  --bg-secondary: #16213E
  --bg-card: #0F3460
  --text-primary: #E8E8F0
  --text-secondary: #A0A0C0
  --text-muted: #6060A0
  --accent: #4A9EFF
  --accent-hover: #6ABAFF
  --border: #2A2A4A
  --shadow: rgba(0,0,0,0.3)

### 4. Navigation Router
A showSection(name) JS function that:
- Hides all sections
- Shows the one matching name
- Highlights the active nav link in the sidebar
- Saves active section to localStorage so it persists on page reload

Default section on first load: "dashboard"

### 5. Settings Section (fully working in this mission)
A settings form with these fields:
- Your Name (text input) — displayed in navbar as "Welcome, [Name]"
- Semester Label (text input, e.g. "Semester 3 – 2025")
- Semester Start Date (date input)
- Semester End Date (date input)
- Theme (light/dark toggle — also connected to the navbar toggle button)
- A "Save Settings" button that shows a toast notification on save
- A "Reset All Data" button (styled in danger color) — clicking opens a confirmation dialog. If confirmed, clears all localStorage and reloads the page.

### 6. localStorage for Settings
On save, store settings as:
localStorage.setItem("settings", JSON.stringify({
  userName, semesterLabel, semesterStart, semesterEnd, theme
}))

On page load, read settings and apply:
- Set data-theme attribute on <html> element
- Update navbar with user name and semester label
- Restore active section

### 7. Toast Notification System (reusable)
Build a showToast(message, type) function where type is "success", "error", "warning", or "info".
Toast appears bottom-right, auto-dismisses after 3 seconds.
Style using the CSS variable colors.
Multiple toasts stack vertically.

### 8. Modal Dialog System (reusable shell)
Build openModal(title, bodyHTML, footerHTML) and closeModal() functions.
The modal overlays the page with a dark backdrop.
Has a header with title + X close button, a body area, and a footer area.
Closes on backdrop click or Escape key.
We will use this in later missions for all forms.

### 9. Keyboard Shortcuts
D = show Dashboard section
T = show Timetable section
F = show Focus Mode section
P = show Pomodoro section
Escape = close any open modal

### 10. Default Settings on First Launch
If no settings exist in localStorage, pre-load:
  userName: "Student"
  semesterLabel: "Semester 1 – 2025"
  semesterStart: (today's date)
  semesterEnd: (today + 120 days)
  theme: "light"

---

## WHAT NOT TO BUILD YET
Do not build: timetable grid, subjects, tasks, exams, pomodoro timer, notes, dashboard stats.
Just show a simple placeholder message in each section: a centered emoji + "Coming soon in Mission X".

---

## OUTPUT
One complete index.html file. Clean, well-commented code. 
All sections navigable. Settings fully functional. Dark mode working. 
Toast and modal systems ready for future missions. 