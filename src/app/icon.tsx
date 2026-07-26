import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default async function Icon() {
  const imagePath = path.join(process.cwd(), 'public', 'anees-aboo3.png');
  const imageBuffer = fs.readFileSync(imagePath);
  const imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#a3a3a3',
        }}
      >
        <img
          src={imageBase64}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    ),
    { ...size }
  );
}
