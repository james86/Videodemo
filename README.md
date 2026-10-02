# BBC Northern News Promo Video

A Playwright + Remotion project that captures BBC News screenshots and composes them into a 15-second promo video.

## Project Structure

- `playwright-capture.mjs` - Captures screenshots from BBC Northern News pages
- `src/index.tsx` - Remotion composition entry point
- `src/PromoVideo.tsx` - Video component with animations and text overlays
- `remotion.config.ts` - Remotion configuration

## Setup & Running

### Prerequisites
```bash
npm install
```

### Cloud Session Limitations (⚠️ Important)

This project has three key challenges when running in Claude Code on the web:

#### 1. **Network Access**
- Cloud sessions have limited network access by default
- BBC.com may not be on the allowlist
- The Playwright script may fail to reach bbc.com until network access is approved
- **Solution**: Run locally or ask your admin to allowlist bbc.com in environment settings

#### 2. **File Output**
- The rendered MP4 video sits in the cloud sandbox
- No direct download mechanism
- **Solution**: 
  - Commit the `screenshots/` and `out/` directories to a branch (if small enough)
  - Run locally where the MP4 lands directly on disk
  - Use Remote Control to drive a local Claude Code session instead

#### 3. **Browser Access**
- Headless browser in cloud may behave differently than local
- Some BBC content might require specific user-agent headers
- **Recommendation**: Clone locally and run both scripts on your machine

## Local Workflow (Recommended)

```bash
# 1. Clone the repository locally
git clone <repo-url>
cd Videodemo

# 2. Install dependencies
npm install

# 3. Capture BBC Northern News screenshots
npm run capture

# 4. This generates screenshots in ./screenshots/

# 5. Render the video (requires Remotion CLI installed globally)
npm run video

# 6. Find your MP4 at ./out/video.mp4
```

## Alternative: Remote Control

Use Remote Control to drive a local Claude Code session from the web interface:
- Code execution stays on your machine
- Browser can reach bbc.com naturally
- MP4 outputs to your local disk
- No file size constraints

## Video Content

The promo video:
- 15 seconds total
- Opens with BBC Northern News title card
- Shows 6 key screenshots from the BBC Northern News journey
- Each screenshot fades with contextual overlays
- Closes with call-to-action: BBC.com/news
- BBC brand colors (navy blue, red accents)

## Troubleshooting

**Playwright captures fail**: Network access blocked. Check environment allowlist.

**Remotion render fails**: Install Chromium separately if needed:
```bash
npx remotion install chromium
```

**Screenshots look wrong**: Check viewport size (default 1920x1080).

**MP4 too large**: Reduce fps in `src/index.tsx` or duration.