import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enResources from '../locale/en.json';
import zhCNResources from '../locale/zh_CN.json';

export const resources = {
    en: enResources,
    'zh-CN': zhCNResources
}

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;