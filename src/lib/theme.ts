export const priorityColors = {
  HIGH: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    hover: 'hover:bg-red-100',
    dot: 'bg-red-500',
  },
  MEDIUM: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    hover: 'hover:bg-amber-100',
    dot: 'bg-amber-500',
  },
  LOW: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-100',
    dot: 'bg-blue-500',
  },
} as const;

export const appColors = {
  primary: 'hsl(224, 71%, 4%)',
  primaryHover: 'hsl(224, 71%, 8%)',
  secondary: 'hsl(210, 20%, 98%)',
  accent: 'hsl(210, 14%, 92%)',
  muted: 'hsl(215, 16%, 45%)',
  border: 'hsl(214, 32%, 91%)',
} as const;

export const spacing = {
  taskItem: 'p-4',
  cardPadding: 'p-6 sm:p-7',
  sectionGap: 'space-y-6',
  itemGap: 'space-y-3',
} as const;

export const transitions = {
  fast: 'transition-all duration-150',
  normal: 'transition-all duration-200',
  slow: 'transition-all duration-300',
} as const;

export const typography = {
  h1: 'text-3xl font-semibold tracking-tight',
  h2: 'text-2xl font-semibold tracking-tight',
  h3: 'text-lg font-semibold',
  body: 'text-base',
  small: 'text-xs uppercase tracking-[0.08em] text-slate-500',
  muted: 'text-sm text-slate-500',
} as const;

export const radii = {
  card: 'rounded-xl',
  sheet: 'rounded-2xl',
  pill: 'rounded-full',
} as const;
