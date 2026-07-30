# Demo Veri

## demo-katilimcilar.csv

Uygulamayı hızlıca denemek için 40 kişilik küçük bir demo katılımcı listesi. `;` ile
ayrılmıştır, UTF-8 BOM içerir (Excel'de doğrudan açılabilir).

Kolonlar: `Ad Soyad;Departman;Sicil No`

Kullanmak için: uygulamayı açın → "Katılımcı Listesini Yükle" → bu dosyayı seçin veya
sürükleyin → önizlemeyi onaylayın → kurayı başlatın.

Daha büyük (120 kişilik) bir test listesi için bkz. `../sample-data/ornek-katilimcilar.csv`.

## demo-sadece-adsoyad.csv

Yalnızca **Ad Soyad** kolonu içeren 10 kişilik bir liste — Departman ve Sicil No kolonları hiç
yok. Uygulamanın minimum gereksinimi ("en az ad veya ad soyad") karşıladığını göstermek için
eklendi; yüklendiğinde departman/sicil alanları önizlemede ve kazanan kartlarında otomatik
olarak "-" / "—" şeklinde gösterilir, herhangi bir hata vermez.
