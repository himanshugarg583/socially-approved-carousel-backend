const BASE = "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/";

const FILES = [
  "classroom",
  "store-aisle-detection",
  "driver-action-recognition",
  "face-demographics-walking-and-pause",
  "head-pose-face-detection-female",
  "head-pose-face-detection-male",
  "one-by-one-person-detection",
  "people-detection",
  "person-bicycle-car-detection",
  "pets-walking-single-pre-border",
  "text-detection"
];

const THUMBNAILS = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1500835595337-f740268f4327?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80"
];

const HANDLES = ["maya.roams", "thenomadkit", "saltandsand", "riverbend", "aperture.co", "wildensoul", "paperplanes", "the.slowlane", "duskchaser", "offmapco", "linenandlight", "harborlore", "goldenhourgirl", "trailmixmag", "coastlyne", "the.wanderthread", "emberandpine", "seafoamdays", "northbound.eu", "citywalks"];

const CAPTIONS = ["Golden hour hit different in this fit", "POV: you finally booked the trip", "Packing cubes changed my life", "The linen set that survived 3 countries", "Sunrise swim then coffee, repeat", "Found the quietest cove on the island", "This bag held a week in one carry-on", "Slow mornings, long walks, zero plans", "Rooftop views worth every step up", "Thrifted the jacket, styled it 4 ways", "The softest knit for cold-flight legs", "Market day fits over everything", "Chasing waterfalls in the good boots", "Desert nights need exactly one layer", "Wore this dawn to dusk, still fresh", "Every corner of this old town is a photo", "Boat day essentials, kept it simple", "The travel dress that does it all", "Late train, better light, no regrets", "City reset in comfortable everything"];

const LOCATIONS = ["Lisbon, PT", "Bali, ID", "Amalfi, IT", "Kyoto, JP", "Cape Town, ZA", "Reykjavik, IS", "Oaxaca, MX", "Hallstatt, AT", "Chefchaouen, MA", "Queenstown, NZ", "Hoi An, VN", "Sevilla, ES", "Banff, CA", "Petra, JO", "Santorini, GR", "Porto, PT", "Positano, IT", "Marrakech, MA", "Hanoi, VN", "Zurich, CH"];

function seeded(index) {
  const value = Math.sin(index * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export function buildSeedVideos(total = 30) {
  const videos = [];
  for (let i = 0; i < total; i += 1) {
    const file = FILES[i % FILES.length];
    const thumb = THUMBNAILS[i % THUMBNAILS.length];
    videos.push({
      title: CAPTIONS[i % CAPTIONS.length],
      description: `Shared by our community from ${LOCATIONS[i % LOCATIONS.length]}`,
      video_url: `${BASE}${file}.mp4`,
      thumbnail_url: thumb,
      creator_handle: HANDLES[i % HANDLES.length],
      location: LOCATIONS[i % LOCATIONS.length],
      duration_secs: 15 + Math.floor(seeded(i + 1) * 45),
      is_verified: i % 3 === 0 ? 1 : 0,
      position: i + 1
    });
  }
  return videos;
}
