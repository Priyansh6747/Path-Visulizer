# 🧭 Path Visualizer

**Path Visualizer** is a web-based tool for visualizing classic pathfinding algorithms in action. It’s built with high-performance **Rust** (compiled to WebAssembly) for the core logic, and a responsive **React** frontend for interaction and visualization.

🔗 **Live Demo**: [path-visulizer.vercel.app](https://path-visulizer.vercel.app)

---

## ✨ Features

- 🔳 **Interactive Grid Editor**  
  Draw walls, set start/end nodes, and reset with ease.

- 🧠 **Algorithm Visualizations**  
  Watch these algorithms solve the grid in real time:

    Dijkstra's Algorithm
    
    A* Search
    
    Greedy Best-First Search
    
    Breadth-First Search (BFS)
    
    Depth-First Search (DFS)
    
    Bellman-Ford Algorithm
    
    Bidirectional Swarm (BiSwarn)

- ⚡ **Powered by Rust + WebAssembly**  
  Core pathfinding logic is written in Rust and compiled to WebAssembly for speed and performance.

- 🖥️ **Modern Frontend with React + Vite**  
  Built with a fast and responsive UI powered by React and Vite.

---

## 🛠️ Getting Started

### Prerequisites

- [Rust + Cargo](https://www.rust-lang.org/tools/install)
- [Node.js + npm](https://nodejs.org/)

---

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Priyansh6747/Path-Visulizer.git
cd Path-Visulizer

# 2. Build the Rust code to WebAssembly
cd RUST
wasm-pack build --target web

# 3. Set up the frontend (React + Vite)
cd ../wasm_pkg
npm install
npm run dev
```
Already done — but here's the cleaned-up final version of the **Contributing** section, streamlined and welcoming without sounding overly corporate:

---

## 🤝 Contributing

Contributions are welcome! Whether it’s improving the UI, optimizing Rust logic, adding new algorithms, or fixing bugs — your input is appreciated.

### How to Contribute

```bash
# 1. Fork the repo
# 2. Create a feature branch
git checkout -b your-feature-name

# 3. Commit and push your changes
git commit -m "Add: feature description"
git push origin your-feature-name

# 4. Open a pull request (PR)
```

Before starting on bigger features, feel free to open an issue to discuss your idea. Let’s build something dope together.

---
