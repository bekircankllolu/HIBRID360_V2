import { getTranslations } from "next-intl/server";
import type { LegalBlock, LegalDoc } from "@/types/legal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListJsonLd } from "@/lib/schema";
import type { Locale } from "@/i18n/routing";
import { LegalShell, type LegalTocItem } from "./LegalShell";
import { sentenceCaseTitle } from "./legal-title";
import styles from "./PolicyPage.module.css";

/**
 * Kurumsal politika/yasal sayfaların ortak render motoru — brief 14, 18.9.
 * İçerik src/data/policies/*.ts içinde, müşterinin teslim ettiği kurumsal
 * politika paketinden birebir aktarılmıştır.
 *
 * LAB (monks policy sayfaları): sunum `LegalShell`'de — rail'de "Yasal" +
 * dokümanın kendi güncelleme satırı, dev dar başlık, yapışkan içindekiler,
 * ~68ch gövde. Metin ve blok sırası değişmedi; başlıklara yalnız çapa
 * kimliği (`bolum-N`) eklendi.
 */

/** Başlık blokları → içindekiler; kimlik sırası blok sırasıyla aynı. */
function headingIds(blocks: readonly LegalBlock[]): Map<number, LegalTocItem> {
  const map = new Map<number, LegalTocItem>();
  blocks.forEach((block, index) => {
    if (block.kind === "heading") {
      map.set(index, { id: `bolum-${map.size + 1}`, label: block.text });
    }
  });
  return map;
}

export async function PolicyPage({
  doc,
  locale,
  breadcrumb,
}: {
  doc: LegalDoc;
  locale: Locale;
  breadcrumb: Array<{ name: string; path: string }>;
}) {
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tLab = await getTranslations({ locale, namespace: "lab.legal" });
  const headings = headingIds(doc.blocks);

  return (
    <>
      <JsonLd data={breadcrumbListJsonLd(locale, breadcrumb)} />
      <LegalShell
        rail={tNav("legal")}
        updated={doc.lastUpdated}
        title={sentenceCaseTitle(doc.title, locale)}
        subtitle={doc.subtitle}
        toc={Array.from(headings.values())}
        tocLabel={tLab("toc")}
      >
        {doc.intro && <p className={styles.intro}>{doc.intro}</p>}

        {doc.blocks.map((block, index) => {
          switch (block.kind) {
            case "heading":
              return (
                <h2 key={index} id={headings.get(index)?.id}>
                  {block.text}
                </h2>
              );
            case "paragraph":
              return <p key={index}>{block.text}</p>;
            case "list":
              return (
                <ul key={index}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            case "callout":
              return (
                <p key={index} className={styles.callout}>
                  {block.text}
                </p>
              );
            case "table":
              return (
                <div key={index} className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        {block.headers.map((header) => (
                          <th key={header} scope="col">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            default:
              return null;
          }
        })}
      </LegalShell>
    </>
  );
}
