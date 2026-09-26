import type { ReactNode } from "react";
import { preload } from "react-dom";

/**
 * What We Do bölümünün ortak layout'u.
 *
 * Canlı sitede burada Space Grotesk 700 (`--font-chapter-display`) önden
 * isteniyordu: bölüm sayfalarının LCP öğesi o fontla yazılı h1'di.
 *
 * LAB: `lab-monks.css` `--font-chapter-display`'i Lab Display'e eşliyor;
 * Space Grotesk dosyası artık hiçbir başlıkta kullanılmıyor, preload'ı boşa
 * bir istek demekti. Hizmet sayfalarının h1'i (`PageIntro`, `.lab-display`)
 * Inter Tight 500 ile yazılıyor — önden istenen o. React aynı adresi tek
 * `<link>` olarak basar. Canlıya taşınırken lab fontları da taşınmıyorsa bu
 * dosya eski haline (preloadChapterFont) döner.
 */
export default function WhatWeDoLayout({ children }: { children: ReactNode }) {
  preload("/fonts/lab-inter-tight-latin-tr.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  return <>{children}</>;
}
