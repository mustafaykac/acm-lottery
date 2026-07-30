# Hull City Maç Deneyimi — Kurumsal Kura Sistemi

Yaklaşık 1.000 kişilik bir katılımcı listesinden, İngiltere'de bir Hull City maçını izleme
hakkı kazanacak **5 kişiyi** tek tek, şeffaf ve güvenli rastgelelikle seçen kurumsal kura
uygulaması.

## Özellikler

- Excel (`.xlsx`, `.xls`) ve CSV katılımcı listesi yükleme, otomatik kolon eşleme (Ad Soyad,
  Departman, Sicil No ve yaygın alternatif başlıklar)
- Boş isim / tekrarlı kayıt tespiti ve yükleme öncesi liste önizleme + onay adımı
- Tek tıklamada tek kazanan seçimi (5 buton tıklaması = 5 kazanan), 5–8 saniyelik heyecanlı
  "rulet" animasyonu
- `crypto.getRandomValues()` tabanlı, bias oluşturmayan güvenli rastgele seçim
  (`lib/secure-random.ts`) — `Math.random()` hiçbir yerde kullanılmaz
- Gerçek kazanan, animasyon **başlarken** anında ve güvenli şekilde belirlenir; ekranda sadece
  animasyon bitince açıklanır (görsel isim akışı tamamen kozmetiktir, sonucu etkilemez)
- Aynı kişi iki kez seçilemez, çift tıklama / eşzamanlı kura başlatma engellenir
- Sayfa yenilense bile kura durumu `localStorage` üzerinden korunur (Zustand `persist`)
- Her kura için audit kaydı (`draw-engine.ts`) ve oturum (session) takibi
- Sonuçları CSV, JSON olarak indirme ve yazdırılabilir sonuç ekranı
- Kontrollü "Kurayı Sıfırla" akışı: `KURAYI SIFIRLA` yazılmadan sıfırlama yapılamaz
- Ses efektleri (Web Audio API ile üretilen, telifsiz) — açılıp kapatılabilir
- Tam ekran modu (Fullscreen API), 1920×1080 projeksiyon/TV öncelikli responsive tasarım
- Kurumsal, koyu lacivert + altın/turuncu vurgulu, glassmorphism temalı arayüz

## Teknoloji Yığını

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** — tema, glassmorphism, responsive tasarım
- **Framer Motion** — geçiş ve reveal animasyonları
- **Zustand** (+ `persist`) — durum yönetimi ve `localStorage` kalıcılığı
- **read-excel-file** — `.xlsx` / `.xls` okuma
- **papaparse** — `.csv` okuma
- **canvas-confetti** — kazanan konfeti efekti
- **lucide-react** — ikonlar

> Not: npm'deki `xlsx` (SheetJS) paketinde bilinen güvenlik açıkları bulunduğu için Excel
> okuma işlemi için aktif bakımı olan `read-excel-file` paketi tercih edilmiştir.

## Kurulum

```bash
npm install
```

## Geliştirme Sunucusu

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Production Build

```bash
npm run build
npm run start
```

## Docker ile Çalıştırma

```bash
docker compose up --build
```

Uygulama `http://localhost:3000` adresinde ayağa kalkar. `.env.example` dosyasını `.env`
olarak kopyalayıp `PORT` değerini değiştirebilirsiniz.

## Örnek Veri

`sample-data/ornek-katilimcilar.csv` dosyası 120 kişilik örnek bir katılımcı listesi içerir.
Excel kolon yapısı örneği ve tanınan alternatif kolon başlıkları için
`sample-data/README.md` dosyasına bakın.

## Klasör Yapısı

```text
app/                    Next.js App Router giriş noktaları (layout, page, globals.css)
components/             UI bileşenleri
lib/                    İş mantığı: güvenli rastgelelik, dosya ayrıştırma, ses, dışa aktarma
store/                  Zustand durum yönetimi (persist middleware ile localStorage kalıcılığı)
types/                  Paylaşılan TypeScript tipleri
sample-data/            Örnek CSV ve Excel kolon yapısı dokümantasyonu
public/                 Statik dosyalar (logo, sesler - opsiyonel, dosya yoksa fallback devrede)
```

## Kura Akışı

1. Karşılama ekranı → "Katılımcı Listesini Yükle"
2. Excel/CSV yükleme → otomatik ayrıştırma, geçersiz/tekrarlı kayıt tespiti
3. Liste önizleme → onay
4. Kura ekranı: "1. Kazananı Belirle" butonuna basılır
5. ~5–8 saniyelik rulet animasyonu oynar, arayüz kilitlenir
6. Kazanan büyük bir kartla açıklanır, konfeti patlar, kazananlar paneline eklenir
7. 2., 3., 4., 5. kazananlar için aynı adımlar tekrarlanır
8. 5. kazanandan sonra buton "Kura Tamamlandı" durumuna geçer ve devre dışı kalır
9. Sonuçlar CSV/JSON olarak indirilebilir veya yazdırılabilir

## Güvenli Rastgelelik

`lib/secure-random.ts`, `crypto.getRandomValues()` ile reddetme örneklemesi (rejection
sampling) kullanarak **modulo yanlılığı olmayan** bir tam sayı üretir. Bu fonksiyon hem gerçek
kazanan seçiminde (`lib/draw-engine.ts`) hem de rulet animasyonunun kozmetik isim
döngüsünde kullanılır; kod tabanında hiçbir yerde `Math.random()` yoktur.

## Sıfırlama Güvenliği

Ayarlar panelindeki "Kurayı Sıfırla" işlemi, kullanıcı tam olarak `KURAYI SIFIRLA` yazana kadar
etkinleşmez ve tüm kazananların/audit kayıtlarının silineceğini açıkça belirtir.

## Kabul Kriterleri Kontrol Listesi

- [x] ~1.000 kişilik liste sorunsuz yüklenebiliyor (satır sayısı sınırlaması yok)
- [x] Excel (.xlsx/.xls) ve CSV desteği
- [x] Boş ve tekrarlı kayıt kontrolü
- [x] Her tıklamada yalnızca bir kazanan
- [x] Toplam 5 kazanan, aynı kişi iki kez seçilemez
- [x] `crypto.getRandomValues()` tabanlı güvenli rastgelelik
- [x] Animasyon sırasında buton kilitli
- [x] Sayfa yenilendiğinde kura durumu korunuyor (`localStorage`)
- [x] 5. seçimden sonra kura kapanıyor
- [x] CSV ve JSON olarak dışa aktarma
- [x] 1920×1080 önceliği, responsive tasarım
- [x] `npm run build` hatasız tamamlanıyor

## Bilinen Bağımlılık Uyarıları

`npm audit`, üretim koduyla ilgisi olmayan iki grup uyarı raporlar: (1) `eslint-config-next`
paketinin kendi geliştirme zinciri (yalnızca `next lint` sırasında kullanılır, üretim
paketine dahil edilmez) ve (2) Next.js'in kendi build araç zincirine gömülü `postcss`/`sharp`
sürümleri (uygulamanın çalışma zamanı kodunda kullanılmaz). Her iki grup da yalnızca
`devDependencies` / Next.js'in dahili build araçları kapsamındadır; uygulamanın çalışma zamanı
güvenlik yüzeyini etkilemez.

## Lisans / Marka Notu

`/public/logo.png`, Hull City AFC'nin resmi kulüp logosudur ve şirket içi kullanım amacıyla
eklenmiştir. Logo hem üst menüde hem de çekiliş ekranının başlığında (`components/BrandLogo.tsx`)
orijinal çözünürlüğünde (yeniden sıkıştırılmadan) gösterilir. Dosya kaldırılırsa uygulama hata
vermeden metin tabanlı kurumsal rozete otomatik olarak düşer.
