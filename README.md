# 🧠 Trend-Aware Content Generator

**A real-time AI agent that discovers trending topics and turns them into content ideas.**

Built for the [Bright Data Real-Time AI Agents Challenge](https://dev.to/devteam/join-the-bright-data-real-time-ai-agents-challenge-3000-in-prizes-cog), this tool helps creators, marketers, and researchers stay ahead of the curve by extracting trending discussions from the web and using an offline AI model to suggest content ideas instantly.

---

## 🔍 What It Does

1. **Discover**: Scans top Reddit posts and YouTube videos for trending keywords using Bright Data's powerful proxies and web unlocker.
2. **Access**: Navigates dynamic, JavaScript-heavy pages using Bright Data's MCP.
3. **Extract**: Pulls structured titles and summaries from posts and videos.
4. **Interact**: Interact with pages like a human (clicks, scrolls, loads comments). Feeds trends to a local LLM to generate content ideas — entirely offline using [Ollama](https://ollama.com/).

---

## 🚀 Live Demo

🎥 Watch a short demo video: [coming soon](#)

---

## 🧠 How It Uses Bright Data

- Uses **Bright Data's MCP server** to:
  - Bypass anti-bot protections
  - Extract live HTML from Reddit and Youtube.
  - Simulate human-like behaviour on dynamic pages.
- All data is pulled in **real time**, ensuring your ideas are always based on the latest trends.

---

## 💻 Tech Stack

| Layer | Tech |
| --- | --- |
| Frontend | Streamlit |
| Backend | FastAPI |
| AI Engine | Ollama + Mistral (fully offline) |
| Data Layer | Bright Data MCP + Reddit + Youtube |
| Deployment | Docker + Docker Compose |

---

## 🐳 Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/vulcanric/trend-aware-content-agent.git
cd trend-aware-content-agent
```
### 2. Pull the AI model (optional if running locally)
```bash
ollama pull mistral
```
### 3. Create `.env` file
```env
BRIGHT_DATA_USERNAME=your_username
BRIGHT_DATA_PASSWORD=your_password
```
### 4. Run with Docker Compose
```bash
docker-compose up --build
```
Visit:
- Frontend: http://localhost:8501
- Backend: http://localhost:8000/docs

## 📦 Project Structure
```css
.
├── backend/
|   ├── main.py
|   ├── ai_engine.py
|   └── ...
├── frontend/
|   └── streamlit_app.py
├── docker-compose.yml
├── requirements.txt
├── .env.example
└── README.md
```

## ✅ Challenge Requirements Met
- Uses Bright Data to **discover**, **access**, **extract**, **interact**
- Real-time agent with live data
- Fully deployed + open source
- Demo included

## 📨 Submission
- 📝 **DEV post**: [my DEV post link here]
- 🌐 **GitHub repo**: [https://github.com/vulcanric/trend-aware-content-agent.git](https://github.com/vulcanric/trend-aware-content-agent.git)
- 🎥 **Demo video**: [my demo video]

## 📄 License
MIT

## 🙌 Built with love by John Eric
**LinkedIn:** [https://www.linkedin.com/in/johneric1](https://www.linkedin.com/in/johneric1)
**X:** [https://x.com/JohnEri89510617](https://x.com/JohnEri89510617)
