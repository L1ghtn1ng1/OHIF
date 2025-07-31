
# OHIF Viewer: Export ZIP Mode

**Author**: Arnav Bhatiani

This is a customized version of the OHIF Viewer that includes a new **Export ZIP Mode**. This mode was intended to add functionality to export the current viewport image and relevant metadata (e.g., Patient Name and Study Date) as a downloadable `.zip` file.

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16.x or compatible)
- Yarn (v1.22+)
- Git

### Clone the Repository

```bash
git clone https://github.com/L1ghtn1ng1/OHIF.git
cd OHIF
```

### Install Dependencies (in the root)

```bash
yarn install
```

### Run the Viewer

```bash
yarn dev
```

The viewer should now be accessible at [http://localhost:3000](http://localhost:3000).

---

## 🚀 How to Activate the Export ZIP Mode

1. Start the viewer locally.
2. In your browser, go to:

```
http://localhost:3000
```

3. Click on any dataset or folder. There will be a mode option labeled **"Export as Zip"** that takes you to the custom mode.
4. Unfortunately, due to a persistent issue, the **Export** button does not appear in the toolbar — despite the extension and mode being properly registered. This made it difficult to test the functionality within the viewer.
5. However, the core logic for the export (capturing the image and metadata, and zipping them) is implemented in the `export-zip` folder under `./extensions`.

---

## 🧠 Development Process & Approach

This project involved creating a custom **OHIF extension** and **mode** that integrate with OHIF's command and toolbar systems.
### Approach:
- I spent many hours studying the existing codebase and documentation. Initially, it was quite daunting since this was my first open source contribution. Over time, I was able to grasp the overall architecture and how the pieces fit together. However, I struggled to fully understand some of the more intricate or niche aspects that might have helped me resolve the bug causing the toolbar button not to appear (maybe also because this happened to be one of the busiest weeks of my life haha), but I tried my best to understand and get to the root of the issue.

### Key Steps:
- Used the Segmentation Mode as a reference.
- Built the `export-zip` extension with:
  - A command to capture the viewport and extract metadata.
  - A toolbar module to define a new "Export" button.
- Created a new mode (`zipExportMode`) that:
  - Registers the extension.
  - Adds the export button to the toolbar using `onModeEnter`.

---

## ⚠️ Challenges & Solutions

- **Toolbar Button Not Rendering**  
  Despite correctly registering the command and toolbar button, the "Export" button would not appear in the toolbar UI. I confirmed the mode and extension were being loaded correctly, and I spent considerable time debugging the issue, but eventually had to move on due to time constraints.

- **Understanding OHIF Internals**  
  The OHIF architecture involves multiple systems — extensions, modes, services, and commands. Reviewing the Segmentation Mode and its setup helped clarify how these layers interact.

---

## 🤔 Assumptions & Future Improvements

### Assumptions
- A single active viewport is available when exporting.
- The `PatientName` and `StudyDate` metadata are present and accessible.

### If I Had More Time:
- Fix the toolbar button visibility issue.
- Add user feedback (toast/alerts) for success/failure.
- Support exporting multiple viewports or series at once.
- Let users select which metadata fields to include in the ZIP.

---

## 📁 Extension Location

The `export-zip` extension can be found at:

```
./extensions/export-zip/
```
