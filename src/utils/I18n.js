import I18n from "react-native-i18n";
import en from "./locales/en";
import zh from "./locales/zh";

I18n.fallbacks = true;

I18n.translations = {
    en,
    zh
};

I18n.locale = "zh";

export default I18n;
