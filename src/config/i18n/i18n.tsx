import i18n from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enTranslations from "../lang-en.json";

i18n
    .use(I18nextBrowserLanguageDetector) // Optional if detecting language automatically
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslations,
            }
        },
        lng: 'en', // Default language
        fallbackLng: 'en', // Fallback language if translation not available
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;