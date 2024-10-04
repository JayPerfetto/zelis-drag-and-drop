# Zelis Drag and Drop Site

[**Deployed Site**](https://zelis-drag-and-drop.vercel.app/)

## Features

- **File Storage**: Files stored in an S3 bucket for secure file storage.
- **Upload Limit**: Supports file uploads up to 5MB (Capped).
- **Secure Downloads**:
  - Generates pre-signed URLs via a Remix action function.
  - URLs remain valid for a set time (currently 1 hour).
- **Updates**: Updates in real-time as files are added or removed, displaying an accurate file name, size, type, and upload time..

## 3D Visualization

- **Background Render**: Particle system that changes colors depending on dark/light mode
- **Animation**: React-Three-Fiber for smooth animations and interactions.
