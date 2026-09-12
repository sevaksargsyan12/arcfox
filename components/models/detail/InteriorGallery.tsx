export function InteriorGallery({ images, title, alt }: { images: string[]; title: string; alt: string }) {
  return (
    <div>
      <h2 className="text-center font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {images.map((src, i) => (
          <div key={src} className="overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${alt} ${i + 1}`} className="aspect-[4/3] w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
