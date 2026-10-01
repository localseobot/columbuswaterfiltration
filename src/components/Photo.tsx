import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { SitePhoto } from "@/lib/photos";

type PhotoProps = {
  photo: SitePhoto;
  className?: string;
  sizes?: string;
};

function hasFile(file: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", "photos", file));
}

/** A photo that fills its box, or nothing when the file is not in public/photos/. */
export default function Photo({ photo, className = "", sizes = "(min-width: 1024px) 50vw, 100vw" }: PhotoProps) {
  if (!hasFile(photo.file)) return null;
  return (
    <figure className={`relative overflow-hidden ${className}`}>
      <Image
        src={`/photos/${photo.file}`}
        alt={photo.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
      <figcaption className="absolute bottom-1.5 right-2 text-[10px] text-white/80 drop-shadow">
        Photo: {photo.credit}
      </figcaption>
    </figure>
  );
}

export function photoExists(photo: SitePhoto): boolean {
  return hasFile(photo.file);
}
