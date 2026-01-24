export const AMENITIES = [
    'Pool',
    'Gym',
    'WiFi',
    'Parking',
    'Concierge',
    'Rooftop',
    'Spa',
    'Garden',
    'Beach Access'
] as const

export type Amenity = typeof AMENITIES[number]
