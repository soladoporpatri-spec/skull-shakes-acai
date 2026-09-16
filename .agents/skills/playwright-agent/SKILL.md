---
name: playwright-agent
description: Playwright Agent CLI skill for browser automation, test debugging, session management, network mocking, tracing, and video recording. Use when working with Playwright tests, browser automation, or end-to-end testing.
version: 1.0.0
author: microsoft
tags:
  - playwright
  - browser
  - testing
  - automation
  - e2e
---

# Playwright Agent CLI

Comprehensive reference for using `playwright-cli` in coding agents. This skill teaches agents how to effectively use the Playwright CLI for browser automation, testing, and debugging.

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Navigation](#navigation)
3. [Interaction](#interaction)
4. [Keyboard & Mouse](#keyboard--mouse)
5. [Snapshots (DOM Inspection)](#snapshots)
6. [Network & Mocking](#network--mocking)
7. [Storage & Authentication](#storage--authentication)
8. [Screenshots & PDF](#screenshots--pdf)
9. [Test Debugging](#test-debugging)
10. [Tracing](#tracing)
11. [Video Recording](#video-recording)
12. [Session Management](#session-management)
13. [Vision Mode](#vision-mode)
14. [Capabilities & Config](#capabilities--config)

---

## Installation & Setup

```bash
# Install globally
npm install -g playwright-cli

# Or use with npx (no install needed)
npx playwright-cli --help

# Install skills for your coding agent
npx playwright-cli install --skills
```

### Quick Start

```bash
# Open a URL and interact
npx playwright-cli navigate --url "https://example.com"

# Run in headless mode
npx playwright-cli navigate --url "https://example.com" --headless

# Get help for any command
npx playwright-cli <command> --help
```

---

## Navigation

```bash
# Navigate to URL
playwright-cli navigate --url "https://example.com"

# Navigate and wait for network idle
playwright-cli navigate --url "https://example.com" --wait-until networkidle

# Go back/forward
playwright-cli go-back
playwright-cli go-forward

# Reload page
playwright-cli reload
playwright-cli reload --wait-until domcontentloaded
```

### Wait Options

| Option | Description |
|--------|-------------|
| `load` | Wait for the `load` event (default) |
| `domcontentloaded` | Wait for `DOMContentLoaded` event |
| `networkidle` | Wait until no network connections for 500ms |
| `commit` | Wait for first server response |

---

## Interaction

```bash
# Click an element (by text, role, or selector)
playwright-cli click --ref "Submit"
playwright-cli click --ref "button[name='submit']"

# Fill input fields
playwright-cli fill --ref "Email" --value "user@example.com"

# Select from dropdown
playwright-cli select-option --ref "Country" --value "US"

# Check/uncheck
playwright-cli check --ref "Accept terms"
playwright-cli uncheck --ref "Newsletter"

# Hover
playwright-cli hover --ref "Menu Item"

# Type text (character by character, for autocomplete etc.)
playwright-cli type --ref "Search" --text "playwright"

# Clear field
playwright-cli clear --ref "Email"
```

### Element Reference (`--ref`)

The `--ref` parameter is intelligent and matches:
1. **Accessible name**: `--ref "Submit"` matches `<button>Submit</button>`
2. **Role + name**: `--ref "button Submit"` matches buttons labeled "Submit"
3. **CSS selector**: `--ref "input#email"` matches by CSS
4. **Text content**: `--ref "Welcome to our site"` matches text elements

---

## Keyboard & Mouse

```bash
# Press keys
playwright-cli press --key "Enter"
playwright-cli press --key "Control+A"
playwright-cli press --key "Meta+C"        # Cmd+C on Mac

# Key sequences
playwright-cli press --key "Tab"
playwright-cli press --key "Escape"

# Mouse actions
playwright-cli mouse-move --x 100 --y 200
playwright-cli mouse-click --x 100 --y 200
playwright-cli mouse-click --x 100 --y 200 --button right
playwright-cli mouse-click --x 100 --y 200 --click-count 2   # Double click

# Drag and drop
playwright-cli drag --source-ref "Item 1" --target-ref "Drop Zone"
```

### Common Key Combinations

| Keys | Action |
|------|--------|
| `Enter` | Submit form |
| `Tab` / `Shift+Tab` | Navigate fields |
| `Escape` | Close dialog/modal |
| `Control+A` / `Meta+A` | Select all |
| `ArrowDown` / `ArrowUp` | Navigate lists |

---

## Snapshots

Snapshots provide a structured view of the page's accessible elements (similar to the accessibility tree). Agents use snapshots to understand page structure without needing screenshots.

```bash
# Get full page snapshot
playwright-cli snapshot

# Get snapshot of specific element
playwright-cli snapshot --ref "nav"

# Snapshot with more detail
playwright-cli snapshot --verbose
```

### How Agents Use Snapshots

1. Take a snapshot to understand current page state
2. Identify elements by their accessible roles and names
3. Use `--ref` with element names to interact
4. Re-snapshot after actions to verify results

---

## Network & Mocking

```bash
# Intercept and mock a request
playwright-cli route --url "**/api/users" --response '{"users": []}'

# Mock with status code
playwright-cli route --url "**/api/data" --status 404 --response '{"error": "Not found"}'

# Mock with file
playwright-cli route --url "**/api/data" --body-file ./mock-data.json

# Remove a route
playwright-cli unroute --url "**/api/users"

# Monitor network requests
playwright-cli wait-for-request --url "**/api/submit"
playwright-cli wait-for-response --url "**/api/submit"
```

### URL Patterns

| Pattern | Matches |
|---------|---------|
| `**/api/*` | Any URL containing `/api/` |
| `https://example.com/**` | All URLs on example.com |
| `**/users?id=*` | URLs with query params |

---

## Storage & Authentication

```bash
# Save storage state (cookies, localStorage)
playwright-cli save-storage --path ./auth-state.json

# Load storage state (reuse login)
playwright-cli load-storage --path ./auth-state.json

# Clear cookies
playwright-cli clear-cookies

# Clear localStorage
playwright-cli evaluate --expression "localStorage.clear()"
```

### Auth Workflow

```bash
# 1. Navigate and login manually or programmatically
playwright-cli navigate --url "https://app.example.com/login"
playwright-cli fill --ref "Email" --value "user@test.com"
playwright-cli fill --ref "Password" --value "secret"
playwright-cli click --ref "Sign in"

# 2. Save auth state
playwright-cli save-storage --path ./auth-state.json

# 3. Reuse in future sessions
playwright-cli load-storage --path ./auth-state.json
playwright-cli navigate --url "https://app.example.com/dashboard"
# → Already logged in!
```

---

## Screenshots & PDF

```bash
# Full page screenshot
playwright-cli screenshot --path ./screenshot.png

# Element screenshot
playwright-cli screenshot --ref "main" --path ./main-content.png

# Full page (scrollable)
playwright-cli screenshot --full-page --path ./fullpage.png

# PDF export (Chromium only)
playwright-cli pdf --path ./page.pdf

# PDF with options
playwright-cli pdf --path ./page.pdf --format A4 --landscape
```

---

## Test Debugging

```bash
# Run Playwright tests
playwright-cli test-run

# Run specific test file
playwright-cli test-run --grep "login"

# Run with headed browser (see what's happening)
playwright-cli test-run --headed

# Run specific project
playwright-cli test-run --project chromium

# Debug a test (pause on first action)
playwright-cli test-run --debug

# Show test report
playwright-cli test-show-report

# List available tests
playwright-cli test-list
```

### Test Configuration

```bash
# Run with custom config
playwright-cli test-run --config ./playwright.config.ts

# Update snapshots
playwright-cli test-run --update-snapshots

# Run in specific workers
playwright-cli test-run --workers 4
```

---

## Tracing

```bash
# Start tracing
playwright-cli trace-start

# Start with screenshots and snapshots
playwright-cli trace-start --screenshots --snapshots

# Stop and save trace
playwright-cli trace-stop --path ./trace.zip

# View trace in Playwright Trace Viewer
playwright-cli trace-view --path ./trace.zip
```

### Trace Workflow

```bash
# 1. Start trace
playwright-cli trace-start --screenshots --snapshots

# 2. Perform actions
playwright-cli navigate --url "https://example.com"
playwright-cli click --ref "Login"
playwright-cli fill --ref "Email" --value "test@test.com"

# 3. Stop and save
playwright-cli trace-stop --path ./debug-trace.zip

# 4. View results
playwright-cli trace-view --path ./debug-trace.zip
```

---

## Video Recording

```bash
# Start recording
playwright-cli video-start --path ./videos/

# Stop recording
playwright-cli video-stop

# Record with custom size
playwright-cli video-start --path ./videos/ --size 1280x720
```

---

## Session Management

```bash
# List active sessions
playwright-cli session-list

# Attach to an existing session
playwright-cli attach --session-id <id>

# Open the dashboard (web UI for sessions)
playwright-cli dashboard

# Create a named session
playwright-cli navigate --url "https://example.com" --session "my-test"
```

### Multi-Tab Management

```bash
# Open new tab
playwright-cli new-tab --url "https://example.com"

# List open tabs
playwright-cli tab-list

# Switch to tab
playwright-cli tab-select --tab 2

# Close tab
playwright-cli tab-close --tab 2
```

---

## Vision Mode

Vision mode uses screenshots instead of DOM snapshots for interaction. Useful for canvas-based apps, iframes, or when the DOM is inaccessible.

```bash
# Enable vision mode
playwright-cli navigate --url "https://example.com" --vision

# Take a screenshot for analysis
playwright-cli screenshot

# Click by coordinates (from visual analysis)
playwright-cli mouse-click --x 450 --y 300
```

### When to Use Vision Mode

- Canvas-based applications (games, editors)
- Complex SVG visualizations
- Cross-origin iframes
- When snapshot doesn't capture needed information

---

## Capabilities & Config

```bash
# Show CLI capabilities
playwright-cli capabilities

# Show current configuration
playwright-cli config

# Set browser
playwright-cli config --browser firefox

# Set viewport
playwright-cli config --viewport 1920x1080

# Set timeout
playwright-cli config --timeout 30000
```

### Configuration File

Create `playwright-cli.config.json`:

```json
{
  "browser": "chromium",
  "headless": true,
  "viewport": {
    "width": 1280,
    "height": 720
  },
  "timeout": 30000,
  "baseURL": "https://example.com"
}
```

---

## Console & Eval

```bash
# Evaluate JavaScript in the browser
playwright-cli evaluate --expression "document.title"

# Evaluate and get result
playwright-cli evaluate --expression "window.location.href"

# Monitor console output
playwright-cli console-monitor

# Execute a script file
playwright-cli evaluate --file ./my-script.js
```

---

## Dialogs

```bash
# Auto-accept dialogs
playwright-cli dialog-accept

# Auto-dismiss dialogs
playwright-cli dialog-dismiss

# Accept with custom text (for prompts)
playwright-cli dialog-accept --text "My input"
```

---

## Quick Reference

### Common Workflows

```bash
# E2E Test Flow
playwright-cli navigate --url "$URL"
playwright-cli snapshot                    # Understand the page
playwright-cli fill --ref "Email" --value "test@test.com"
playwright-cli click --ref "Submit"
playwright-cli snapshot                    # Verify result

# Debug Flow
playwright-cli trace-start --screenshots
# ... reproduce the issue ...
playwright-cli trace-stop --path ./debug.zip
playwright-cli trace-view --path ./debug.zip

# Auth Reuse Flow
playwright-cli load-storage --path ./auth.json
playwright-cli navigate --url "$PROTECTED_URL"
```

### Error Handling

| Error | Solution |
|-------|----------|
| Element not found | Re-snapshot to check current state |
| Timeout | Increase `--timeout` or use `--wait-until networkidle` |
| Navigation failed | Check URL, try `--wait-until commit` |
| Click intercepted | Try `--force` flag or scroll element into view |

