# Zelis Drag and Drop Site

[Live Demo](https://zelis-drag-and-drop.vercel.app/)

## Features

- **File Storage**: Uses an S3 bucket to store files
- **Upload Limit**: 5MB maximum file size
- **Secure Downloads**:
  - Creates a pre-signed URL in a Remix action function
  - URL is active for 1 hour
  - Sent to the client for downloading

## 3D Visualization

- **Phone Model**: Imported as a GLB file
- **Animation**: Powered by React-Three-Fiber (Three.js for React)
- **Real-time Updates**:
  - Displays file information on the 3D phone model
  - Shows file date, name, and size
  - Updates in real-time as files are added or removed
