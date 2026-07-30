# Ses Dosyaları (opsiyonel)

Uygulama varsayılan olarak `lib/sound-manager.ts` içinde Web Audio API ile üretilen (telifsiz,
harici dosya gerektirmeyen) ses efektlerini kullanır. Bu klasöre aşağıdaki isimlerle gerçek
`.mp3` dosyaları eklerseniz, uygulama otomatik olarak önce bu dosyaları kullanmayı dener;
dosya bulunamaz veya yüklenemezse hatasız şekilde sentezlenmiş sese geri döner:

- `draw-start.mp3` — Kura başlarken kısa yükseliş sesi
- `tick.mp3` — İsimler dönerken hafif tık sesi
- `tension.mp3` — Yavaşlama sırasında gerilim sesi
- `winner.mp3` — Kazanan açıklanırken başarı sesi
- `celebration.mp3` — Konfeti sırasında kutlama sesi

Harici/telifli ses dosyası eklemeyin; yalnızca telifsiz (royalty-free) veya kurum içi
üretilmiş sesler kullanın.
