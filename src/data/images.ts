import ringExchange from '@/assets/img/ring-exchange.jpg'
import couple from '@/assets/img/couple.jpg'
import bridePortrait from '@/assets/img/bride-portrait.jpg'
import royalCouple from '@/assets/img/royal-couple.jpg'
import varmala from '@/assets/img/varmala.jpg'
import garlandExchange from '@/assets/img/garland-exchange.jpg'
import corridorPortrait from '@/assets/img/corridor-portrait.jpg'
import preWedding from '@/assets/img/pre-wedding.jpg'
import weddingDetails from '@/assets/img/wedding-details.jpg'
import watch from '@/assets/img/watch.jpg'
import headphones from '@/assets/img/headphones.jpg'
import sneaker from '@/assets/img/sneaker.jpg'
import house from '@/assets/img/house.jpg'
import interior from '@/assets/img/interior.jpg'
import conference from '@/assets/img/conference.jpg'
import food from '@/assets/img/food.jpg'
import hotel from '@/assets/img/hotel.jpg'
import headshot from '@/assets/img/headshot.jpg'
import face1 from '@/assets/img/face-1.jpg'
import face2 from '@/assets/img/face-2.jpg'
import face3 from '@/assets/img/face-3.jpg'
import face4 from '@/assets/img/face-4.jpg'
import face5 from '@/assets/img/face-5.jpg'

/** Sample imagery. Replace with provider uploads once the media service exists. */
export const IMG = {
  ringExchange,
  couple,
  bridePortrait,
  royalCouple,
  varmala,
  garlandExchange,
  corridorPortrait,
  preWedding,
  weddingDetails,
  watch,
  headphones,
  sneaker,
  house,
  interior,
  conference,
  food,
  hotel,
  headshot,
  face1,
  face2,
  face3,
  face4,
  face5,
} as const

export type ImageKey = keyof typeof IMG
