/**
 * Tarayıcının kriptografik olarak güvenli rastgele sayı üreticisini kullanarak
 * 0 (dahil) ile maxExclusive (hariç) arasında bias oluşturmayan bir tam sayı üretir.
 *
 * Math.random() KULLANILMAZ. crypto.getRandomValues() ile reddetme örneklemesi
 * (rejection sampling) yapılarak modulo yanlılığı (modulo bias) engellenir.
 */
export function secureRandomIndex(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new Error("secureRandomIndex: maxExclusive pozitif bir tam sayı olmalıdır.");
  }

  if (maxExclusive === 1) {
    return 0;
  }

  const UINT32_RANGE = 0x100000000; // 2^32
  const rejectionLimit = Math.floor(UINT32_RANGE / maxExclusive) * maxExclusive;

  const buffer = new Uint32Array(1);
  let randomValue: number;

  do {
    crypto.getRandomValues(buffer);
    randomValue = buffer[0] ?? 0;
  } while (randomValue >= rejectionLimit);

  return randomValue % maxExclusive;
}

/**
 * Bir dizinin rastgele bir elemanını seçer ve seçilen elemanla birlikte
 * o eleman çıkarılmış yeni bir dizi döndürür. Orijinal dizi değiştirilmez.
 */
export function secureRandomPick<T>(items: readonly T[]): { picked: T; rest: T[] } {
  if (items.length === 0) {
    throw new Error("secureRandomPick: boş diziden seçim yapılamaz.");
  }

  const index = secureRandomIndex(items.length);
  const picked = items[index] as T;
  const rest = items.filter((_, i) => i !== index);

  return { picked, rest };
}
