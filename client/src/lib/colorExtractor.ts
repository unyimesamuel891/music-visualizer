/**
 * Extract dominant color from an image using canvas
 * Returns RGB values and OKLCH representation for visualization
 */
export const extractDominantColor = (
  imageData: ImageData
): { r: number; g: number; b: number; oklch: string } => {
  const data = imageData.data;
  const colorMap: { [key: string]: number } = {};

  // Sample every 4th pixel for performance
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    // Quantize to reduce color space
    const quantized = `${Math.round(r / 16)},${Math.round(g / 16)},${Math.round(
      b / 16
    )}`;
    colorMap[quantized] = (colorMap[quantized] || 0) + 1;
  }

  // Find most frequent color
  let dominantColor = { r: 100, g: 100, b: 100 };
  let maxCount = 0;

  for (const [color, count] of Object.entries(colorMap)) {
    if (count > maxCount) {
      maxCount = count;
      const [r, g, b] = color.split(',').map((x) => parseInt(x) * 16);
      dominantColor = { r, g, b };
    }
  }

  // Convert RGB to OKLCH for visualization
  const oklch = rgbToOklch(dominantColor.r, dominantColor.g, dominantColor.b);

  return {
    ...dominantColor,
    oklch,
  };
};

/**
 * Convert RGB to OKLCH color space
 * OKLCH is perceptually uniform and great for smooth color transitions
 */
const rgbToOklch = (r: number, g: number, b: number): string => {
  // Normalize RGB to 0-1
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Convert to linear RGB
  const linearR = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const linearG = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const linearB = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Convert to XYZ
  const x = linearR * 0.4124 + linearG * 0.3576 + linearB * 0.1805;
  const y = linearR * 0.2126 + linearG * 0.7152 + linearB * 0.0722;
  const z = linearR * 0.0193 + linearG * 0.1192 + linearB * 0.9505;

  // Convert to OKLab
  const l = 0.2104542553 * x + 0.793617785 * y - 0.0040720468 * z;
  const m = 1.9779984951 * x - 2.428592205 * y + 0.4505937099 * z;
  const s = 0.0259040371 * x + 0.7827717662 * y - 0.808649671 * z;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 0.3869747462 * l_ - 0.1470543331 * m_ - 0.2413896237 * s_;
  const b_ = 0.1634612499 * l_ + 0.6435810687 * m_ - 0.8079129945 * s_;

  // Convert to OKLCH
  const C = Math.sqrt(a * a + b_ * b_);
  const h = (Math.atan2(b_, a) * 180) / Math.PI;
  const hNormalized = h < 0 ? h + 360 : h;

  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${hNormalized.toFixed(1)})`;
};

/**
 * Extract color from image file
 */
export const extractColorFromImageFile = (
  file: File
): Promise<{ r: number; g: number; b: number; oklch: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const color = extractDominantColor(imageData);
        resolve(color);
      };
      img.onerror = () => reject(new Error('Could not load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
};
