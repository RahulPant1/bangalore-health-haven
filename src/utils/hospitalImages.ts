
// Array of hospital-related images from Unsplash
export const hospitalImages = [
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907",
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc",
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3",
  "https://images.unsplash.com/photo-1583324113626-70df0f4deaab",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514",
  "https://images.unsplash.com/photo-1578991624414-276ef23908bf",
  "https://images.unsplash.com/photo-1504813184591-01572f98c85f",
  "https://images.unsplash.com/photo-1581056771107-24ca5f033842",
  "https://images.unsplash.com/photo-1626315869436-d6989fea3524",
  "https://images.unsplash.com/photo-1559000357-f6b52ddfca37",
  "https://images.unsplash.com/photo-1666214280557-f1b5022eb634",
  "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133",
  "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514",
  "https://images.unsplash.com/photo-1504813184591-01572f98c85f",
  "https://images.unsplash.com/photo-1504813184591-01572f98c85f",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907",
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc",
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3",
  "https://images.unsplash.com/photo-1583324113626-70df0f4deaab",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514",
  "https://images.unsplash.com/photo-1578991624414-276ef23908bf",
  "https://images.unsplash.com/photo-1504813184591-01572f98c85f",
  "https://images.unsplash.com/photo-1581056771107-24ca5f033842",
  "https://images.unsplash.com/photo-1626315869436-d6989fea3524",
  "https://images.unsplash.com/photo-1559000357-f6b52ddfca37",
  "https://images.unsplash.com/photo-1666214280557-f1b5022eb634",
  "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133",
  "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514",
  "https://images.unsplash.com/photo-1504813184591-01572f98c85f",
  "https://images.unsplash.com/photo-1504813184591-01572f98c85f"
].map(url => `${url}?auto=format&fit=crop&w=800&q=80`);

export const getRandomHospitalImage = () => {
  const randomIndex = Math.floor(Math.random() * hospitalImages.length);
  return hospitalImages[randomIndex];
};
