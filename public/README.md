# public/ klasörü

Bu klasördeki aşağıdaki dosyalar **opsiyoneldir**. Uygulama bu dosyalar olmadan da hatasız
çalışır ve otomatik olarak metin/ses tabanlı alternatiflere (fallback) geçer.

- `logo.png` — Hull City resmi kulüp logosu (949×1200px, şeffaf arka plan). Dosya silinir veya
  bulunamazsa hem üst menüde hem de çekiliş ekranının başlığında otomatik olarak kupa ikonlu
  metin tabanlı kurumsal rozete düşülür (bkz. `components/BrandLogo.tsx`).
- `event-background.jpg` — Kullanılırsa arka plan efektlerine ek bir atmosferik görsel katmanı
  olarak eklenebilir. Şu an arka plan tamamen CSS/gradient tabanlıdır, bu dosyaya bağımlı
  değildir.
- `sounds/` — Aşağıya bakın.

Logoyu değiştirmek için: bu klasördeki `logo.png` dosyasının üzerine yenisini kopyalamanız
yeterlidir; kod değişikliği gerekmez. En iyi görünüm için:

- Mümkün olan en yüksek çözünürlüklü PNG dosyayı kullanın — `BrandLogo` bileşeni
  `unoptimized` modda çalıştığı için Next.js dosyayı yeniden sıkıştırmaz, orijinal kalite
  tarayıcıya olduğu gibi ulaşır.
- Şeffaf arka planlı (transparent PNG) kullanın; kare olması zorunlu değildir, bileşen
  `object-contain` ile en-boy oranını koruyarak ortalar.
- Logo, hem sağ üst köşedeki küçük rozet olarak hem de çekiliş ekranının başlığında büyük
  boyutta otomatik olarak görünür.

**Not:** Hull City kulüp logosu telif/marka hakkına tabi bir varlıktır; bu dosya şirket
içi kullanım için doğrudan Hull City AFC'nin kendi resmi görsel kaynağından temin edilmiştir.
