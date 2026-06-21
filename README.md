# 🎯 JIRA Bug Verification & RCA Agent

![Modern UI Design](https://img.shields.io/badge/UI-Modern%20Glassmorphism-blueviolet)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-success)
![Integrations](https://img.shields.io/badge/Integration-Jira%20Cloud%20API-blue)

A powerful, standalone web application that seamlessly integrates with Jira SDK to automatically analyze, verify, and generate Root Mause Analysis (RCA) mappings for Software Bugs.

Designed with an ultra-premium visual aesthetic (Glassmorphism & animations), it performs automated defect analysis and pushes actionable insights straight into your Jira ticket's description frame!

## ✨ Features

- **Jira API Integration:** Securely dynamic login. Manage your Jira Cloud credentials directly inside the Configuration Modal (`DOMAIN`, `EMAIL`, and `API TOKEN`). They are saved safely in your browser.
- **Smart Defect Analysis:** Automatically fetches ticket data and intuitively maps defect summaries & descriptions to Root Cause Categories.
- **Confidence Scoring:** Determines if a bug contains missing information (like Reproduction Steps) and scales confidence scoring dynamically.
- **Single-Click Upload:** Click "Update to Jira" to inject securely formatted Atlassian Document Format (ADF) block reports right into the respective Jira Ticket interface!

## ⚙️ Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/bhaumikgohel/JIRA-BUG-RCA-Finder.git
   cd JIRA-BUG-RCA-Finder
   ```

2. **Install node packages:**
   ```bash
   npm install
   ```

3. **Start the local server:**
   ```bash
   npm start
   ```
   *The server will start up on `http://localhost:3000`.*

## 🚀 How to Use

1. Launch your browser and navigate to **`http://localhost:3000`**.
2. Click the **⚙️ Settings** button at the top right header.
3. Configure your **Jira Domain**, **Jira Account Email**, and **Jira API Token** (Ensure the token is active!). Hit **Save Settings**.
4. Type in your Target Bug ID (e.g., `QA-456`) and click **Analyze Details**.
5. Once your insights are automatically rendered dynamically on the UI, click **Update to JIRA** to push the RCA to the Atlassian Cloud securely!

## 🧠 RCA Categories
The analytical ruleset parses Jira descriptions against a highly-tuned word map defined under `SKILL.md` covering:
- **Requirement Gap**
- **Design Gap**
- **Development Defect** *(e.g., Unhandled exceptions, 500 error faults)*
- **Test Coverage Gap**
- **Environment Issue** *(e.g., Network timeouts)*
- **Data Issue**

---

*Made by Antigravity*
