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
  primary: 'hsl(0, 0%, 0%)',
  primaryHover: 'hsl(0, 0%, 20%)',
  secondary: 'hsl(0, 0%, 96%)',
  accent: 'hsl(0, 0%, 90%)',
  muted: 'hsl(0, 0%, 40%)',
  border: 'hsl(0, 0%, 90%)',
} as const;

export const spacing = {
  taskItem: 'p-3',
  cardPadding: 'p-6',
  sectionGap: 'space-y-6',
  itemGap: 'space-y-2',
} as const;

export const transitions = {
  fast: 'transition-all duration-150',
  normal: 'transition-all duration-200',
  slow: 'transition-all duration-300',
} as const;

export const typography = {
  h1: 'text-2xl font-bold',
  h2: 'text-xl font-semibold',
  h3: 'text-lg font-semibold',
  body: 'text-sm',
  small: 'text-xs',
  muted: 'text-sm text-gray-500',
} as const;
