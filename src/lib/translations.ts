import { LanguageCode } from "./useLanguage";

type TranslationKey = string;
type TranslationsDictionary = Record<LanguageCode, Record<TranslationKey, string>>;

export const TRANSLATIONS: TranslationsDictionary = {
  "en-US": {
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.customers": "Customers",
    "nav.agent": "AI Agent",
    "nav.settings": "Settings",
    "nav.signin": "Sign In",

    "hero.badge": "Introducing KYC Mithra",
    "hero.title1": "Identity Verification",
    "hero.title2": "At the speed of light.",
    "hero.subtitle": "Next-generation compliance infrastructure. Onboard trusted customers in under 3 seconds using the most advanced AI risk engine ever deployed.",
    "hero.btn.verify": "Start Verification",
    "hero.btn.agent": "Talk to Agent",
    "hero.btn.dashboard": "View Dashboard",

    "dash.title": "Analytics Dashboard",
    "dash.subtitle": "Real-time metrics on identity verification throughput and risk.",
    "dash.kpi.total": "Total Verifications",
    "dash.kpi.auto": "Auto-Approval Rate",
    "dash.kpi.pending": "Pending Manual Review",
    "dash.kpi.risk": "High Risk Flags",
    "dash.recent": "Recent Activity",
    "dash.viewall": "View all →",
    "dash.map.title": "Global Onboarding Map",

    "agent.title": "New conversation",
    "agent.today": "TODAY",
    "agent.yesterday": "YESTERDAY",
    "agent.older": "OLDER",
    "agent.placeholder": "Ask Mithra about customer verification, risk scores, or compliance…",
  },
  "hi-IN": {
    "nav.home": "होम",
    "nav.dashboard": "डैशबोर्ड",
    "nav.customers": "ग्राहक",
    "nav.agent": "एआई एजेंट",
    "nav.settings": "सेटिंग्स",
    "nav.signin": "साइन इन",

    "hero.badge": "केवाईसी मित्रा का परिचय",
    "hero.title1": "पहचान सत्यापन",
    "hero.title2": "प्रकाश की गति से।",
    "hero.subtitle": "अगली पीढ़ी का अनुपालन बुनियादी ढांचा। सबसे उन्नत एआई जोखिम इंजन का उपयोग करके 3 सेकंड से कम समय में विश्वसनीय ग्राहकों को ऑनबोर्ड करें।",
    "hero.btn.verify": "सत्यापन शुरू करें",
    "hero.btn.agent": "एजेंट से बात करें",
    "hero.btn.dashboard": "डैशबोर्ड देखें",

    "dash.title": "एनालिटिक्स डैशबोर्ड",
    "dash.subtitle": "पहचान सत्यापन थ्रूपुट और जोखिम पर वास्तविक समय मीट्रिक।",
    "dash.kpi.total": "कुल सत्यापन",
    "dash.kpi.auto": "ऑटो-स्वीकृति दर",
    "dash.kpi.pending": "लंबित मैनुअल समीक्षा",
    "dash.kpi.risk": "उच्च जोखिम ध्वज",
    "dash.recent": "हाल की गतिविधि",
    "dash.viewall": "सभी देखें →",
    "dash.map.title": "वैश्विक ऑनबोर्डिंग मानचित्र",

    "agent.title": "नई बातचीत",
    "agent.today": "आज",
    "agent.yesterday": "बीता हुआ कल",
    "agent.older": "पुराना",
    "agent.placeholder": "ग्राहक सत्यापन, जोखिम स्कोर, या अनुपालन के बारे में मित्रा से पूछें…",
  },
  "kn-IN": {
    "nav.home": "ಮುಖಪುಟ",
    "nav.dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "nav.customers": "ಗ್ರಾಹಕರು",
    "nav.agent": "ಎಐ ಏಜೆಂಟ್",
    "nav.settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    "nav.signin": "ಸೈನ್ ಇನ್",

    "hero.badge": "KYC ಮಿತ್ರ ಪರಿಚಯ",
    "hero.title1": "ಗುರುತು ಪರಿಶೀಲನೆ",
    "hero.title2": "ಬೆಳಕಿನ ವೇಗದಲ್ಲಿ.",
    "hero.subtitle": "ಮುಂದಿನ ಪೀಳಿಗೆಯ ಅನುಸರಣೆ ಮೂಲಸೌಕರ್ಯ. ಅತ್ಯಾಧುನಿಕ AI ಅಪಾಯಕಾರಿ ಎಂಜಿನ್ ಬಳಸಿ 3 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ವಿಶ್ವಾಸಾರ್ಹ ಗ್ರಾಹಕರನ್ನು ಆನ್‌ಬೋರ್ಡ್ ಮಾಡಿ.",
    "hero.btn.verify": "ಪರಿಶೀಲನೆ ಪ್ರಾರಂಭಿಸಿ",
    "hero.btn.agent": "ಏಜೆಂಟ್ ಜೊತೆ ಮಾತನಾಡಿ",
    "hero.btn.dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ವೀಕ್ಷಿಸಿ",

    "dash.title": "ಅನಾಲಿಟಿಕ್ಸ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "dash.subtitle": "ಗುರುತು ಪರಿಶೀಲನೆ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಅಪಾಯದ ನೈಜ ಸಮಯದ ಮೆಟ್ರಿಕ್‌ಗಳು.",
    "dash.kpi.total": "ಒಟ್ಟು ಪರಿಶೀಲನೆಗಳು",
    "dash.kpi.auto": "ಸ್ವಯಂ ಅನುಮೋದನೆ ದರ",
    "dash.kpi.pending": "ಹಸ್ತಚಾಲಿತ ವಿಮರ್ಶೆ ಬಾಕಿ ಇದೆ",
    "dash.kpi.risk": "ಹೆಚ್ಚಿನ ಅಪಾಯದ ಧ್ವಜಗಳು",
    "dash.recent": "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    "dash.viewall": "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ →",
    "dash.map.title": "ಜಾಗತಿಕ ಆನ್‌ಬೋರ್ಡಿಂಗ್ ನಕ್ಷೆ",

    "agent.title": "ಹೊಸ ಸಂಭಾಷಣೆ",
    "agent.today": "ಇಂದು",
    "agent.yesterday": "ನಿನ್ನೆ",
    "agent.older": "ಹಳೆಯದು",
    "agent.placeholder": "ಗ್ರಾಹಕರ ಪರಿಶೀಲನೆ, ಅಪಾಯದ ಅಂಕಗಳು ಅಥವಾ ಅನುಸರಣೆ ಬಗ್ಗೆ ಮಿತ್ರರನ್ನು ಕೇಳಿ…",
  },
  "ta-IN": {
    "nav.home": "முகப்பு",
    "nav.dashboard": "டாஷ்போர்டு",
    "nav.customers": "வாடிக்கையாளர்கள்",
    "nav.agent": "AI ஏஜென்ட்",
    "nav.settings": "அமைப்புகள்",
    "nav.signin": "உள்நுழை",

    "hero.badge": "KYC மித்ராவை அறிமுகப்படுத்துகிறோம்",
    "hero.title1": "அடையாள சரிபார்ப்பு",
    "hero.title2": "ஒளியின் வேகத்தில்.",
    "hero.subtitle": "அடுத்த தலைமுறை இணக்க உள்கட்டமைப்பு. மேம்பட்ட AI இடர் இயந்திரத்தைப் பயன்படுத்தி 3 வினாடிகளுக்குள் வாடிக்கையாளர்களை உள்நுழையச் செய்யுங்கள்.",
    "hero.btn.verify": "சரிபார்ப்பைத் தொடங்கு",
    "hero.btn.agent": "ஏஜெண்டிடம் பேசு",
    "hero.btn.dashboard": "டாஷ்போர்டைப் பார்க்க",

    "dash.title": "பகுப்பாய்வு டாஷ்போர்டு",
    "dash.subtitle": "அடையாள சரிபார்ப்பு செயல்திறன் மற்றும் ஆபத்து குறித்த நிகழ்நேர அளவீடுகள்.",
    "dash.kpi.total": "மொத்த சரிபார்ப்புகள்",
    "dash.kpi.auto": "தானியங்கி ஒப்புதல் விகிதம்",
    "dash.kpi.pending": "கையேடு மதிப்பாய்வு நிலுவையில் உள்ளது",
    "dash.kpi.risk": "அதிக ஆபத்து கொடிகள்",
    "dash.recent": "சமீபத்திய செயல்பாடு",
    "dash.viewall": "அனைத்தையும் காண்க →",
    "dash.map.title": "உலகளாவிய ஆன் போர்டிங் வரைபடம்",

    "agent.title": "புதிய உரையாடல்",
    "agent.today": "இன்று",
    "agent.yesterday": "நேற்று",
    "agent.older": "பழையது",
    "agent.placeholder": "வாடிக்கையாளர் சரிபார்ப்பு, ஆபத்து மதிப்பெண்கள் அல்லது இணக்கம் பற்றி மித்ராவிடம் கேளுங்கள்…",
  }
};

export function useTranslation(lang: LanguageCode) {
  return function t(key: TranslationKey) {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS["en-US"][key] || key;
  };
}
