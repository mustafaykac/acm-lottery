# Örnek Veri

## ornek-katilimcilar.csv

Uygulamayı test etmek için 120 kişilik örnek bir katılımcı listesi. `;` (noktalı virgül) ile
ayrılmıştır, UTF-8 BOM içerir (Excel'de doğrudan açılabilir).

Kolonlar: `Ad Soyad;Departman;Sicil No`

## Excel (.xlsx / .xls) kolon yapısı örneği

Uygulama aynı veriyi Excel formatında da kabul eder. Beklenen kolon başlıkları (herhangi bir
sırada olabilir) ve tanınan alternatif başlık isimleri:

| Ad Soyad (veya Ad + Soyad) | Departman   | Sicil No |
|-----------------------------|-------------|----------|
| Yusuf Özkan                 | Pazarlama   | SC1001   |
| Emre Güven                  | Hukuk       | SC1002   |
| Kadir Çelik                 | Müşteri Hizmetleri | SC1003 |

Tanınan alternatif kolon başlıkları:

- Ad Soyad: `Ad Soyad`, `AdSoyad`, `İsim`, `Name`, `Full Name`, `Çalışan Adı`
- Ad / Soyad ayrı kolonlarsa: `Ad` / `Soyad`, `First Name` / `Last Name`
- Departman: `Departman`, `Department`, `Birim`, `Bölüm`
- Sicil No: `Sicil No`, `Sicil`, `Employee Number`, `Personel No`

En az **Ad Soyad** ya da **Ad** kolonu bulunması zorunludur; diğer kolonlar opsiyoneldir.

Not: Bu depoda ikili (binary) bir `.xlsx` örneği bulunmamaktadır; yukarıdaki tabloyu kendi
Excel dosyanıza aktararak veya `ornek-katilimcilar.csv` dosyasını Excel ile açıp `.xlsx` olarak
yeniden kaydederek örnek bir Excel dosyası oluşturabilirsiniz.
