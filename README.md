# Syntecxhub Notes

A responsive React + TypeScript notes app for the Syntecxhub Web Development Internship. Notes are stored locally in the current browser using `localStorage`.

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build, run `npm run build`; to preview it, run `npm run preview`.

## Features

- Create, edit, and delete notes (deletion asks for confirmation)
- Search saved notes
- Show each note's creation date and preserve it when edited
- Automatically focus the note title when the editor opens
- Save and restore notes from browser local storage
- Responsive layout with navy surfaces, white note cards, and purple accents

Notes stay in the browser where they were created and do not sync between devices.
