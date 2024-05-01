import DynamicNotificationTypes from "../../enums/DynamicNotificationTypes";
import ProcedureTypes from "../../enums/ProcedureTypes";

const dynamicNotifications = [
    {
        procedure: ProcedureTypes.Admiration,
        type : DynamicNotificationTypes.BeginningOfSpendTime,
        message: "Hey {firstName}, macera başlıyor! Günlük sosyal medya hedefini tamamlamak için yola çıktın. Unutma, her adım seni başarıya yaklaştırır!"
    },
    {
        procedure: ProcedureTypes.Reminder,
        type : DynamicNotificationTypes.BeginningOfSpendTime,
        message: "{firstName}, unutma, her gün biraz çabayla sosyal medya kullanımınızı kontrol altına alabilirsin. Hedefine odaklan!"
    },
    {
        procedure: ProcedureTypes.Warning,
        type : DynamicNotificationTypes.BeginningOfSpendTime,
        message: "{firstName}, dikkatli ol! Sosyal medyada çok fazla zaman geçirmek seni hedefinden uzaklaştırabilir."
    },
    {
        procedure: ProcedureTypes.Admiration,
        type : DynamicNotificationTypes.NearlyHalfOfSpendTime,
        message: "Sosyal medya kullanım sürenizin yarısına yaklaştınız! Bir mola vermek ister misiniz?"
    },
    {
        procedure: ProcedureTypes.Reminder,
        type : DynamicNotificationTypes.NearlyHalfOfSpendTime,
        message: "Dikkat! Günlük sosyal medya kullanım limitinizin %50'sine yaklaştınız. Fazla zaman kaybetmeden diğer işlerinize de bakmayı unutmayın!"
    },
    {
        procedure: ProcedureTypes.Warning,
        type : DynamicNotificationTypes.NearlyHalfOfSpendTime,
        message: "Hey! Sosyal medyada çok fazla zaman harcıyorsun. Kullanım limitinin yarısına geliyorsun, biraz ara vermez misin?"
    },
    {
        procedure: ProcedureTypes.Admiration,
        type : DynamicNotificationTypes.AfterHalfOfSpendTime,
        message: "Dikkat et {firstName}! Hedefin yarısını biraz aştın. Ama pes etme, hala zamanın var!"
    },
    {
        procedure: ProcedureTypes.Reminder,
        type : DynamicNotificationTypes.AfterHalfOfSpendTime,
        message: "Dikkat et {firstName}, biraz geride kaldın ama telafi etme şansın var. Hedefine odaklan ve zamanını bilinçli kullan!"
    },
    {
        procedure: ProcedureTypes.Warning,
        type : DynamicNotificationTypes.AfterHalfOfSpendTime,
        message: "Acilen harekete geç {firstName}! Hedefinin yarısını aşmak üzere olduğunun farkında mısın? Zamanını boşa harcama!"
    },
    {
        procedure: ProcedureTypes.Admiration,
        type : DynamicNotificationTypes.NearlyAllOfSpendTime,
        message: "Bugün için belirlediğiniz sosyal medya kullanım süreniz sona ermek üzere. Belki biraz dışarı çıkabilir veya sevdiklerinizle vakit geçirebilirsiniz?"
    },
    {
        procedure: ProcedureTypes.Reminder,
        type : DynamicNotificationTypes.NearlyAllOfSpendTime,
        message: "{firstName}, günlük sosyal medya kullanım limitin dolmak üzere. Telefonunu bir kenara bırakıp biraz hava almanın zamanı geldi!"
    },
    {
        procedure: ProcedureTypes.Warning,
        type : DynamicNotificationTypes.NearlyAllOfSpendTime,
        message: "Dikkat {firstName}! Hedefinizi aşmak üzeresiniz. Bu şekilde devam edersen bugünkü hedefinizi tamamlayamayacaksın."
    },
    {
        procedure: ProcedureTypes.Admiration,
        type : DynamicNotificationTypes.AfterAllOfSpendTime,
        message: ""
    },
    {
        procedure: ProcedureTypes.Reminder,
        type : DynamicNotificationTypes.AfterAllOfSpendTime,
        message: ""
    },
    {
        procedure: ProcedureTypes.Warning,
        type : DynamicNotificationTypes.AfterAllOfSpendTime,
        message: ""
    },
    {
        procedure: ProcedureTypes.Admiration,
        type : DynamicNotificationTypes.FailedOfObeyingSpendTime,
        message: "Pes etme {firstName}! Bugün hedefine ulaşamamış olabilirsin, ama yarın yeni bir gün ve yeni bir şans. Yarın daha da güçlü bir şekilde geri dön!"
    },
    {
        procedure: ProcedureTypes.Reminder,
        type : DynamicNotificationTypes.FailedOfObeyingSpendTime,
        message: "Herkesin zor günleri olur {firstName}. Önemli olan pes etmemek. Yarın için yeni bir plan yap ve tekrar dene!"
    },
    {
        procedure: ProcedureTypes.Warning,
        type : DynamicNotificationTypes.FailedOfObeyingSpendTime,
        message: "Sosyal medyaya çok fazla zaman harcıyorsun {firstName}. Hedefine ulaşmak istiyorsan, kullanımını kontrol altına alman şart!"
    }
]

export default dynamicNotifications;