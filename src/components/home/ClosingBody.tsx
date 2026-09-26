import { siteImages } from "@/data/site-images";
import { ScrollScrubVideo } from "./ScrollScrubVideo";
import styles from "./ClosingBody.module.css";

/** Scroll ile oynatılan E.T. sahnesi ve marka imzası. */
export function ClosingBody() {
  return (
    <section className={styles.section} data-scroll-scrub data-ground="black">
      <div className={styles.stage}>
        <ScrollScrubVideo
          className={styles.media}
          src={siteImages.home.closingBody.videoSrc}
          poster={siteImages.home.closingBody.src}
        />
        {/* LAB: imza cümlesi artık hemen üstteki HomeClaim'de kelime kelime
            okunuyor; film metinsiz, saf sinema anı (monks tam genişlik video). */}
      </div>
    </section>
  );
}
