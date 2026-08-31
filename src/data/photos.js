/*
 * The photography book.
 *
 * Each entry here becomes one chapter in the table of contents, and each plate
 * becomes one page inside that chapter. To add a picture: drop the file into
 * public/media/photos/<slug>/ and add a line to `plates`.
 *
 *   src      path under public/, no leading slash
 *   caption  one short line. Keep it to a phrase.
 *   w, h     the file's real pixel size. Optional, but it stops the page from
 *            jumping around while images load.
 */

export const albums = [
  {
    slug: 'montreal',
    title: 'Montreal',
    subtitle: 'Winter light on the plateau, 2024 to 2026',
    plates: [
      { src: 'media/photos/montreal/01.jpg', w: 1400, h: 933, caption: 'Rue Saint-Denis, February' },
      { src: 'media/photos/montreal/02.jpg', w: 1000, h: 1500, caption: 'Fire escape, nine in the morning' },
      { src: 'media/photos/montreal/03.jpg', w: 1400, h: 933, caption: 'The mountain, from the east' },
      { src: 'media/photos/montreal/04.jpg', w: 1200, h: 1200, caption: 'Dépanneur window' },
      { src: 'media/photos/montreal/05.jpg', w: 1000, h: 1500, caption: 'Someone waiting for the 80' },
      { src: 'media/photos/montreal/06.jpg', w: 1400, h: 933, caption: 'Last snow, Parc La Fontaine' },
    ],
  },
  {
    slug: 'tibet',
    title: 'Tibet',
    subtitle: 'Field season, summer 2024',
    plates: [
      { src: 'media/photos/tibet/01.jpg', w: 1400, h: 933, caption: 'Survey site, before the light came up' },
      { src: 'media/photos/tibet/02.jpg', w: 1000, h: 1500, caption: 'The theodolite and its shadow' },
      { src: 'media/photos/tibet/03.jpg', w: 1400, h: 933, caption: 'Road out of the valley' },
      { src: 'media/photos/tibet/04.jpg', w: 1200, h: 1200, caption: 'Two hundred sites, one notebook' },
      { src: 'media/photos/tibet/05.jpg', w: 1400, h: 933, caption: 'Weather coming in' },
    ],
  },
  {
    slug: 'quebec',
    title: 'Québec',
    subtitle: 'Une saison en français, Université Laval, 2025',
    plates: [
      { src: 'media/photos/quebec/01.jpg', w: 1000, h: 1500, caption: 'Escalier casse-cou' },
      { src: 'media/photos/quebec/02.jpg', w: 1400, h: 933, caption: 'The river, flat and grey' },
      { src: 'media/photos/quebec/03.jpg', w: 1400, h: 933, caption: 'Classroom, second week' },
      { src: 'media/photos/quebec/04.jpg', w: 1200, h: 1200, caption: 'Vocabulary, on a napkin' },
      { src: 'media/photos/quebec/05.jpg', w: 1000, h: 1500, caption: 'Rue Saint-Jean at closing time' },
    ],
  },
  {
    slug: 'rooms',
    title: 'Rooms',
    subtitle: 'Interiors, and the people who were in them',
    plates: [
      { src: 'media/photos/rooms/01.jpg', w: 1400, h: 933, caption: 'Kitchen table, Sunday' },
      { src: 'media/photos/rooms/02.jpg', w: 1000, h: 1500, caption: 'She did not know I was there' },
      { src: 'media/photos/rooms/03.jpg', w: 1200, h: 1200, caption: 'Curtain, afternoon' },
      { src: 'media/photos/rooms/04.jpg', w: 1400, h: 933, caption: 'The last hour of a party' },
    ],
  },
  {
    slug: 'nightwalks',
    title: 'Nightwalks',
    subtitle: 'After midnight, pushed two stops',
    plates: [
      { src: 'media/photos/nightwalks/01.jpg', w: 1400, h: 933, caption: 'Parking lot, no cars' },
      { src: 'media/photos/nightwalks/02.jpg', w: 1000, h: 1500, caption: 'A lit window, four floors up' },
      { src: 'media/photos/nightwalks/03.jpg', w: 1400, h: 933, caption: 'Underpass' },
      { src: 'media/photos/nightwalks/04.jpg', w: 1200, h: 1200, caption: 'Grain, mostly' },
      { src: 'media/photos/nightwalks/05.jpg', w: 1400, h: 933, caption: 'Walking home' },
    ],
  },
  {
    slug: 'studies',
    title: 'Studies',
    subtitle: 'Small objects, held still',
    plates: [
      { src: 'media/photos/studies/01.jpg', w: 1200, h: 1200, caption: 'Hands, borrowed' },
      { src: 'media/photos/studies/02.jpg', w: 1000, h: 1500, caption: 'A glass of water, twice' },
      { src: 'media/photos/studies/03.jpg', w: 1400, h: 933, caption: 'Folded paper' },
      { src: 'media/photos/studies/04.jpg', w: 1200, h: 1200, caption: 'Keys' },
      { src: 'media/photos/studies/05.jpg', w: 1000, h: 1500, caption: 'The same corner, again' },
    ],
  },
]

export const book = {
  title: 'Photographs',
  byline: 'Cheela Zhu',
  // Shown at the foot of the contents page, in the manner of a title page.
  edition: 'v. MMXXVI',
}

export function albumBySlug(slug) {
  return albums.find((a) => a.slug === slug)
}

const NUMERALS = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
]

export function toRoman(n) {
  let out = ''
  let rest = n
  for (const [value, sign] of NUMERALS) {
    while (rest >= value) {
      out += sign
      rest -= value
    }
  }
  return out
}
