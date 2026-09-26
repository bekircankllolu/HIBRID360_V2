import { describe, expect, it } from "vitest";
import { SERVICE_OFFERINGS } from "@/data/service-offerings";
import { offeringCase, splitLastWord } from "./offering-case";

describe("offeringCase", () => {
  it("büyük harf satırı başlık düzenine çevirir", () => {
    expect(offeringCase("BRAND CONSULTANCY")).toBe("Brand Consultancy");
    expect(offeringCase("AFTER EFFECTS")).toBe("After Effects");
  });

  it("kısaltmaları korur", () => {
    expect(offeringCase("SEM & SEO")).toBe("SEM & SEO");
    expect(offeringCase("3D ANIMATION")).toBe("3D Animation");
    expect(offeringCase("TV")).toBe("TV");
    expect(offeringCase("GIF")).toBe("GIF");
  });

  it("bağlaçları küçük yazar, ilk kelime hariç", () => {
    expect(offeringCase("MARKETING PLAN AND STRATEGY")).toBe("Marketing Plan and Strategy");
    expect(offeringCase("LIVE BROADCAST WITH A SATELLITE UPLINK")).toBe(
      "Live Broadcast with a Satellite Uplink",
    );
  });

  it("tireli ve ayraçlı satırları bozmaz", () => {
    expect(offeringCase("RE-TOUCH")).toBe("Re-Touch");
    expect(offeringCase("ON-SITE VIDEOS")).toBe("On-Site Videos");
    expect(offeringCase("CONVENTIONS – CONFERENCES")).toBe("Conventions – Conferences");
    expect(offeringCase("LIVE BROADCAST / STAGE DIRECTION")).toBe("Live Broadcast / Stage Direction");
  });

  it("veri kaynağındaki hiçbir satırda büyük harf kelime bırakmaz (kısaltma hariç)", () => {
    for (const list of Object.values(SERVICE_OFFERINGS)) {
      for (const line of list) {
        for (const word of offeringCase(line).split(/[\s-]+/)) {
          if (/^[A-Z0-9&/–]+$/.test(word) && word.length > 1) {
            expect(["TV", "SEM", "SEO", "GIF", "AI", "CGI", "2D", "3D"]).toContain(word);
          }
        }
      }
    }
  });
});

describe("splitLastWord", () => {
  it("son kelimeyi sondaki noktalamadan ayırır", () => {
    expect(splitLastWord("Pure. Simple. Powerful.")).toEqual({
      head: "Pure. Simple. ",
      word: "Powerful",
      tail: ".",
    });
    expect(splitLastWord("Off we go!")).toEqual({ head: "Off we ", word: "go", tail: "!" });
  });

  it("tek kelimede baş kısım boştur", () => {
    expect(splitLastWord("Now")).toEqual({ head: "", word: "Now", tail: "" });
  });
});
