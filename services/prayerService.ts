import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

export class PrayerService {
  /**
   * Belirtilen koordinatlar ve tarihe göre namaz vakitlerini hesaplar.
   */
  static getPrayerTimes(latitude: number, longitude: number, date: Date = new Date()) {
    const coordinates = new Coordinates(latitude, longitude);
    const params = CalculationMethod.Turkey(); // Türkiye için Diyanet yöntemi örneği
    
    // Uygulama geneli hesaplama burada yapılabilir
    return new PrayerTimes(coordinates, date, params);
  }
}
