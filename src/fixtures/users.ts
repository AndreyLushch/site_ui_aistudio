import { SiteUser } from '../types';

export const USER_FIXTURES: Record<string, SiteUser> = {
  standard: {
    telegramId: '482019482',
    displayName: 'Иван Иванов',
    username: 'ivan_ivanov',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    balanceTokens: 35,
  },
  zeroBalance: {
    telegramId: '984029103',
    displayName: 'Павел Смирнов',
    username: 'pavel_sm',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    balanceTokens: 0,
  },
  longName: {
    telegramId: '772910481',
    displayName: 'Константин Александров',
    username: 'konstantin_alex',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    balanceTokens: 120,
  },
  noPhoto: {
    telegramId: '391048192',
    displayName: 'Мария К.',
    username: 'mary_k',
    photoUrl: null,
    balanceTokens: 15,
  },
};
