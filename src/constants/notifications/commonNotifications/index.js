import ProcedureTypes from "../../../enums/ProcedureTypes";
import { getEveningTime, getMiddleOfTheDayTime, getMorningTime } from "../../../utils/timeUtils";


const commonNotifications = [
  {
    procedure: ProcedureTypes.Admiration,
    message:
      "Günaydın {firstName}, güne dinç bir şekilde başlamak için sosyal medya uygulamalar limitimize uymaya devam",
    time: getMorningTime(),
  },
  {
    procedure: ProcedureTypes.Reminder,
    message:
      "Günaydın {firstName}, dünkü sosyal medya uygulama limiti performansını yükseltebilecek potansiyeli başarmak için ne güzel bir gün.",
    time: getMorningTime(),
  },
  {
    procedure: ProcedureTypes.Warning,
    message:
      "Günaydın {firstName}, dünkü sosyal medya uygulama limiti sonucun her ne kadar kötü olmasına rağmen bugün bu sonucu düzeltebilmek senin elinde.",
    time: getMorningTime(),
  },
  {
    procedure: ProcedureTypes.Admiration,
    message:
      "Harika iş çıkardın {firstName}! Öğle arasında bir mola yapmak için harika bir zaman. Biraz dışarı çıkıp temiz hava almayı düşünebilirsiniz.",
    time: getMiddleOfTheDayTime(),
  },
  {
    procedure: ProcedureTypes.Reminder,
    message:
      "Görünüşe göre öğle arasında biraz fazla zaman geçirdin {firstName}. Belki de bir sonraki mola için biraz daha kısa tutmayı düşünebilirsiniz. Sen bunu başarabilirsin, sana güveniyorum!",
    time: getMiddleOfTheDayTime(),
  },
  {
    procedure: ProcedureTypes.Warning,
    message:
      "Eğer öğle arasında sosyal medyada vakit geçirmeye devam edersen, verimliliğini etkilenebilir. Lütfen mola süreni kontrol altında tut ve işine geri dön.",
    time: getMiddleOfTheDayTime(),
  },
  {
    procedure: ProcedureTypes.Admiration,
    message:
      "Akşam olduğunda, senin için harika bir fırsat var {firstName}! Sosyal medya kullanımını azaltarak rahatlayabilir ve başka keyifli aktivitelere zaman ayırabilirsin. Kendine bir iyilik yap ve dijital dünyadan biraz uzaklaş.",
    time: getEveningTime(),
  },
  {
    procedure: ProcedureTypes.Reminder,
    message:
      "Akşam üzeri sosyal medya kullanımını kontrol etmeyi unutma {firstName}. Eğer biraz fazla zaman harcıyorsan, bir sonraki adımda biraz daha kısa süreler deneyebilirsin. Küçük adımlarla hedefine ulaşacaksın!",
    time: getEveningTime(),
  },
  {
    procedure: ProcedureTypes.Warning,
    message:
      "Akşam saatleri yaklaşıyor ve hala sosyal medyada mı takılıyorsun {firstName}? Ekranların uyku kaliteni olumsuz etkileyebilir. Lütfen ekran süreni azalt ve rahatlamak için başka aktivitelere yönel. Sağlıklı bir gece uykusu için kendine şans ver!",
    time: getEveningTime(),
  },
];

export default commonNotifications;
