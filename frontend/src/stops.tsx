export interface Stop {
  name: string;
  notes?: string;
  start_time: string;
  stop_time: string;
  google_maps: string;
  lat_lng: [number, number];
}

export const STOPS: Stop[] = [
  {
    name: "Kriemhild",
    start_time: "10:00",
    stop_time: "11:00",
    google_maps: "https://goo.gl/maps/LXiuqnWyxvSVUbyC6",
    lat_lng: [16.33015961393295, 48.20204773675356],
  },
  {
    name: "Wolfgang",
    start_time: "11:15",
    stop_time: "12:15",
    google_maps: "https://goo.gl/maps/bBW1ZZkK8ZjGg6uL7",
    lat_lng: [16.34525418509706, 48.20172624248819],
  },
  {
    name: "Jonas Reindl",
    notes: "the original",
    start_time: "12:30",
    stop_time: "13:30",
    google_maps: "https://goo.gl/maps/bobUhjyxqmcX7af28",
    lat_lng: [16.361586915426, 48.215638276168998],
  },
  {
    name: "Ramasuri",
    start_time: "13:45",
    stop_time: "14:45",
    google_maps: "https://g.page/Ramasuri_wien?share",
    lat_lng: [16.3823258423591, 48.2137665712349837],
  },
  {
    name: "Menta",
    start_time: "15:00",
    stop_time: "16:00",
    google_maps: "https://goo.gl/maps/Ubv6rAq4JPxcC5bUA",
    lat_lng: [16.3901743264698, 48.21121301547114],
  },
  {
    name: "K'mik",
    start_time: "16:15",
    stop_time: "17:30",
    google_maps: "https://g.page/kaffemik_vie?share",
    lat_lng: [16.3510865157843, 48.1992539964285728],
  },
  {
    name: "Schadek",
    notes: "Liebling 2",
    start_time: "17:35",
    stop_time: "18:15",
    google_maps: "https://goo.gl/maps/FpPuXGZUVNZaGr4U6",
    lat_lng: [16.35268826975328, 48.198305514769727],
  },
  {
    name: "Liebling",
    start_time: "18:20",
    stop_time: "19:20",
    google_maps: "https://goo.gl/maps/G1EaE3HRW8aPgPiWA",
    lat_lng: [16.35098189673784, 48.19976753961812],
  },
  {
    name: "Espresso",
    start_time: "19:30",
    stop_time: "20:45",
    google_maps: "https://goo.gl/maps/5eLoNJgWCuwoTT1z8",
    lat_lng: [16.35007130256935, 48.204244715420098],
  },
  {
    name: "Burgasse 24",
    start_time: "20:50",
    stop_time: "21:50",
    google_maps: "https://goo.gl/maps/85HvdM4gGgJiqNuXA",
    lat_lng: [16.35225998509717, 48.204409177229027],
  },
  {
    name: "Kafka",
    start_time: "22:00",
    stop_time: "23:00",
    google_maps: "https://goo.gl/maps/sDQEbwLTfbbK9uEg9",
    lat_lng: [16.3571918657645, 48.200686493540325],
  },
  {
    name: "Phil",
    start_time: "23:05",
    stop_time: "late",
    google_maps: "https://g.page/phil_in_wien?share",
    lat_lng: [16.36105426749165, 48.200393653930243],
  },
];
