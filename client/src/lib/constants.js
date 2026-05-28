export const CATEGORIES = [
  { id: 'beachfront', label: 'Beachfront', icon: '🏖️' },
  { id: 'city', label: 'City', icon: '🏙️' },
  { id: 'countryside', label: 'Countryside', icon: '🌾' },
  { id: 'desert', label: 'Desert', icon: '🏜️' },
  { id: 'lake', label: 'Lake', icon: '🛶' },
  { id: 'luxury', label: 'Luxe', icon: '✨' },
  { id: 'mansions', label: 'Mansions', icon: '🏛️' },
  { id: 'tropical', label: 'Tropical', icon: '🌴' },
  { id: 'cabins', label: 'Cabins', icon: '🪵' },
  { id: 'islands', label: 'Islands', icon: '🏝️' },
  { id: 'amazing-views', label: 'Amazing views', icon: '🌅' },
  { id: 'rooms', label: 'Rooms', icon: '🛏️' },
];

export const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'room', 'cabin', 'hotel'];

export const AMENITIES = [
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'parking', label: 'Free parking' },
  { id: 'pool', label: 'Pool' },
  { id: 'ac', label: 'Air conditioning' },
  { id: 'heating', label: 'Heating' },
  { id: 'tv', label: 'TV' },
  { id: 'washer', label: 'Washer' },
  { id: 'dryer', label: 'Dryer' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'gym', label: 'Gym' },
  { id: 'beach-access', label: 'Beach access' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'pet-friendly', label: 'Pet friendly' },
];

export const formatMoney = (amount, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  } catch {
    return `$${amount}`;
  }
};
