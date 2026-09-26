import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SERVICE_CATALOG } from "@/data/services";
import { siteImages } from "@/data/site-images";
import type { Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { Reveal } from "../Reveal";
import { Scribble } from "../Scribble";
import styles from "./HomeServices.module.css";

/** Ana sayfada öne çıkan dört hizmet (monks "four strategic service offerings"). */
const FEATURED = ["creative", "production", "digital", "liveBroadcast"] as const;

/**
 * LAB (monks.com ana sayfa hizmet ızgarası) — kademeli dört kart; her
 * kartın sağ üst köşesinin arkasından dev DOLU numara yarım görünür.
 * Başlık, What We Do'nun mevcut giriş cümlesi (uydurma metin yok).
 */
export function HomeServices({ locale }: { locale: Locale }) {
  const t = useTranslations("lab.home");
  const tNav = useTranslations("nav");
  const tWhat = useTranslations("whatWeDo");
  const descriptions = tWhat.raw("list") as Array<{ title: string; body: string }>;

  const items = FEATURED.map((id) => {
    const service = SERVICE_CATALOG.find((entry) => entry.id === id)!;
    const image = service.imageKey ? siteImages.services[service.imageKey] : undefined;
    return {
      ...service,
      description: descriptions.find((item) => item.title === service.name)?.body ?? "",
      image,
    };
  });

  return (
    <section className={styles.section} data-ground="paper" aria-labelledby="home-services-title">
      <div className={styles.head}>
        <p className={`lab-rail ${styles.rail}`} lang="en">
          {tNav("whatWeDo")}
        </p>
        <h2 id="home-services-title" className={`lab-h2 ${styles.title}`}>
          {t.rich("servicesTitle", {
            mark: (chunks) => (
              <Scribble shape="underline" tone="fuchsia" delay={150}>
                {chunks}
              </Scribble>
            ),
          })}
        </h2>
      </div>

      <ol className={styles.grid}>
        {items.map((item, index) => (
          <Reveal as="li" key={item.id} delay={index * 90} className={styles.cell}>
            <article className={styles.card}>
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className={styles.media}>
                {item.image && (
                  <Image
                    src={item.image.src}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
                    style={{ objectPosition: item.image.focus ?? "50% 50%" }}
                  />
                )}
              </div>
              <p className={`lab-meta ${styles.label}`}>{t("serviceLabel")}</p>
              <h3 className={`lab-h3 ${styles.name}`}>
                <Link href={item.href} className={styles.link} lang="en">
                  {item.name}
                </Link>
                <span className={styles.arrow} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </h3>
              <p className={`lab-body ${styles.body}`}>{item.description}</p>
            </article>
          </Reveal>
        ))}
      </ol>

      <div className={styles.more}>
        <Button href="/what-we-do" size="sm" lang={locale}>
          {t("allServices")}
        </Button>
      </div>
    </section>
  );
}
