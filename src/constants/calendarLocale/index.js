import { LocaleConfig } from "react-native-calendars";

const setCalendarLocale = () => {
  LocaleConfig.locales["tr"] = {
    monthNames: [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ],
    monthNamesShort: [
      "Oca.",
      "Şub.",
      "Mar.",
      "Nis.",
      "May.",
      "Haz.",
      "Tem.",
      "Ağu.",
      "Eyl.",
      "Eki.",
      "Kas.",
      "Ara.",
    ],
    dayNames: [
      "Pazar",
      "Pazartesi",
      "Salı",
      "Çarşamba",
      "Perşembe",
      "Cuma",
      "Cumartesi",
    ],
    dayNamesShort: ["Paz.", "Pzt.", "Sal.", "Çar.", "Per.", "Cum.", "Cmt."],
  };

  LocaleConfig.defaultLocale = "tr";
};

export {setCalendarLocale};
