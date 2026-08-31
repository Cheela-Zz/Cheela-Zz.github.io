/*
 * Everything on the home page comes from this file.
 * Edit the text here; you should not need to touch the components.
 */

export const site = {
  name: 'Cheela Zhu',
  tagline: 'Software engineering at McGill.',
  location: 'Montreal, QC',

  // Shown under the name on the landing.
  bio: [
    'I am a software engineering undergraduate at McGill, minoring in Linguistics. Right now I build medical software at an early stage startup and study how language model agents coordinate with one another.',
    'I also take photographs.',
  ],

  // The landing video. Drop your own clip at public/media/portrait.mp4 and a
  // still frame at public/media/portrait-poster.jpg. See README.md for specs.
  portrait: {
    video: 'media/portrait.mp4',
    poster: 'media/portrait-poster.jpg',
    alt: 'A short black and white portrait clip of Cheela',
    caption: 'Montreal, 2026',
  },

  links: [
    { label: 'Email', href: 'mailto:qile.zhu@mail.mcgill.ca' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/cheela-zhu' },
    { label: 'GitHub', href: 'https://github.com/cheela-zhu' }, // TODO: your real handle
    { label: 'Photographs', to: '/photos' },
  ],
}

export const education = {
  school: 'McGill University',
  degree: 'Software Engineering, minor in Linguistics',
  meta: 'Expected Winter 2028',
  notes: [
    'French Language Program, Université Laval, on a Bourse de McGill. Summer 2025.',
  ],
}

export const research = [
  {
    org: 'Centre for Intelligent Machines, McGill',
    role: 'Research Volunteer',
    meta: '2025 to now',
    description:
      'Co-authored a paper on decentralized coordination of LLM agents in self-play multi-agent games, submitted to IEEE MIT URTC 2026. Built a Python parallel baseline for benchmarking Rust line-of-sight computation in multi-agent robotics environments.',
  },
  {
    org: 'Embedded Ethics in CS Education, McGill',
    role: 'Undergraduate Researcher, FSCI 396',
    meta: '2026 to now',
    description:
      'Analyzing survey responses from over 400 students on interest, value, self-efficacy, and responsibility around ethics. Running hypothesis tests and correlational analyses across demographics, courses, and semester cohorts.',
  },
]

export const work = [
  {
    org: 'Acuiti Health',
    role: 'Full-Stack Developer Intern',
    meta: 'Summer 2026',
    description:
      'Software-as-a-Medical-Device tooling at an early stage medtech startup. Designed Supabase and PostgreSQL schemas with row level security and JSONB for patient and clinician workflows, and built type-safe TypeScript access layers over Supabase queries and RPCs.',
  },
  {
    org: 'Geophysical Survey and Research Institute',
    role: 'Geospatial Data Intern',
    meta: 'Summer 2024',
    description:
      'Digitized documentation for over 200 geological sites and built a structured repository linking GPS metadata to site photography and field observations.',
  },
  {
    org: 'REISA',
    role: 'Graphic Design Assistant',
    meta: '2025',
    description:
      'Website QA and accessibility recommendations for a community services network, plus a set of Canva templates built to a fixed palette and style guide.',
  },
]

export const projects = [
  {
    name: 'Turing Blend',
    meta: 'Gemini API, React, Node',
    description:
      'An application built on the Gemini API for multimodal reasoning and generation. Won Best Use of Gemini API at MPC Hacks.',
    href: 'https://devpost.com/', // TODO: your Devpost link
    hrefLabel: 'Devpost',
  },
  {
    name: 'SOCS Booking App',
    meta: 'MongoDB, Express, React, Node',
    description:
      'Frontend lead on a booking app for the McGill School of Computer Science: availability management, group meetings, meeting requests, scheduling modals, and shared UI. Nominated in the SOCS website competition.',
    href: 'https://github.com/', // TODO: your repo link
    hrefLabel: 'GitHub',
  },
]

export const skills = [
  {
    label: 'Languages',
    items: 'Python, C, C++, Java, OCaml, Assembly, Bash, JavaScript, TypeScript, PostgreSQL',
  },
  {
    label: 'Web and tools',
    items: 'React, Vite, Node, HTML, CSS, PHP, Supabase, Git, GitHub Actions, IntelliJ, VS Code',
  },
  { label: 'Spoken', items: 'English, Mandarin, French' },
]

export const coursework = [
  'Programming Languages and Paradigms',
  'Principles of Web Development',
  'Software Design',
  'Data Structures and Algorithms',
]

export const awards = [
  { name: 'Montreal AI Safety Control Hackathon', meta: 'Winner' },
  { name: 'MPC Hacks (Concordia, Polytechnique, McGill)', meta: 'Best Use of Gemini API' },
  { name: 'McGill Engine Summer Startup Internship Award', meta: '2026' },
  { name: 'International Linguistics Olympiad', meta: 'Distinction' },
  { name: 'Yuanpei Young Scholars Program, Peking University', meta: '' },
  { name: 'EnvirothonX', meta: 'Great Distinction' },
]
