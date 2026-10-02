'use client';

import Image from 'next/image';

type FloatingIconProps = {
  src: string;
  alt?: string;
  className?: string;
};

export default function FloatingIcon({
  src,
  alt = 'Floating icon',
  className = '',
}: FloatingIconProps) {
  return (
    <div
      className={`relative flex h-[420px] w-[320px] items-center justify-center ${className}`}
    >
      {/* 柔和陰影，令 icon 好似浮喺畫面上 */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 h-8 w-48 -translate-x-1/2 rounded-full bg-black/10 blur-xl" />

      {/* 小 bubble 背景 */}
      <div className="floating-icon-bubble relative flex h-72 w-56 items-center justify-center rounded-[2rem] border border-black/5 bg-white/80 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.15)]">
        <Image
          src={src}
          alt={alt}
          width={260}
          height={260}
          priority
          className="h-full w-full object-contain"
        />

        {/* bubble 上面的裝飾圓點 */}
        <span className="floating-icon-dot absolute -right-3 top-10 h-4 w-4 rounded-full bg-primary/70" />
        <span className="floating-icon-dot-delayed absolute -left-4 bottom-20 h-3 w-3 rounded-full bg-primary/40" />
      </div>
    </div>
  );
}