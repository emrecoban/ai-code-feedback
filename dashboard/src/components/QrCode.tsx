import { encode } from 'uqr';

/** QR code drawn as SVG rectangles -- no HTML strings, no network. */
export function QrCode({ value, size = 184, label }: { value: string; size?: number; label: string }) {
  const { data } = encode(value, { ecc: 'M', border: 2 });
  const n = data.length;
  const cells: string[] = [];
  data.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (dark) cells.push(`M${x},${y}h1v1h-1z`);
    }),
  );
  return (
    <svg className="qr" width={size} height={size} viewBox={`0 0 ${n} ${n}`} role="img" aria-label={label} shapeRendering="crispEdges">
      <rect width={n} height={n} fill="#ffffff" />
      <path d={cells.join('')} fill="#0b0b0b" />
    </svg>
  );
}
