"use client";
import React, { useState, useTransition } from "react";
import { Loader2, Save, Globe, Phone, Share2, MapPin, Star, Search, Layout, AlignLeft, Image as ImageIcon, Megaphone, Paintbrush, Type, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateSettings } from "@/actions/settings";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { cn } from "@/lib/utils";

interface SettingsFormProps {
  settings: Record<string, string>;
}

const TABS = [
  { id: "general", label: "Genel", icon: Globe },
  { id: "contact", label: "İletişim", icon: Phone },
  { id: "social", label: "Sosyal Medya", icon: Share2 },
  { id: "ecommerce", label: "E-Ticaret Platformları", icon: ShoppingCart },
  { id: "location", label: "Konum", icon: MapPin },
  { id: "review", label: "Google Değerlendirme", icon: Star },
  { id: "seo", label: "SEO", icon: Search },
  { id: "appearance", label: "Görünüm", icon: Type },
  { id: "header", label: "Header", icon: Layout },
  { id: "hero", label: "Hero Bölümü", icon: Megaphone },
  { id: "blog", label: "Blog", icon: AlignLeft },
  { id: "about", label: "Hakkımızda Sayfası", icon: AlignLeft },
  { id: "footer", label: "Footer", icon: AlignLeft },
  { id: "interior", label: "İç Mimarlık (Ana Sayfa)", icon: Paintbrush },
  { id: "interior_page", label: "İç Mimarlık Sayfası", icon: Layout },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function Row({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div className={cn("grid gap-4", cols === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-50 bg-gray-50/50">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-10 h-5.5 rounded-full transition-colors cursor-pointer",
          checked ? "bg-slate-800" : "bg-gray-200"
        )}
      >
        <span className={cn(
          "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )} />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

function ImageField({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt={label} className="h-12 w-12 object-cover rounded-lg border border-gray-200 bg-gray-50" />
        ) : (
          <div className="h-12 w-12 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
            <ImageIcon className="h-4 w-4 text-gray-300" />
          </div>
        )}
        <div className="flex gap-2">
          <button type="button" onClick={() => setOpen(true)} className="px-3 py-1.5 text-xs font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            {value ? "Değiştir" : "Görsel Seç"}
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")} className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
              Kaldır
            </button>
          )}
        </div>
      </div>
      {open && <MediaPickerModal onSelect={(urls) => { onChange(urls[0]); setOpen(false); }} onClose={() => setOpen(false)} />}
    </Field>
  );
}

export function SettingsForm({ settings: initialSettings }: SettingsFormProps) {
  const [s, setS] = useState<Record<string, string>>(initialSettings);
  const [activeTab, setActiveTab] = useState("general");
  const [isPending, startTransition] = useTransition();

  const set = (key: string, value: string) => setS((prev) => ({ ...prev, [key]: value }));
  const bool = (key: string) => s[key] === "true";
  const setBool = (key: string, v: boolean) => set(key, v ? "true" : "false");

  function handleSave() {
    startTransition(async () => {
      const res = await updateSettings(s) as any;
      if (res?.error) toast.error(res.error);
      else toast.success("Ayarlar kaydedildi.");
    });
  }

  return (
    <div className="space-y-5">
      {/* Tab nav */}
      <div className="bg-white rounded-xl border border-gray-100 p-1.5 flex flex-wrap gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="space-y-4">
        {activeTab === "general" && (
          <>
            <Section title="Site Kimliği">
              <Row>
                <Field label="Site Adı"><Input value={s.site_name || ""} onChange={(e) => set("site_name", e.target.value)} /></Field>
                <Field label="Kısa Açıklama (Tagline)"><Input value={s.site_tagline || ""} onChange={(e) => set("site_tagline", e.target.value)} /></Field>
              </Row>
              <Field label="Site Açıklaması">
                <Textarea value={s.site_description || ""} onChange={(e) => set("site_description", e.target.value)} rows={3} />
              </Field>
            </Section>
            <Section title="Görsel Kimlik">
              <Row>
                <ImageField label="Logo" hint="SVG veya PNG, şeffaf arka plan önerilir" value={s.logo || ""} onChange={(v) => set("logo", v)} />
                <ImageField label="Favicon" hint="32×32 veya 64×64 ICO / PNG" value={s.favicon || ""} onChange={(v) => set("favicon", v)} />
              </Row>
            </Section>
          </>
        )}

        {activeTab === "contact" && (
          <Section title="İletişim Bilgileri">
            <Row>
              <Field label="Telefon" hint="Görünür telefon numarası"><Input value={s.phone || ""} onChange={(e) => set("phone", e.target.value)} placeholder="+90 212 000 00 00" /></Field>
              <Field label="WhatsApp Numarası" hint="Başında + olmadan veya ile"><Input value={s.whatsapp || ""} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+905320000000" /></Field>
            </Row>
            <Field label="E-posta Adresi"><Input type="email" value={s.email || ""} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field label="Açık Adres">
              <Textarea value={s.address || ""} onChange={(e) => set("address", e.target.value)} rows={2} />
            </Field>
            <Row>
              <Field label="Hafta içi Çalışma Saatleri"><Input value={s.working_hours || ""} onChange={(e) => set("working_hours", e.target.value)} placeholder="Pzt–Cum: 09:00–18:00" /></Field>
              <Field label="Hafta sonu Çalışma Saatleri"><Input value={s.working_hours_weekend || ""} onChange={(e) => set("working_hours_weekend", e.target.value)} placeholder="Cmt: 10:00–17:00" /></Field>
            </Row>
          </Section>
        )}

        {activeTab === "social" && (
          <Section title="Sosyal Medya Linkleri">
            {[
              { key: "instagram", label: "Instagram" },
              { key: "facebook", label: "Facebook" },
              { key: "pinterest", label: "Pinterest" },
              { key: "youtube", label: "YouTube" },
              { key: "twitter", label: "X (Twitter)" },
              { key: "linkedin", label: "LinkedIn" },
              { key: "tiktok", label: "TikTok" },
            ].map(({ key, label }) => (
              <Field key={key} label={label}>
                <Input type="url" value={s[key] || ""} onChange={(e) => set(key, e.target.value)} placeholder="https://" />
              </Field>
            ))}
          </Section>
        )}

        {activeTab === "ecommerce" && (
          <Section title="E-Ticaret Platform Linkleri">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Not:</strong> Bu linkler footer'da gösterilecektir. Müşterileriniz ürünlerinizi bu platformlardan da satın alabilir.
              </p>
            </div>
            <Field label="Trendyol Mağaza Linki" hint="Ana mağaza sayfanızın linki">
              <Input type="url" value={s.ecommerce_trendyol_url || ""} onChange={(e) => set("ecommerce_trendyol_url", e.target.value)} placeholder="https://www.trendyol.com/magaza/..." />
            </Field>
            <Field label="Hepsiburada Mağaza Linki" hint="Ana mağaza sayfanızın linki">
              <Input type="url" value={s.ecommerce_hepsiburada_url || ""} onChange={(e) => set("ecommerce_hepsiburada_url", e.target.value)} placeholder="https://www.hepsiburada.com/magaza/..." />
            </Field>
            <Field label="Shopier Mağaza Linki" hint="Ana mağaza sayfanızın linki">
              <Input type="url" value={s.ecommerce_shopier_url || ""} onChange={(e) => set("ecommerce_shopier_url", e.target.value)} placeholder="https://www.shopier.com/..." />
            </Field>
            <div className="pt-2">
              <Toggle checked={bool("ecommerce_show_in_footer")} onChange={(v) => setBool("ecommerce_show_in_footer", v)} label="Footer'da göster" />
            </div>
          </Section>
        )}

        {activeTab === "location" && (
          <>
            <Section title="Google Maps">
              <Field label="Google Maps URL" hint="Paylaş → Bağlantıyı kopyala">
                <Input type="url" value={s.google_maps_url || ""} onChange={(e) => set("google_maps_url", e.target.value)} placeholder="https://maps.google.com/..." />
              </Field>
              <Field label="Embed Kodu" hint='Google Maps "Göm" seçeneğinden alın'>
                <Textarea value={s.google_maps_embed || ""} onChange={(e) => set("google_maps_embed", e.target.value)} rows={4} className="font-mono text-xs" placeholder='<iframe src="..." ...></iframe>' />
              </Field>
            </Section>
            <Section title="Harita Ayarları">
              <Row>
                <Field label="Harita Başlığı"><Input value={s.map_title || ""} onChange={(e) => set("map_title", e.target.value)} placeholder="Showroom Konumumuz" /></Field>
                <Field label="Harita Açıklaması"><Input value={s.map_description || ""} onChange={(e) => set("map_description", e.target.value)} /></Field>
              </Row>
              <Row>
                <Field label="Harita Genişliği" hint="Örn: 800px, 100%, 80vw"><Input value={s.map_width || ""} onChange={(e) => set("map_width", e.target.value)} placeholder="800px" /></Field>
                <Field label="Harita Yüksekliği" hint="Örn: 600px, 400px"><Input value={s.map_height || ""} onChange={(e) => set("map_height", e.target.value)} placeholder="600px" /></Field>
              </Row>
            </Section>
            <Section title="Koordinatlar (Opsiyonel)">
              <Row>
                <Field label="Enlem (Latitude)"><Input value={s.latitude || ""} onChange={(e) => set("latitude", e.target.value)} placeholder="41.0082" /></Field>
                <Field label="Boylam (Longitude)"><Input value={s.longitude || ""} onChange={(e) => set("longitude", e.target.value)} placeholder="28.9784" /></Field>
              </Row>
            </Section>
          </>
        )}

        {activeTab === "review" && (
          <Section title="Google Değerlendirme Bölümü">
            <Field label="Google Review Linki">
              <Input type="url" value={s.google_review_link || ""} onChange={(e) => set("google_review_link", e.target.value)} placeholder="https://g.page/r/..." />
            </Field>
            <Row>
              <Field label="Başlık"><Input value={s.google_review_title || ""} onChange={(e) => set("google_review_title", e.target.value)} /></Field>
              <Field label="Buton Metni"><Input value={s.google_review_button || ""} onChange={(e) => set("google_review_button", e.target.value)} /></Field>
            </Row>
            <Field label="Açıklama">
              <Textarea value={s.google_review_description || ""} onChange={(e) => set("google_review_description", e.target.value)} rows={2} />
            </Field>
            <div className="space-y-3 pt-1">
              <Toggle checked={bool("google_review_show")} onChange={(v) => setBool("google_review_show", v)} label="Genel olarak aktif" />
              <Toggle checked={bool("google_review_show_home")} onChange={(v) => setBool("google_review_show_home", v)} label="Ana sayfada göster" />
              <Toggle checked={bool("google_review_show_contact")} onChange={(v) => setBool("google_review_show_contact", v)} label="İletişim sayfasında göster" />
            </div>
          </Section>
        )}

        {activeTab === "seo" && (
          <Section title="Varsayılan SEO Ayarları">
            <Field label="SEO Başlık (Title)" hint="60 karakteri geçmemesi önerilir">
              <Input value={s.seo_title || ""} onChange={(e) => set("seo_title", e.target.value)} />
              <p className="text-xs text-gray-400 mt-1">{(s.seo_title || "").length} karakter</p>
            </Field>
            <Field label="SEO Açıklama (Description)" hint="160 karakteri geçmemesi önerilir">
              <Textarea value={s.seo_description || ""} onChange={(e) => set("seo_description", e.target.value)} rows={3} />
              <p className="text-xs text-gray-400 mt-1">{(s.seo_description || "").length} karakter</p>
            </Field>
            <ImageField label="Open Graph Görseli" hint="1200×630px PNG/JPG önerilir" value={s.seo_og_image || ""} onChange={(v) => set("seo_og_image", v)} />
            <Field label="Robots" hint="Varsayılan: index,follow">
              <Input value={s.seo_robots || ""} onChange={(e) => set("seo_robots", e.target.value)} placeholder="index,follow" />
            </Field>
          </Section>
        )}

        {activeTab === "appearance" && (
          <Section title="Yazı Tipi Ayarları">
            <Field label="Ana Yazı Tipi" hint="Google Fonts'tan bir font seçin">
              <select
                value={s.font_family || "Inter"}
                onChange={(e) => set("font_family", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value="Inter">Inter (Varsayılan)</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Raleway">Raleway</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Merriweather">Merriweather</option>
                <option value="Nunito">Nunito</option>
                <option value="Ubuntu">Ubuntu</option>
                <option value="Work Sans">Work Sans</option>
              </select>
            </Field>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Önizleme:</strong>
              </p>
              <div style={{ fontFamily: s.font_family || "Inter" }} className="space-y-2">
                <p className="text-2xl font-bold">Başlık Örneği</p>
                <p className="text-base">Normal metin örneği. Bu yazı tipi sitenizde kullanılacak.</p>
                <p className="text-sm text-gray-600">Küçük metin örneği</p>
              </div>
            </div>
          </Section>
        )}

        {activeTab === "header" && (
          <>
            <Section title="Duyuru Bandı">
              <Toggle checked={bool("header_announcement_active")} onChange={(v) => setBool("header_announcement_active", v)} label="Duyuru bandını göster" />
              <Field label="Duyuru Metni">
                <Input value={s.header_announcement || ""} onChange={(e) => set("header_announcement", e.target.value)} placeholder="Ücretsiz kargo kampanyamız devam ediyor..." />
              </Field>
            </Section>
            <Section title="Header CTA Butonu">
              <Row>
                <Field label="Buton Metni"><Input value={s.header_cta_label || ""} onChange={(e) => set("header_cta_label", e.target.value)} /></Field>
                <Field label="Buton Linki"><Input value={s.header_cta_href || ""} onChange={(e) => set("header_cta_href", e.target.value)} placeholder="/kategoriler" /></Field>
              </Row>
            </Section>
          </>
        )}

        {activeTab === "hero" && (
          <Section title="Ana Sayfa Hero Bölümü">
            <Row>
              <Field label="Üst Etiket (Overline)"><Input value={s.hero_subtitle || ""} onChange={(e) => set("hero_subtitle", e.target.value)} placeholder="Premium Koleksiyon" /></Field>
              <Field label="CTA Buton Metni"><Input value={s.hero_cta_label || ""} onChange={(e) => set("hero_cta_label", e.target.value)} /></Field>
            </Row>
            <Field label="Ana Başlık">
              <Input value={s.hero_title || ""} onChange={(e) => set("hero_title", e.target.value)} />
            </Field>
            <Field label="Açıklama Metni">
              <Textarea value={s.hero_description || ""} onChange={(e) => set("hero_description", e.target.value)} rows={3} />
            </Field>
            <Row>
              <Field label="CTA Linki"><Input value={s.hero_cta_href || ""} onChange={(e) => set("hero_cta_href", e.target.value)} placeholder="/kategoriler" /></Field>
            </Row>
            <ImageField label="Hero Arka Plan Görseli" hint="1920×1080px önerilir" value={s.hero_image || ""} onChange={(v) => set("hero_image", v)} />
          </Section>
        )}

        {activeTab === "blog" && (
          <Section title="Blog Ayarları">
            <Toggle checked={bool("blog_show_homepage")} onChange={(v) => setBool("blog_show_homepage", v)} label="Ana sayfada blog yazılarını göster" />
          </Section>
        )}

        {activeTab === "about" && (
          <>
            <Section title="Hero Bölümü">
              <Row>
                <Field label="Overline Etiket"><Input value={s.about_hero_overline || ""} onChange={(e) => set("about_hero_overline", e.target.value)} placeholder="Hikayemiz" /></Field>
                <Field label="Ana Başlık"><Input value={s.about_hero_title || ""} onChange={(e) => set("about_hero_title", e.target.value)} placeholder="Hakkımızda" /></Field>
              </Row>
              <ImageField label="Hero Arka Plan Görseli" hint="1920×1080px önerilir" value={s.about_hero_bg || ""} onChange={(v) => set("about_hero_bg", v)} />
            </Section>

            <Section title="Marka Hikayesi Bölümü">
              <Row>
                <Field label="Overline Etiket"><Input value={s.about_story_overline || ""} onChange={(e) => set("about_story_overline", e.target.value)} placeholder="ESAMIR" /></Field>
                <Field label="Başlık"><Input value={s.about_story_title || ""} onChange={(e) => set("about_story_title", e.target.value)} placeholder="Zarafeti Yaşam Alanlarına Taşıyoruz" /></Field>
              </Row>
              <Field label="1. Paragraf">
                <Textarea value={s.about_story_text1 || ""} onChange={(e) => set("about_story_text1", e.target.value)} rows={3} />
              </Field>
              <Field label="2. Paragraf">
                <Textarea value={s.about_story_text2 || ""} onChange={(e) => set("about_story_text2", e.target.value)} rows={3} />
              </Field>
              <Field label="3. Paragraf">
                <Textarea value={s.about_story_text3 || ""} onChange={(e) => set("about_story_text3", e.target.value)} rows={3} />
              </Field>
              <ImageField label="Hikaye Görseli" hint="4:5 oran önerilir" value={s.about_story_image || ""} onChange={(v) => set("about_story_image", v)} />
            </Section>

            <Section title="İç Mimarlık Felsefesi">
              <Row>
                <Field label="Overline Etiket"><Input value={s.about_philosophy_overline || ""} onChange={(e) => set("about_philosophy_overline", e.target.value)} placeholder="İç Mimarlık Felsefemiz" /></Field>
                <Field label="Başlık"><Input value={s.about_philosophy_title || ""} onChange={(e) => set("about_philosophy_title", e.target.value)} placeholder="Mekan, Anlam Kazanır" /></Field>
              </Row>
              <Field label="Açıklama">
                <Textarea value={s.about_philosophy_desc || ""} onChange={(e) => set("about_philosophy_desc", e.target.value)} rows={2} />
              </Field>
              {[1, 2, 3].map((num) => (
                <div key={num} className="border-t border-gray-100 pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
                  <p className="text-xs font-semibold text-gray-500 mb-3">Özellik {num}</p>
                  <Row>
                    <Field label="Başlık"><Input value={s[`about_philosophy_item${num}_title`] || ""} onChange={(e) => set(`about_philosophy_item${num}_title`, e.target.value)} /></Field>
                    <Field label="Numara"><Input value={s[`about_philosophy_item${num}_num`] || ""} onChange={(e) => set(`about_philosophy_item${num}_num`, e.target.value)} placeholder={`0${num}`} /></Field>
                  </Row>
                  <Field label="Açıklama">
                    <Textarea value={s[`about_philosophy_item${num}_desc`] || ""} onChange={(e) => set(`about_philosophy_item${num}_desc`, e.target.value)} rows={2} />
                  </Field>
                </div>
              ))}
            </Section>

            <Section title="İran Halısı Mirası">
              <Row>
                <Field label="Overline Etiket"><Input value={s.about_heritage_overline || ""} onChange={(e) => set("about_heritage_overline", e.target.value)} placeholder="İran Halısı Geleneği" /></Field>
                <Field label="Başlık"><Input value={s.about_heritage_title || ""} onChange={(e) => set("about_heritage_title", e.target.value)} placeholder="Asırların Birikimiyle Dokunan Sanat" /></Field>
              </Row>
              <Field label="1. Paragraf">
                <Textarea value={s.about_heritage_text1 || ""} onChange={(e) => set("about_heritage_text1", e.target.value)} rows={3} />
              </Field>
              <Field label="2. Paragraf">
                <Textarea value={s.about_heritage_text2 || ""} onChange={(e) => set("about_heritage_text2", e.target.value)} rows={3} />
              </Field>
              <Row>
                <ImageField label="Sol Görsel" hint="3:4 oran önerilir" value={s.about_heritage_img1 || ""} onChange={(v) => set("about_heritage_img1", v)} />
                <ImageField label="Sağ Görsel" hint="3:4 oran önerilir" value={s.about_heritage_img2 || ""} onChange={(v) => set("about_heritage_img2", v)} />
              </Row>
            </Section>

            <Section title="İstatistikler">
              {[1, 2, 3, 4].map((num) => (
                <Row key={num}>
                  <Field label={`${num}. Sayı`}><Input value={s[`about_stat${num}_number`] || ""} onChange={(e) => set(`about_stat${num}_number`, e.target.value)} placeholder="500+" /></Field>
                  <Field label={`${num}. Etiket`}><Input value={s[`about_stat${num}_label`] || ""} onChange={(e) => set(`about_stat${num}_label`, e.target.value)} placeholder="Tamamlanan Proje" /></Field>
                </Row>
              ))}
            </Section>

            <Section title="CTA Bölümü">
              <Row>
                <Field label="Başlık"><Input value={s.about_cta_title || ""} onChange={(e) => set("about_cta_title", e.target.value)} placeholder="Birlikte Yaratın" /></Field>
                <Field label="Açıklama"><Input value={s.about_cta_desc || ""} onChange={(e) => set("about_cta_desc", e.target.value)} /></Field>
              </Row>
              <Row>
                <Field label="Birincil Buton Metni"><Input value={s.about_cta_primary_label || ""} onChange={(e) => set("about_cta_primary_label", e.target.value)} placeholder="İletişime Geçin" /></Field>
                <Field label="Birincil Buton Linki"><Input value={s.about_cta_primary_href || ""} onChange={(e) => set("about_cta_primary_href", e.target.value)} placeholder="/iletisim" /></Field>
              </Row>
              <Row>
                <Field label="İkincil Buton Metni"><Input value={s.about_cta_secondary_label || ""} onChange={(e) => set("about_cta_secondary_label", e.target.value)} placeholder="Koleksiyonu İncele" /></Field>
                <Field label="İkincil Buton Linki"><Input value={s.about_cta_secondary_href || ""} onChange={(e) => set("about_cta_secondary_href", e.target.value)} placeholder="/kategoriler" /></Field>
              </Row>
            </Section>
          </>
        )}

        {activeTab === "interior" && (
          <>
            <Section title="Bölüm Metinleri">
              <Row>
                <Field label="Overline Etiket"><Input value={s.interior_label || ""} onChange={(e) => set("interior_label", e.target.value)} placeholder="İç Mimarlık" /></Field>
                <Field label="Başlık (1. Satır)"><Input value={s.interior_title || ""} onChange={(e) => set("interior_title", e.target.value)} placeholder="Mekanı Sanata" /></Field>
              </Row>
              <Field label="Başlık İtalik Kısım (2. Satır)">
                <Input value={s.interior_title_italic || ""} onChange={(e) => set("interior_title_italic", e.target.value)} placeholder="Dönüştürüyoruz" />
              </Field>
              <Field label="1. Paragraf"><Textarea value={s.interior_text1 || ""} onChange={(e) => set("interior_text1", e.target.value)} rows={3} /></Field>
              <Field label="2. Paragraf"><Textarea value={s.interior_text2 || ""} onChange={(e) => set("interior_text2", e.target.value)} rows={3} /></Field>
              <Row>
                <Field label="CTA Buton Metni"><Input value={s.interior_cta_text || ""} onChange={(e) => set("interior_cta_text", e.target.value)} placeholder="Yaklaşımımızı Keşfedin" /></Field>
                <Field label="CTA Linki"><Input value={s.interior_cta_url || ""} onChange={(e) => set("interior_cta_url", e.target.value)} placeholder="/ic-mimarlik" /></Field>
              </Row>
            </Section>
            <Section title="İstatistikler">
              <Row>
                <Field label="1. Sayı"><Input value={s.interior_stat1_number || ""} onChange={(e) => set("interior_stat1_number", e.target.value)} placeholder="500+" /></Field>
                <Field label="1. Etiket"><Input value={s.interior_stat1_label || ""} onChange={(e) => set("interior_stat1_label", e.target.value)} placeholder="Tamamlanan Proje" /></Field>
              </Row>
              <Row>
                <Field label="2. Sayı"><Input value={s.interior_stat2_number || ""} onChange={(e) => set("interior_stat2_number", e.target.value)} placeholder="20+" /></Field>
                <Field label="2. Etiket"><Input value={s.interior_stat2_label || ""} onChange={(e) => set("interior_stat2_label", e.target.value)} placeholder="Yıllık Deneyim" /></Field>
              </Row>
              <Row>
                <Field label="3. Sayı"><Input value={s.interior_stat3_number || ""} onChange={(e) => set("interior_stat3_number", e.target.value)} placeholder="1000+" /></Field>
                <Field label="3. Etiket"><Input value={s.interior_stat3_label || ""} onChange={(e) => set("interior_stat3_label", e.target.value)} placeholder="Ürün Çeşidi" /></Field>
              </Row>
              <Row>
                <Field label="4. Sayı"><Input value={s.interior_stat4_number || ""} onChange={(e) => set("interior_stat4_number", e.target.value)} placeholder="98%" /></Field>
                <Field label="4. Etiket"><Input value={s.interior_stat4_label || ""} onChange={(e) => set("interior_stat4_label", e.target.value)} placeholder="Müşteri Memnuniyeti" /></Field>
              </Row>
            </Section>
            <Section title="Görseller">
              <ImageField label="1. Görsel (sol)" hint="3:4 oran önerilir" value={s.interior_image1 || ""} onChange={(v) => set("interior_image1", v)} />
              <ImageField label="2. Görsel (sağ)" hint="3:4 oran önerilir" value={s.interior_image2 || ""} onChange={(v) => set("interior_image2", v)} />
            </Section>
          </>
        )}

        {activeTab === "interior_page" && (
          <>
            <Section title="Hero Bölümü">
              <Row>
                <Field label="Overline Etiket"><Input value={s.interior_page_hero_overline || ""} onChange={(e) => set("interior_page_hero_overline", e.target.value)} placeholder="Hizmetlerimiz" /></Field>
                <Field label="Ana Başlık (1. Satır)"><Input value={s.interior_page_hero_title || ""} onChange={(e) => set("interior_page_hero_title", e.target.value)} placeholder="İç Mimarlık &" /></Field>
              </Row>
              <Field label="Ana Başlık İtalik (2. Satır)">
                <Input value={s.interior_page_hero_title_italic || ""} onChange={(e) => set("interior_page_hero_title_italic", e.target.value)} placeholder="Tasarım Danışmanlığı" />
              </Field>
              <Field label="Açıklama">
                <Textarea value={s.interior_page_hero_desc || ""} onChange={(e) => set("interior_page_hero_desc", e.target.value)} rows={2} placeholder="Yaşam alanlarınızı sizin için tasarlıyor..." />
              </Field>
              <ImageField label="Hero Arka Plan Görseli" hint="1920×1080px önerilir" value={s.interior_page_hero_bg || ""} onChange={(v) => set("interior_page_hero_bg", v)} />
            </Section>

            <Section title="Yaklaşımımız Bölümü">
              <Row>
                <Field label="Overline Etiket"><Input value={s.interior_page_approach_overline || ""} onChange={(e) => set("interior_page_approach_overline", e.target.value)} placeholder="Yaklaşımımız" /></Field>
                <Field label="Başlık"><Input value={s.interior_page_approach_title || ""} onChange={(e) => set("interior_page_approach_title", e.target.value)} placeholder="Her Mekan Bir Kimlik Taşır" /></Field>
              </Row>
              <Field label="1. Paragraf">
                <Textarea value={s.interior_page_approach_text1 || ""} onChange={(e) => set("interior_page_approach_text1", e.target.value)} rows={3} />
              </Field>
              <Field label="2. Paragraf">
                <Textarea value={s.interior_page_approach_text2 || ""} onChange={(e) => set("interior_page_approach_text2", e.target.value)} rows={3} />
              </Field>
              <Field label="Özellikler (her satır bir özellik)">
                <Textarea value={s.interior_page_approach_features || ""} onChange={(e) => set("interior_page_approach_features", e.target.value)} rows={4} placeholder="Kişiye özel tasarım konsepti&#10;Ücretsiz ilk danışmanlık görüşmesi&#10;3D görselleştirme imkânı&#10;Yerinde uygulama desteği" />
              </Field>
              <Row>
                <Field label="CTA Buton Metni"><Input value={s.interior_page_approach_cta || ""} onChange={(e) => set("interior_page_approach_cta", e.target.value)} placeholder="Danışmanlık Talep Et" /></Field>
                <Field label="CTA Linki"><Input value={s.interior_page_approach_cta_url || ""} onChange={(e) => set("interior_page_approach_cta_url", e.target.value)} placeholder="/iletisim" /></Field>
              </Row>
              <Row>
                <ImageField label="Sol Görsel" hint="3:4 oran önerilir" value={s.interior_page_approach_img1 || ""} onChange={(v) => set("interior_page_approach_img1", v)} />
                <ImageField label="Sağ Görsel" hint="3:4 oran önerilir" value={s.interior_page_approach_img2 || ""} onChange={(v) => set("interior_page_approach_img2", v)} />
              </Row>
            </Section>

            <Section title="Hizmetlerimiz Bölümü">
              <Row>
                <Field label="Overline Etiket"><Input value={s.interior_page_services_overline || ""} onChange={(e) => set("interior_page_services_overline", e.target.value)} placeholder="Neler Yapıyoruz" /></Field>
                <Field label="Başlık"><Input value={s.interior_page_services_title || ""} onChange={(e) => set("interior_page_services_title", e.target.value)} placeholder="Hizmetlerimiz" /></Field>
              </Row>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="border-t border-gray-100 pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
                  <p className="text-xs font-semibold text-gray-500 mb-3">Hizmet {num}</p>
                  <Row>
                    <Field label="Başlık"><Input value={s[`interior_page_service${num}_title`] || ""} onChange={(e) => set(`interior_page_service${num}_title`, e.target.value)} /></Field>
                    <Field label="İkon Numarası"><Input value={s[`interior_page_service${num}_icon`] || ""} onChange={(e) => set(`interior_page_service${num}_icon`, e.target.value)} placeholder={`0${num}`} /></Field>
                  </Row>
                  <Field label="Açıklama">
                    <Textarea value={s[`interior_page_service${num}_desc`] || ""} onChange={(e) => set(`interior_page_service${num}_desc`, e.target.value)} rows={2} />
                  </Field>
                </div>
              ))}
            </Section>

            <Section title="Süreç Bölümü">
              <Row>
                <Field label="Overline Etiket"><Input value={s.interior_page_process_overline || ""} onChange={(e) => set("interior_page_process_overline", e.target.value)} placeholder="Nasıl Çalışırız" /></Field>
                <Field label="Başlık"><Input value={s.interior_page_process_title || ""} onChange={(e) => set("interior_page_process_title", e.target.value)} placeholder="Süreç" /></Field>
              </Row>
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="border-t border-gray-100 pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
                  <p className="text-xs font-semibold text-gray-500 mb-3">Adım {num}</p>
                  <Row>
                    <Field label="Başlık"><Input value={s[`interior_page_step${num}_title`] || ""} onChange={(e) => set(`interior_page_step${num}_title`, e.target.value)} /></Field>
                    <Field label="Açıklama"><Input value={s[`interior_page_step${num}_desc`] || ""} onChange={(e) => set(`interior_page_step${num}_desc`, e.target.value)} /></Field>
                  </Row>
                </div>
              ))}
            </Section>

            <Section title="CTA Bölümü">
              <Row>
                <Field label="Başlık"><Input value={s.interior_page_cta_title || ""} onChange={(e) => set("interior_page_cta_title", e.target.value)} placeholder="Projenizi Konuşalım" /></Field>
                <Field label="Açıklama"><Input value={s.interior_page_cta_desc || ""} onChange={(e) => set("interior_page_cta_desc", e.target.value)} placeholder="Ücretsiz danışmanlık görüşmesi için..." /></Field>
              </Row>
              <Row>
                <Field label="Buton Metni"><Input value={s.interior_page_cta_button || ""} onChange={(e) => set("interior_page_cta_button", e.target.value)} placeholder="İletişime Geçin" /></Field>
                <Field label="Buton Linki"><Input value={s.interior_page_cta_url || ""} onChange={(e) => set("interior_page_cta_url", e.target.value)} placeholder="/iletisim" /></Field>
              </Row>
            </Section>
          </>
        )}

        {activeTab === "footer" && (
          <>
            <Section title="Footer İçeriği">
              <Field label="Tagline"><Input value={s.footer_tagline || ""} onChange={(e) => set("footer_tagline", e.target.value)} /></Field>
              <Field label="Telif Hakkı Yazısı"><Input value={s.footer_text || ""} onChange={(e) => set("footer_text", e.target.value)} placeholder="ESAMIR © 2024. Tüm hakları saklıdır." /></Field>
              <Field label="Alt Metin (opsiyonel)"><Input value={s.footer_bottom_text || ""} onChange={(e) => set("footer_bottom_text", e.target.value)} /></Field>
            </Section>
            <Section title="Kolon Başlıkları">
              <Row cols={1}>
                <Row>
                  <Field label="1. Kolon Başlığı"><Input value={s.footer_col1_title || ""} onChange={(e) => set("footer_col1_title", e.target.value)} /></Field>
                  <Field label="2. Kolon Başlığı"><Input value={s.footer_col2_title || ""} onChange={(e) => set("footer_col2_title", e.target.value)} /></Field>
                </Row>
                <Field label="3. Kolon Başlığı"><Input value={s.footer_col3_title || ""} onChange={(e) => set("footer_col3_title", e.target.value)} /></Field>
              </Row>
            </Section>
          </>
        )}
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3 flex justify-end z-10">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Kaydet
        </button>
      </div>
    </div>
  );
}
