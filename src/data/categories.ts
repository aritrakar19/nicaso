import type { Category, CategoryName, Offering } from '@/types'

export const CATEGORIES: Category[] = [
  { name: 'Wedding', image: 'couple', startingFrom: 30000, icon: 'heart' },
  { name: 'Pre-wedding', image: 'preWedding', startingFrom: 15000, icon: 'camera' },
  { name: 'Corporate event', image: 'conference', startingFrom: 12000, icon: 'users' },
  { name: 'Product & e-commerce', image: 'headphones', startingFrom: 4000, icon: 'grid' },
  { name: 'Real estate', image: 'house', startingFrom: 4500, icon: 'home' },
  { name: 'Portrait & headshots', image: 'headshot', startingFrom: 2500, icon: 'image' },
  { name: 'Food & restaurant', image: 'food', startingFrom: 5000, icon: 'spark' },
  { name: 'Hotel & travel', image: 'hotel', startingFrom: 9000, icon: 'pin' },
]

/** Categories that are booked per event day and can have sub-events. */
export const EVENT_CATEGORIES: CategoryName[] = ['Wedding', 'Pre-wedding', 'Corporate event']

export const OFFERINGS: Offering[] = ['Edited photos', 'Printed album', 'Video', 'Drone', 'Raw files']

export const CITY = 'Kolkata'
