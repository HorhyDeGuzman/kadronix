import { Drama, Film } from 'lucide-vue-next'
import type { ModeCard } from '../models/mode-card.types'

export const MODE_CARDS: ModeCard[] = [
  {
    mode: 'frames-choice',
    titleKey: 'home.modes.framesChoice.title',
    descriptionKey: 'home.modes.framesChoice.description',
    icon: Film,
    available: true,
  },
  {
    mode: 'actors-choice',
    titleKey: 'home.modes.actorsChoice.title',
    descriptionKey: 'home.modes.actorsChoice.description',
    icon: Drama,
    available: true,
  },
]
