import { create } from 'zustand';

type Language = 'ru' | 'kk';

interface LangState {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ru: {
    hero_title: 'Чистота без усилий',
    hero_subtitle: 'Профессиональный клининг в Алматы. Просто введите номер, и мы подберем лучшего исполнителя за 5 минут.',
    quick_btn: 'Жду звонка',
    calc_link: 'Или рассчитать точную стоимость в калькуляторе',
    trust_title: 'Безопасность — наш приоритет',
    top_executors: 'Лучшие клинеры недели',
    free_service: 'Сервис абсолютно бесплатен для клиентов'
  },
  kk: {
    hero_title: 'Күш жұмсамай-ақ тазалық',
    hero_subtitle: 'Алматыдағы кәсіби клининг. Нөміріңізді енгізіңіз, біз 5 минут ішінде ең жақсы орындаушыны таңдаймыз.',
    quick_btn: 'Қоңырау күтемін',
    calc_link: 'Немесе калькуляторда нақты құнын есептеңіз',
    trust_title: 'Қауіпсіздік — біздің басымдығымыз',
    top_executors: 'Аптаның үздік клинерлері',
    free_service: 'Сервис клиенттер үшін мүлдем тегін'
  }
};

export const useLangStore = create<LangState>((set, get) => ({
  lang: 'ru',
  setLang: (lang) => set({ lang }),
  t: (key) => translations[get().lang][key] || key,
}));
