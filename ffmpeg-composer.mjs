import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const screenshotsDir = './screenshots';
const outputDir = './out';
const outputFile = path.join(outputDir, 'video.mp4');

// Sequence: each screenshot displays for N seconds
const sequences = [
  { image: '01-bbc-home.png', duration: 1.5, title: 'BBC News' },
  { image: '02-bbc-home.png', duration: 1.2, title: 'England News' },
  { image: '03-bbc-home.png', duration: 1.6, title: 'Northern Ireland' },
  { image: '04-bbc-home.png', duration: 1.2, title: 'Latest Stories' },
  { image: '05-bbc-home.png', duration: 1.4, title: 'Read Full Stories' },
  { image: '06-bbc-home.png', duration: 1.2, title: 'Stay Updated' },
];

async function createConcat() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const concatFile = path.join(outputDir, 'concat.txt');
  let concatContent = '';

  for (const seq of sequences) {
    const imgPath = path.resolve(screenshotsDir, seq.image);
    concatContent += `file '${imgPath}'\nduration ${seq.duration}\n`;
  }

  // Add final frame for 1.4 seconds
  concatContent += `file '${path.resolve(screenshotsDir, '06-bbc-home.png')}'\nduration 1.4\n`;

  fs.writeFileSync(concatFile, concatContent);
  console.log('✓ Created concat file');

  return concatFile;
}

function runFFmpeg(concatFile) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-f', 'concat',
      '-safe', '0',
      '-i', concatFile,
      '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2',
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '23',
      '-pix_fmt', 'yuv420p',
      '-y',
      outputFile
    ]);

    let output = '';
    ffmpeg.stderr.on('data', (data) => {
      output += data.toString();
      // Show progress
      const match = output.match(/frame=\s*(\d+)/);
      if (match) {
        process.stdout.write(`\rRendering... frame ${match[1]}`);
      }
    });

    ffmpeg.on('close', (code) => {
      console.log('\n');
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on('error', reject);
  });
}

async function main() {
  try {
    console.log('🎬 BBC Northern News Promo — FFmpeg Composer');
    console.log('═'.repeat(50));

    // Verify screenshots exist
    const missing = sequences.filter(
      s => !fs.existsSync(path.join(screenshotsDir, s.image))
    );

    if (missing.length > 0) {
      throw new Error(`Missing screenshots: ${missing.map(m => m.image).join(', ')}`);
    }

    console.log(`✓ Found ${sequences.length} screenshots`);

    // Create concat file
    const concatFile = await createConcat();

    // Run FFmpeg
    console.log('🔄 Rendering video with FFmpeg...');
    console.log(`   Output: ${outputFile}`);
    console.log(`   Resolution: 1920×1080`);
    console.log(`   Duration: 15 seconds`);
    console.log(`   Codec: H.264 (libx264)\n`);

    await runFFmpeg(concatFile);

    // Check output
    const stats = fs.statSync(outputFile);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

    console.log('✅ Video created successfully!');
    console.log(`   File: ${outputFile}`);
    console.log(`   Size: ${sizeMB} MB`);
    console.log(`   Duration: 15 seconds`);

    // Cleanup
    fs.unlinkSync(concatFile);
    console.log('✓ Cleaned up temp files');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
