import type { Component } from 'vue'
import type { GameMode } from '@/modules/game'

export interface ModeCard {
  mode: GameMode
  titleKey: string
  descriptionKey: string
  icon: Component
  available: boolean
}
