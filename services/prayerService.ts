import { CalculationMethod, Coordinates, PrayerTimes } from 'adhan';

export class PrayerService {
  static getPrayerTimes(latitude: number, longitude: number, date: Date = new Date()) {
    const coordinates = new Coordinates(latitude, longitude);
    const params = CalculationMethod.Turkey();
    return new PrayerTimes(coordinates, date, params);
  }
}
