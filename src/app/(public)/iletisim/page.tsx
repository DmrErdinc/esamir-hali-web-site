import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, Star, ExternalLink, MessageCircle } from "lucide-react";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { getWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "İletişim",
  description: "ESAMIR iletişim bilgileri, konum ve çalışma saatleri.",
};

interface ContactCard {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  value: string;
  href: string | null;
  cta: string | null;
  external?: boolean;
  color?: string;
}

export default async function IletisimPage() {
  const settings = await getSettings();
  const s = { ...DEFAULT_SETTINGS, ...settings };

  const waUrl = (s.whatsapp || s.phone)
    ? getWhatsAppUrl(s.whatsapp || s.phone || "", "Merhaba, ESAMIR hakkında bilgi almak istiyorum.")
    : "#";

  const contactCards: (ContactCard | false | null)[] = [
    s.phone ? {
      icon: Phone,
      title: "Telefon",
      value: s.phone,
      href: `tel:${s.phone}`,
      cta: "Şimdi Ara",
    } : false,
    (s.whatsapp || s.phone) ? {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "Mesaj Gönderin",
      href: waUrl,
      cta: "Yazın",
      external: true,
      color: "#25D366",
    } : false,
    s.email ? {
      icon: Mail,
      title: "E-posta",
      value: s.email,
      href: `mailto:${s.email}`,
      cta: "Mail At",
    } : false,
    s.address ? {
      icon: MapPin,
      title: "Adres",
      value: s.address,
      href: s.google_maps_url || null,
      cta: s.google_maps_url ? "Haritada Gör" : null,
      external: !!s.google_maps_url,
    } : false,
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-800 py-12 md:py-20 lg:py-28">
        <div className="container-brand text-center px-4">
          <p className="text-overline text-gold-light mb-3 md:mb-4 tracking-[0.2em] md:tracking-[0.25em]">Bize Ulaşın</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-cream-50 font-light">İletişim</h1>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="section-padding bg-cream-50">
        <div className="container-brand px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
            {contactCards
              .filter((c): c is ContactCard => c !== false)
              .map((c) => (
                <div key={c.title} className="bg-white p-5 md:p-6 shadow-card flex flex-col">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-cream-100 flex items-center justify-center mb-3 md:mb-4">
                    <c.icon
                      className="h-4 w-4 md:h-5 md:w-5"
                      style={{ color: c.color || "var(--tw-color-gold, #B8944E)" }}
                    />
                  </div>
                  <p className="text-xs font-sans text-brand-400 uppercase tracking-wider mb-1">{c.title}</p>
                  <p className="font-sans text-brand-700 text-sm leading-relaxed flex-1 break-words">{c.value}</p>
                  {c.href && c.cta && (
                    <a
                      href={c.href}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noopener noreferrer" : undefined}
                      className="mt-3 md:mt-4 inline-flex items-center gap-1.5 text-xs font-sans text-gold hover:text-gold-dark transition-colors"
                    >
                      {c.cta}
                      {c.external && <ExternalLink className="h-3 w-3" />}
                    </a>
                  )}
                </div>
              ))}
          </div>

          {/* Working Hours */}
          {s.working_hours && (
            <div className="bg-cream-100 p-5 md:p-8 mb-8 md:mb-12 flex items-start gap-3 md:gap-4 max-w-lg">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-semibold text-brand-800 mb-1">Çalışma Saatleri</p>
                <p className="font-sans text-sm text-brand-600 whitespace-pre-line break-words">{s.working_hours}</p>
              </div>
            </div>
          )}

          {/* Map */}
          {(s.google_maps_embed || s.google_maps_url || s.address) && (
            <div className="mb-8 md:mb-12">
              <h2 className="font-serif text-xl md:text-2xl text-brand-800 font-light mb-4 md:mb-6 text-center">
                {s.map_title || "Showroom Konumumuz"}
              </h2>
              <div className="flex justify-center w-full">
                {s.google_maps_embed ? (
                  <div
                    className="rounded-sm overflow-hidden w-full"
                    style={{
                      width: '100%',
                      maxWidth: s.map_width || '800px',
                      height: s.map_height || '600px',
                      minHeight: '300px'
                    }}
                    dangerouslySetInnerHTML={{ __html: s.google_maps_embed }}
                  />
                ) : (
                  <iframe
                    src={
                      s.address
                        ? `https://maps.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed&hl=tr`
                        : (() => {
                            try {
                              const u = new URL(s.google_maps_url!);
                              u.searchParams.set("output", "embed");
                              return u.toString();
                            } catch {
                              return s.google_maps_url!;
                            }
                          })()
                    }
                    className="rounded-sm border-0 w-full"
                    style={{
                      width: '100%',
                      maxWidth: s.map_width || '800px',
                      height: s.map_height || '600px',
                      minHeight: '300px'
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Konum"
                  />
                )}
              </div>
              {/* Also show address text + link below the map */}
              {s.address && (
                <div className="flex items-start md:items-center justify-center gap-2 md:gap-3 mt-4 px-4">
                  <MapPin className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                  <div className="text-center">
                    <p className="text-sm font-sans text-brand-700 break-words">{s.address}</p>
                    {s.google_maps_url && (
                      <a
                        href={s.google_maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-sans text-gold hover:text-gold-dark mt-0.5 transition-colors"
                      >
                        Google Maps&apos;te Aç <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Google Review */}
          {s.google_review_show === "true" && s.google_review_show_contact === "true" && s.google_review_link && (
            <div className="bg-brand-800 p-6 md:p-10 text-center">
              <div className="flex items-center justify-center gap-1 mb-3 md:mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-gold fill-gold" />
                ))}
              </div>
              <h2 className="font-serif text-xl md:text-2xl text-cream-50 font-light mb-2 md:mb-3">
                {s.google_review_title || "Google'da Değerlendirin"}
              </h2>
              <p className="text-cream-300 font-sans text-sm mb-5 md:mb-6 max-w-md mx-auto px-4">
                {s.google_review_description || "Deneyiminizi paylaşın."}
              </p>
              <a
                href={s.google_review_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 bg-gold text-cream-50 text-sm font-sans font-medium hover:bg-gold-dark transition-colors rounded-sm"
              >
                {s.google_review_button || "Değerlendirme Yap"}
                <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
