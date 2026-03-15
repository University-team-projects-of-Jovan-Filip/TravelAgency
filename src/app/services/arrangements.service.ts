import { Injectable } from '@angular/core';

const PHOTO_PREFIX = 'https://res.cloudinary.com/dwiysakvg/image/upload/';

export interface Arrangement {
  id: string;
  group: string;
  place: string;
  title: string;
  price: number;
  images: string[];
  startDate: string;
  endDate: string;
}


@Injectable({
  providedIn: 'root'
})
export class ArrangementsService {

  constructor() { }

  private readonly groupTranslations: Record<string, { sr: string; en: string }> = {
    'Evropa': { sr: 'Европа', en: 'Europe' },
    'Leto 2025': { sr: 'Лето 2025', en: 'Summer 2025' },
    'Zima 2025': { sr: 'Зима 2025', en: 'Winter 2025' }
  };

  private readonly placeTranslations: Record<string, { sr: string; en: string }> = {
    Izmir: { sr: 'Измир', en: 'Izmir' },
    Pariz: { sr: 'Париз', en: 'Paris' },
    London: { sr: 'Лондон', en: 'London' },
    Santorini: { sr: 'Санторини', en: 'Santorini' },
    Amalfi: { sr: 'Амалфи', en: 'Amalfi' },
    Valensia: { sr: 'Валенсија', en: 'Valencia' },
    Tirol: { sr: 'Тирол', en: 'Tyrol' },
    Kopaonik: { sr: 'Копаоник', en: 'Kopaonik' },
    Zermatt: { sr: 'Цермат', en: 'Zermatt' }
  };

  translateGroup(group: string, lang: 'sr' | 'en'): string {
    const entry = this.groupTranslations[group];
    if (!entry) return group;
    return entry[lang];
  }

  translatePlace(place: string, lang: 'sr' | 'en'): string {
    const entry = this.placeTranslations[place];
    if (!entry) return place;
    return entry[lang];
  }

  getImageUrl(imageKey: string): string {
    return `${PHOTO_PREFIX}${imageKey}`;
  }

  getImages(arrangement: Arrangement): string[] {
    return arrangement.images.map(img => this.getImageUrl(img));
  }

  getGroups(): string[] {
    const groups = new Set(this.getAll().map(a => a.group));
    return Array.from(groups);
  }

  getByGroup(group: string): Arrangement[] {
    return this.getAll().filter(a => a.group === group);
  }

  getById(id: string): Arrangement | null {
    return this.getAll().find(a => a.id === id) ?? null;
  }

  getAllImages() {
    return this.getAll().flatMap(arr => arr.images.map(image => `${PHOTO_PREFIX}${image}`));
  }

  getAll(): Arrangement[] {
    return [
      {
        id: 'evropa-izmir-gultepe-vista',
        "group": "Evropa",
        "place": "Izmir",
        "title": "Apartmani Gültepe Vista",
        "price": 780,
        "images": [
          "v1760988089/aranzman1_opgw1h.jpg",
          "v1760988089/aranzman1_1_vtxxyl.jpg",
          "v1760988090/aranzman1_2_qxgzz9.jpg"
        ],
        "startDate": "2026-05-10",
        "endDate": "2026-05-13"
      },
      {
        id: 'evropa-izmir-miralya-seaside',
        "group": "Evropa",
        "place": "Izmir",
        "title": "Hotel Miralya Seaside",
        "price": 1120,
        "images": [
          "v1760988359/aranzman2_1_coxuub.jpg",
          "v1760988360/aranzman2_3_mfdeky.jpg",
          "v1760988360/aranzman2_2_eix3ld.jpg"
        ],
        "startDate": "2026-06-02",
        "endDate": "2026-06-05"
      },
      {
        id: 'evropa-izmir-aydin-panorama',
        "group": "Evropa",
        "place": "Izmir",
        "title": "Vila Aydin Panorama",
        "price": 970,
        "images": [
          "v1760994490/aranzman14_1_qzkxwg.avif",
          "v1760994491/aranzman14_2_cg0hht.avif",
          "v1760994493/aranzman14_3_eajye0.avif"
        ],
        "startDate": "2026-07-15",
        "endDate": "2026-07-19"
      },
      {
        id: 'evropa-pariz-rue-de-lumiere',
        "group": "Evropa",
        "place": "Pariz",
        "title": "Rezidencija Rue de Lumière",
        "price": 1860,
        "images": [
          "v1760994790/aranzman15_1_by1gvp.png",
          "v1760994792/aranzman15_3_blsleg.png",
          "v1760994792/aranzman15_2_jk9q9e.png"
        ],
        "startDate": "2026-09-07",
        "endDate": "2026-09-10"
      },
      {
        id: 'evropa-pariz-studio-bellemont',
        "group": "Evropa",
        "place": "Pariz",
        "title": "Studio Bellemont Quartier",
        "price": 1340,
        "images": [
          "v1760988631/aranzman4_1_bhogxt.jpg",
          "v1760988638/aranzman4_2_nrvy02.jpg",
          "v1760988640/aranzman4_3_nw1le1.jpg"
        ],
        "startDate": "2026-10-12",
        "endDate": "2026-10-15"
      },
      {
        id: 'evropa-pariz-loft-montvarel',
        "group": "Evropa",
        "place": "Pariz",
        "title": "Loft Montvarel",
        "price": 1750,
        "images": [
          "v1761000368/pariz1_evcnh5.avif",
          "v1761000369/pariz2_owqw5a.avif",
          "v1761000372/pariz3_rpljhk.avif"
        ],
        "startDate": "2026-11-20",
        "endDate": "2026-11-23"
      },
      {
        id: 'evropa-london-camberline-suites',
        "group": "Evropa",
        "place": "London",
        "title": "Camberline Suites",
        "price": 1420,
        "images": [
          "v1761007014/london1_ng9xve.avif",
          "v1761007017/london2_gi1zo1.avif",
          "v1761007019/hotel3_qvtrm6.avif"
        ],
        "startDate": "2026-04-01",
        "endDate": "2026-04-04"
      },
      {
        id: 'evropa-london-haversham-court',
        "group": "Evropa",
        "place": "London",
        "title": "The Haversham Court",
        "price": 1630,
        "images": [
          "v1761007022/london4_vqqzcz.avif",
          "v1761007025/london5_cmqs97.avif",
          "v1761007027/london6_zoqr5u.avif"
        ],
        "startDate": "2025-02-10",
        "endDate": "2025-02-14"
      },
      {
        id: 'evropa-london-riverside-garden',
        "group": "Evropa",
        "place": "London",
        "title": "Riverside Garden Apartments",
        "price": 950,
        "images": [
          "v1761007299/london7_s4yof8.avif",
          "v1761007294/london9_hddsig.avif",
          "v1761007296/london8_fpvr7x.avif"
        ],
        "startDate": "2026-03-22",
        "endDate": "2026-03-25"
      },
      {
        id: 'leto-2025-santorini-theros-blue',
        "group": "Leto 2025",
        "place": "Santorini",
        "title": "Villa Theros Blue",
        "price": 1880,
        "images": [
          "v1760995853/santorini1_ovgmeg.jpg",
          "v1760995854/santorini2_vbluqj.jpg",
          "v1760995855/santorini3_hq8n1q.jpg"
        ],
        "startDate": "2026-07-02",
        "endDate": "2026-07-09"
      },
      {
        id: 'leto-2025-santorini-casa-elaris',
        "group": "Leto 2025",
        "place": "Santorini",
        "title": "Casa Elaris Cliffside",
        "price": 1720,
        "images": [
          "v1760988670/photo-1511840636560-acee95b3a83f_sdq3m3.jpg",
          "v1760988980/aranzman5_2_fer08r.jpg",
          "v1760989011/aranzman5_3_u547qw.jpg"
        ],
        "startDate": "2026-07-16",
        "endDate": "2026-07-23"
      },
      {
        id: 'leto-2025-santorini-aetheria-sunset',
        "group": "Leto 2025",
        "place": "Santorini",
        "title": "Aetheria Sunset Suites",
        "price": 1990,
        "images": [
          "v1760989071/aranzman6_1_de9wqg.jpg",
          "v1760989071/aranzman6_2_xerrbb.jpg",
          "v1760989072/aranzman6_3_clkkrs.jpg"
        ],
        "startDate": "2026-08-05",
        "endDate": "2026-08-12"
      },
      {
        id: 'leto-2025-amalfi-la-roccia-bianca',
        "group": "Leto 2025",
        "place": "Amalfi",
        "title": "La Roccia Bianca Residence",
        "price": 1580,
        "images": [
          "v1760995947/amalfi1_rqlhhu.png",
          "v1760995949/amalfi2_usdadf.png",
          "v1760995952/amalfi3_xygv9f.png"
        ],
        "startDate": "2026-09-10",
        "endDate": "2026-09-13"
      },
      {
        id: 'leto-2025-amalfi-hotel-mareluna',
        "group": "Leto 2025",
        "place": "Amalfi",
        "title": "Hotel Mareluna Vista",
        "price": 1440,
        "images": [
          "v1760999455/amalfi1_zud9eu.avif",
          "v1760999457/amalfi2_jfukpv.avif",
          "v1760999459/amalfi3_bjgjbw.avif"
        ],
        "startDate": "2026-10-01",
        "endDate": "2026-10-04"
      },
      {
        id: 'leto-2025-amalfi-villa-corallo',
        "group": "Leto 2025",
        "place": "Amalfi",
        "title": "Villa di Corallo",
        "price": 1960,
        "images": [
          "v1761005732/amalfi4_g4bcmx.png",
          "v1761005907/amalfi5_wcvfdb.png",
          "v1761005860/amalfi6_e1hkhj.png"
        ],
        "startDate": "2026-10-15",
        "endDate": "2026-10-18"
      },
      {
        id: 'leto-2025-valensia-playa-del-sol',
        "group": "Leto 2025",
        "place": "Valensia",
        "title": "Playa del Sol Apartments",
        "price": 740,
        "images": [
          "v1760995430/underwater_jvuh43.jpg",
          "v1760995431/underwater1_wgmba1.png",
          "v1760995432/underwater2_dlnyfx.jpg"
        ],
        "startDate": "2025-06-05",
        "endDate": "2025-06-08"
      },
      {
        id: 'leto-2025-valensia-marina-de-lirio',
        "group": "Leto 2025",
        "place": "Valensia",
        "title": "Marina de Lirio Suites",
        "price": 870,
        "images": [
          "v1760996300/valensia1_huf773.png",
          "v1760996303/valensia2_yl9soj.png",
          "v1760996304/valensia3_axt3ks.png"
        ],
        "startDate": "2026-06-10",
        "endDate": "2026-06-13"
      },
      {
        id: 'leto-2025-valensia-casa-naranja',
        "group": "Leto 2025",
        "place": "Valensia",
        "title": "Casa Naranja del Puerto",
        "price": 960,
        "images": [
          "v1760994093/aranzman13_1_kolwia.avif",
          "v1761005098/slika_zppgkv.avif",
          "v1760994094/aranzman13_3_rpvixi.avif"
        ],
        "startDate": "2026-07-01",
        "endDate": "2026-07-04"
      },
      {
        id: 'zima-2025-tirol-alpenglow-chalet',
        "group": "Zima 2025",
        "place": "Tirol",
        "title": "Alpenglow Chalet",
        "price": 1260,
        "images": [
          "v1760989236/aranzman7_1_hrkymb.jpg",
          "v1760989236/aranzman7_2_q7jsxw.jpg",
          "v1760989237/aranzman7_3_f2nvt3.jpg"
        ],
        "startDate": "2026-01-15",
        "endDate": "2026-01-20"
      },
      {
        id: 'zima-2025-tirol-haus-schneegrun',
        "group": "Zima 2025",
        "place": "Tirol",
        "title": "Haus Schneegrün",
        "price": 1520,
        "images": [
          "v1760989446/aranzman8_1_udh208.jpg",
          "v1760989446/aranzman8_2_es6zni.jpg",
          "v1760989447/aranzman8_3_fty6ke.jpg"
        ],
        "startDate": "2026-02-01",
        "endDate": "2026-02-05"
      },
      {
        id: 'zima-2025-tirol-chalet-edelpfad',
        "group": "Zima 2025",
        "place": "Tirol",
        "title": "Chalet Edelpfad",
        "price": 930,
        "images": [
          "v1760989534/aranzman9_1_wytjng.jpg",
          "v1760989534/aranzman9_2_xicrwr.jpg",
          "v1760989535/aranzman9_3_tigchd.jpg"
        ],
        "startDate": "2026-03-01",
        "endDate": "2026-03-05"
      },
      {
        id: 'zima-2025-kopaonik-planinska-vila-brezovik',
        "group": "Zima 2025",
        "place": "Kopaonik",
        "title": "Planinska Vila Brezovik",
        "price": 520,
        "images": [
          "v1760988461/aranzman3_1_vxakna.jpg",
          "v1760988461/aranzman3_2_ttftyj.jpg",
          "v1760988462/aranzman3_3_govztm.jpg"
        ],
        "startDate": "2025-12-15",
        "endDate": "2025-12-20"
      },
      {
        id: 'zima-2025-kopaonik-hotel-snezna-dolina',
        "group": "Zima 2025",
        "place": "Kopaonik",
        "title": "Hotel Snežna Dolina",
        "price": 670,
        "images": [
          "v1760996204/kopaonik1_vo0spt.png",
          "v1760996204/kopaonik2_idq47b.png",
          "v1760996206/kopaonik3_y2xvzu.png"
        ],
        "startDate": "2026-02-20",
        "endDate": "2026-02-25"
      },
      {
        id: 'zima-2025-kopaonik-apartmani-bela-cuka',
        "group": "Zima 2025",
        "place": "Kopaonik",
        "title": "Apartmani Bela Čuka",
        "price": 810,
        "images": [
          "v1760993325/aranzman10_3_acqaas.png",
          "v1760993324/aranzman10_2_jich0w.png",
          "v1760993323/aranzman10_1_vh80ed.png"
        ],
        "startDate": "2026-03-10",
        "endDate": "2026-03-15"
      },
      {
        id: 'zima-2025-zermatt-chalet-sonnenruh',
        "group": "Zima 2025",
        "place": "Zermatt",
        "title": "Chalet Sonnenruh",
        "price": 1640,
        "images": [
          "v1760996094/alps1_amdq8h.png",
          "v1760996095/alps2_aivrua.png",
          "v1760996099/alps3_y6ypnp.png"
        ],
        "startDate": "2026-01-05",
        "endDate": "2026-01-10"
      },
      {
        id: 'zima-2025-zermatt-haus-montglen-alpine',
        "group": "Zima 2025",
        "place": "Zermatt",
        "title": "Haus Montglen Alpine",
        "price": 1870,
        "images": [
          "v1760998298/alps1_jhnfxo.avif",
          "v1760998299/alps2_mfq86i.avif",
          "v1760998303/alps3_sbystb.avif"
        ],
        "startDate": "2026-02-14",
        "endDate": "2026-02-20"
      },
      {
        id: 'zima-2025-zermatt-alpina-crest-lodge',
        "group": "Zima 2025",
        "place": "Zermatt",
        "title": "Alpina Crest Lodge",
        "price": 1530,
        "images": [
          "v1761005905/amalfi7_o7zdny.png",
          "v1761006157/zermatt1_kscbvn.avif",
          "v1761006154/zermatt2_fst5pm.avif"
        ],
        "startDate": "2026-03-05",
        "endDate": "2026-03-10"
      }
    ]
  }
}
