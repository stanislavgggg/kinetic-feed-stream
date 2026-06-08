## CRO-разбор текущего состояния

**Что есть сейчас:**
- **News:** market-strip → категории → hero → 4 бесплатные карточки → blurred lock-stack с CTA → sticky CTA внизу. Карточки новостей ведут на внешние источники (utm-утечка ценности).
- **Live:** dot + заголовок → фильтры по играм → карточки матчей, под каждой кнопка «Watch in channel».
- **Bottom nav:** только News / Live.

**Проблемы с точки зрения конверсии:**
1. **CTA-усталость на Live.** Кнопка под каждой карточкой = 6–10 одинаковых призывов подряд. Глаз их перестаёт видеть (баннерная слепота), CTR падает.
2. **Нет «момента ценности» на Live.** В News лок срабатывает после того как юзер прочитал 4 заголовка — это естественный pay-wall. На Live аналогичного триггера нет: кнопка показывается сразу, до того как юзер вложился.
3. **Внешние ссылки в News.** Hero и обычные карточки уводят на источник — это анти-конверсия: трафик утекает к чужому домену вместо канала.
4. **Канал не имеет «адреса».** Нет постоянной точки, куда юзер может вернуться, когда созрел. Sticky CTA в News появляется только при locked-состоянии.
5. **Bottom-nav недогружен.** Две вкладки в iOS-стиле выглядят пусто, третий слот — самый ценный CRO-актив, который не используется.

## Рекомендация (гибрид, а не «или-или»)

Лучшие результаты в подобных Telegram mini-app даёт **сочетание контекстных триггеров и постоянной точки входа**, а не замена одного другим.

### 1. Добавить третью вкладку в bottom-nav: **Channel**
- Постоянный, всегда видимый вход. Иконка Send/Sparkles + лейбл «Channel».
- Открывает не сразу deep-link, а внутренний экран `/channel` — превью канала: лого, описание, 2-3 закреплённых поста, соц-доказательство (подписчики, «12 материалов за сегодня»), и крупная primary-кнопка «Open in Telegram».
- Это «магазинная витрина»: даёт юзеру осмотреться без давления и резко поднимает конверсию тёплой аудитории.

### 2. Убрать кнопку из-под каждой карточки Live
Заменить на **один sticky CTA внизу Live-экрана** (по аналогии с News), который появляется после скролла или после N секунд на экране. Один сильный призыв вместо десяти слабых.

Опционально: добавить «Pinned match card» сверху Live — карточка-баннер с топ-матчем и явным «Live commentary in channel →». Это hero-CTA в контексте, не размноженный.

### 3. News: усилить точку лока
- Lock-стек оставить (он работает).
- Sticky CTA показывать **только когда юзер доскроллил до лока** (intersection observer), а не сразу. Снижает раздражение, повышает релевантность.
- Добавить в lock-стек 1 строку social-proof: «3 240 читают сейчас» / «обновлено 2 мин назад» — поднимает доверие.

### 4. Onboarding-handoff
В конце онбординга добавить мягкий шаг «Join channel» (skip-able). Самая горячая аудитория — те, кто только что прошёл онбординг.

### 5. Аналитика
Все четыре поверхности (`nav_channel_tab`, `live_sticky`, `live_pinned`, `feed_lock`, `feed_lock_sticky`, `onboarding_join`) логировать через `api.event('cta_view'|'cta_tap', {surface})` — у вас уже есть инфраструктура. Через 2-3 дня станет видно, какая поверхность даёт лучший CTR, и можно отключить слабые.

## Технические детали

**Файлы и изменения:**

```text
src/components/AppShell.tsx
  - BottomNav: items[] → 3 элемента (News, Live, Channel)
  - grid-cols-2 → grid-cols-3
  - иконка Send из lucide-react

src/routes/channel.tsx                                (новый)
  - createFileRoute("/channel")
  - <ChannelView /> + <Footer />

src/components/ChannelView.tsx                        (новый)
  - hero: brand-лого, название, описание из brand.ts
  - 2-3 mock-карточки «what's inside»
  - social proof строка
  - крупная btn-premium «Open in Telegram» → openChannelFlow(config, "channel_tab")
  - api.event("cta_view", {surface: "channel_tab"}) on mount

src/components/LiveView.tsx
  - убрать <button> из MatchCard (вернуть в чистый вид без cta/onTap props)
  - добавить <PinnedChannelCard /> над списком матчей (sticky-баннер с одним CTA)
  - добавить <StickyCTA /> внизу (переиспользовать паттерн из NewsView)

src/components/NewsView.tsx
  - StickyCTA рендерить только когда lockedItems в viewport (useIntersectionObserver)
  - в LockedStack добавить строку social-proof над/под заголовком

src/components/Onboarding.tsx
  - последний шаг: «Join channel» c primary + secondary «Skip»
  - событие onboarding_join_tap / onboarding_join_skip

src/lib/i18n.ts
  - новые ключи: channel, channelTabSub, openInTelegram, joinChannel,
    skipForNow, livePinnedTitle, livePinnedSub, socialProof
```

**Порядок:**
1. i18n ключи
2. ChannelView + route
3. AppShell bottom-nav (3 кол.)
4. LiveView: убрать per-card CTA, добавить PinnedChannelCard + StickyCTA
5. NewsView: условный StickyCTA + social-proof
6. Onboarding: финальный join-шаг

## Что отложим / не делаем

- Не строим внутреннюю «ленту канала» с реальными постами — это отдельная интеграция Telegram API.
- Не убираем external open у News-карточек в этом раунде (нужен отдельный продуктовый разговор: показывать summary внутри vs уводить).
- Не делаем A/B-тест-инфру; полагаемся на существующую event-аналитику и ручное сравнение surfaces.

Готов реализовать после подтверждения. Если хочешь, могу сначала сделать только пункты 1-2 (Channel-вкладка + чистка Live) и оценить эффект, а News/Onboarding оставить на следующий заход.