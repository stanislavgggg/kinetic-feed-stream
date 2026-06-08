# План: адаптация под iPhone 16 / 16 Pro / 17 (390–402pt, Dynamic Island, home-indicator) + премиум-кнопки

Цель: убрать обрезание контента под Dynamic Island и home-indicator, увеличить все тап-таргеты ≥44pt, сделать кнопки визуально премиальными (gradient + glow + press feedback), без правки бэкенда, API и логики воронки.

## 1. Safe-area везде (src/styles.css + AppShell + Header + Onboarding)

- `src/styles.css` → `html, body` добавить:
  - `min-height: 100svh` (вместо/в дополнение к `100dvh` — корректно с Safari 17 на iPhone).
  - Глобальные CSS-переменные `--safe-top`, `--safe-bottom`, `--safe-left`, `--safe-right` через `env(safe-area-inset-*)` с фолбэком `0px`.
  - `@viewport`/мета: убедиться, что в `src/routes/__root.tsx` `<meta name="viewport">` содержит `viewport-fit=cover` (если отсутствует — добавить).
- `AppShell.tsx`:
  - Контейнер: `min-h-[100svh]`, `pb-[calc(80px+var(--safe-bottom))]`.
  - Фейд за nav: высота 120px (был 96px) — чтобы под home-indicator не было резкой обрезки.
- `Header.tsx`:
  - Sticky-header: `pt-[var(--safe-top)]`, фон растягивается под Dynamic Island.
  - `BreakingStrap` сохраняет высоту, но не уезжает под notch.
- `Onboarding.tsx`:
  - Контейнер: `pt-[var(--safe-top)] pb-[var(--safe-bottom)]`, кнопка CTA — `mb-[calc(24px+var(--safe-bottom))]`.

## 2. BottomNav (AppShell.tsx) — удобный под iPhone

- Высота элементов: с `h-[68px]` → `h-[60px]` + явный `min-h-[48px]` для каждой ссылки = тап-таргет ≥48pt с учётом env-padding.
- Padding-bottom = `env(safe-area-inset-bottom)` (уже есть), но переключить на `max(env(safe-area-inset-bottom), 8px)`.
- Иконки 24px, подписи `text-[11px]`, активный индикатор — gradient bar 36×3 (как сейчас) + лёгкое свечение.

## 3. Премиум-кнопки (новая утилита `@utility btn-premium` в src/styles.css)

Единый стиль для всех CTA: Onboarding CTA, StickyCTA, LockedStack CTA, MatchCard CTA.

- Базовая высота: `--btn-h: 52px` (≥44pt + комфорт).
- Слои:
  - Background: `var(--gradient-signal)` (signal→ember).
  - Внутренний highlight: `inset 0 1px 0 rgba(255,255,255,.35)` + `inset 0 -1px 0 rgba(0,0,0,.25)`.
  - Внешний glow: `0 10px 28px -8px color-mix(in oklab, var(--signal) 55%, transparent), 0 24px 60px -24px color-mix(in oklab, var(--ember) 45%, transparent)`.
  - Ободок: `1px solid color-mix(in oklab, var(--ember) 45%, transparent)`.
  - Радиус: `14px` (rounded-2xl-ish, более «таблеточно»).
  - Текст: `lower-third`, `tracking-[0.14em]`, `font-weight: 800`, `color: var(--signal-foreground)`, мягкая тень `0 1px 0 rgba(0,0,0,.25)`.
- Состояния:
  - `:hover` (десктоп) — `filter: brightness(1.06) saturate(1.05)`.
  - `:active` — `transform: scale(0.975)`, `filter: brightness(1.1)`, `transition: 120ms`.
  - `:focus-visible` — двойной ring (`outline: 2px solid var(--ember); outline-offset: 3px`) для доступности.
  - `:disabled` — `opacity: .5`, `filter: grayscale(.4)`, `pointer-events: none`.
- Sweep-блик уже есть (`.signal-sweep`) — переиспользуется.
- Новая вторичная утилита `@utility btn-ghost-premium`: прозрачный градиент-бордер + glass-фон для второстепенных действий (язык, фильтры — опционально).

## 4. Chips / фильтры (NewsView + LiveView)

- Высота `h-9` → `h-11` (44px), padding `px-4` → `px-4.5`, текст `text-sm` остаётся.
- Активный `chip-active` сохраняем, но добавляем `shadow-signal/40` для контраста.
- Контейнер фильтров: `gap-2` → `gap-2.5`, скролл с `scroll-px-4 snap-x snap-mandatory` (мягкий snap к чипам на узких экранах).

## 5. StickyCTA (NewsView.tsx)

- Поднять над nav: `bottom-[calc(72px+var(--safe-bottom))]` (сейчас захардкодено `bottom-[68px]` + раздельный env padding — на iPhone 17 наезжает на home-indicator).
- Кнопка использует новую `btn-premium`, высота 52px.
- Glass-обёртка: усилить blur до 24px, добавить hairline сверху.

## 6. HeroCard / NewsCard / MatchCard

- HeroCard: заголовок `text-[26px]` → `clamp(22px, 6.4vw, 28px)` чтобы не ломалось на 390pt узких экранах.
- NewsCard: `p-4` → `p-4` (ок), но `gap-3` между текстом и Thumb → `gap-3.5`, Thumb `h-20 w-20` → `h-[76px] w-[76px]` для пропорций.
- MatchCard: score `text-[34px]` → `clamp(30px, 9vw, 38px)`; CTA высота `h-11` → `h-12` с `btn-premium`.

## 7. Header — компактнее под Dynamic Island

- `py-2.5` → `py-2` (после добавления safe-area-top появится «лишняя» высота — компенсируем).
- Аватар `h-8 w-8` → `h-9 w-9` (удобнее тап).
- LangSwitcher (отдельный файл, не правим логику) — задать `min-h-[40px]` через wrapper-класс.

## Технические детали

```text
src/styles.css
├── + :root { --safe-top: env(safe-area-inset-top, 0px); ... }
├── + @utility btn-premium { ... }       (новая)
├── + @utility btn-ghost-premium { ... } (новая, для вторичных)
└── ~ html, body { min-height: 100svh; }

src/routes/__root.tsx
└── ~ <meta name="viewport" content="... viewport-fit=cover">

src/components/AppShell.tsx
├── ~ контейнер: 100svh + pb с var(--safe-bottom)
├── ~ фейд: 120px
└── ~ BottomNav: h-[60px], min-h-[48px], max(env(...), 8px)

src/components/Header.tsx
└── ~ pt-[var(--safe-top)], py-2, аватар h-9 w-9

src/components/Onboarding.tsx
├── ~ pt/pb safe-area
└── ~ CTA → btn-premium, h-14

src/components/NewsView.tsx
├── ~ chips h-11
├── ~ StickyCTA bottom: calc(72px + var(--safe-bottom))
├── ~ LockedStack CTA → btn-premium
└── ~ HeroCard headline clamp()

src/components/LiveView.tsx
├── ~ chips h-11
└── ~ MatchCard CTA → btn-premium, h-12; score clamp()
```

## Вне scope

- API, воронка, аналитика, gating, переводы, Telegram SDK, роутинг, бренд/копия — не трогаем.
- Цветовая палитра «Obsidian Wire» сохраняется (signal/ember), визуальные токены не меняются — только размеры, отступы, новые утилиты для кнопок.
- Никаких новых зависимостей.
