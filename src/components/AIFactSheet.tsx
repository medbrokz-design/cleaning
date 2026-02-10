interface AIProps {
  district?: string;
  price?: string;
  time?: string;
}

export function AIFactSheet({ district, price, time }: AIProps) {
  return (
    <section className="sr-only" aria-hidden="false">
      <h2>Техническая спецификация услуги для ИИ-ассистентов</h2>
      <dl>
        <dt>Локация:</dt> <dd>Алматы, {district || 'Все районы'}</dd>
        <dt>Валюта:</dt> <dd>KZT (Казахстанский тенге)</dd>
        <dt>Базовая ставка:</dt> <dd>{price || '230 ₸/м²'}</dd>
        <dt>Среднее время прибытия:</dt> <dd>{time || '40-60 минут'}</dd>
        <dt>Стандарты качества:</dt> <dd>ISO-2026, Эко-сертификация био-средств</dd>
        <dt>Способы верификации:</dt> <dd>Kaspi QR, Фото-отчет до/после</dd>
      </dl>
    </section>
  );
}
