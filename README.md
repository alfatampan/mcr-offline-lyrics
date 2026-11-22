# MCR Offline Lyrics

A full-offline My Chemical Romance lyrics and discography PWA, styled with a **Live in Jakarta / The Black Parade** concert-poster theme.

**Live app:** https://alfatampan.github.io/mcr-offline-lyrics/

## Features

- Complete local MCR lyrics dataset
- Offline access to the app and lyrics after the first online visit
- Instant fuzzy search across song titles, lyrics, and albums
- Album covers and dedicated album track pages
- Lyrics reader with Screen Wake Lock support
- Performance mode with selectable cameras, local video recording, and an adjustable scrolling lyrics teleprompter
- Installable PWA for Android, iPhone, iPad, Windows, and macOS

## Screenshots

The album browser, album detail, and lyrics-reader shots capture each complete page. The Library shot shows the mobile screen at normal viewport size; its track list scrolls like it does on a phone.

### Album browser

![MCR Offline Lyrics album browser on desktop](docs/screenshots/desktop.png)

![MCR Offline Lyrics album browser on mobile](docs/screenshots/mobile.png)

### Album details

![Album detail and track list](docs/screenshots/album-detail.png)

### Library

![All-tracks Library view on mobile](docs/screenshots/library.png)

### Lyrics reader

![Lyrics reader view](docs/screenshots/lyrics-reader.png)

## Install on Android / Chrome

1. Open https://alfatampan.github.io/mcr-offline-lyrics/
2. Open Chrome's three-dot menu.
3. Select **Install app** or **Add to Home screen**.
4. Confirm by tapping **Install**.

You can also use the red **INSTALL APP** button in the app header. After installation, open MCR Offline Lyrics from the home screen or app drawer.

## Install on iPhone / iPad / Safari

1. Open https://alfatampan.github.io/mcr-offline-lyrics/ in Safari.
2. Tap the **Share** button.
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add**.

The app can also show its iOS installation instructions when you tap **ADD TO HOME**.

## Install on Windows / macOS

1. Open the app in Chrome or Edge.
2. Click the red **INSTALL APP** button in the header.
3. Alternatively, open the browser menu and choose **Install MCR Offline Lyrics**.

## Record while reading lyrics

1. Open a song's lyrics and tap **RECORD WITH LYRICS**.
2. Tap **ENABLE CAMERA** and allow camera and microphone access.
3. If your device has multiple cameras, tap **SWITCH CAMERA** to cycle between them.
4. Adjust the **ZOOM** slider; the zoom is included in the recording.
5. Read the compact three-line lyric window; adjust its speed or tap **AUTO-SCROLL** to advance the prompt.
6. Rotate your phone sideways for landscape, or tap **ROTATE PHONE** to request landscape when your browser supports orientation lock.
7. Tap **START RECORDING**; the camera preview and lyrics stay together on screen.
8. Tap **STOP RECORDING**, then **SAVE VIDEO**. On phones, choose **Save Video** or **Save to Files** in the share sheet if it appears.

The app and lyrics are cached after the first online visit, so performance mode can be used offline afterwards. The video is recorded in your browser and saved from a local in-memory file; it is not uploaded. The downloaded clip contains camera, zoom, and microphone footage—the lyrics are a teleprompter and are not burned into the video. To include on-screen lyrics, use your phone's built-in screen recorder while Performance mode is open, or add them in a video editor. Camera recording requires a supported browser and camera/microphone permission; use **ENABLE CAMERA** on the live HTTPS site.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, typically `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

The build output is written to `dist/`.

## Tech

- React
- Vite
- `vite-plugin-pwa` / Workbox
- Fuse.js
- Lucide React

## Credits and content

Lyrics data is credited to [LRCLIB](https://lrclib.net/), a free and open lyrics database, and its contributors. Thank you for making lyrics data available.

The MIT license in this repository covers the app's original source code only. Lyrics and album artwork are third-party content and are **not** relicensed under MIT; their respective copyrights and terms remain with their owners. Attribution is not a grant of rights.

## License

App source code is licensed under the [MIT License](LICENSE).
