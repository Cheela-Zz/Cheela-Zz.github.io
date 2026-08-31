import { Link } from 'react-router-dom'

import Portrait from '../components/Portrait.jsx'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import { albums, toRoman } from '../data/photos.js'
import {
  site,
  education,
  research,
  work,
  projects,
  skills,
  coursework,
  awards,
} from '../data/site.js'

function Section({ title, children }) {
  return (
    <section className="section">
      <h2 className="section__title eyebrow">{title}</h2>
      {children}
    </section>
  )
}

function Entry({ org, role, meta, description, href, hrefLabel }) {
  return (
    <li>
      <div className="entry__top">
        <span className="entry__org">{org}</span>
        {meta ? <span className="entry__meta">{meta}</span> : null}
      </div>
      {role ? <p className="entry__role">{role}</p> : null}
      {description ? <p className="entry__desc">{description}</p> : null}
      {href ? (
        <a className="entry__link link" href={href} target="_blank" rel="noreferrer">
          {hrefLabel}
        </a>
      ) : null}
    </li>
  )
}

export default function Home() {
  useDocumentTitle(null)

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <main id="main" className="page home">
        <header className="landing">
          <div className="landing__head">
            <h1 className="landing__name">{site.name}</h1>
            <p className="landing__tagline">{site.tagline}</p>
          </div>

          <Portrait
            video={site.portrait.video}
            poster={site.portrait.poster}
            alt={site.portrait.alt}
            caption={site.portrait.caption}
          />

          <div className="landing__body">
            <div className="landing__bio">
              {site.bio.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <nav className="landing__links" aria-label="Elsewhere">
              {site.links.map((link) =>
                link.to ? (
                  <Link key={link.label} className="link" to={link.to}>
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    className="link"
                    href={link.href}
                    target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                  >
                    {link.label}
                  </a>
                )
              )}
            </nav>
          </div>
        </header>

        <Section title="Education">
          <ul className="entries">
            <Entry
              org={education.school}
              role={education.degree}
              meta={education.meta}
              description={education.notes.join(' ')}
            />
          </ul>
        </Section>

        <Section title="Research">
          <ul className="entries">
            {research.map((item) => (
              <Entry key={item.org} {...item} />
            ))}
          </ul>
        </Section>

        <Section title="Work">
          <ul className="entries">
            {work.map((item) => (
              <Entry key={item.org} {...item} />
            ))}
          </ul>
        </Section>

        <Section title="Projects">
          <ul className="entries">
            {projects.map((item) => (
              <Entry
                key={item.name}
                org={item.name}
                meta={item.meta}
                description={item.description}
                href={item.href}
                hrefLabel={item.hrefLabel}
              />
            ))}
          </ul>
        </Section>

        <Section title="Skills">
          <ul className="defs">
            {skills.map((row) => (
              <li key={row.label}>
                <div className="def">
                  <span className="def__label eyebrow">{row.label}</span>
                  <span className="def__value">{row.items}</span>
                </div>
              </li>
            ))}
            <li>
              <div className="def">
                <span className="def__label eyebrow">Coursework</span>
                <span className="def__value">{coursework.join(', ')}</span>
              </div>
            </li>
          </ul>
        </Section>

        <Section title="Awards">
          <ul className="awards">
            {awards.map((award) => (
              <li key={award.name}>
                <span>{award.name}</span>
                {award.meta ? <span className="awards__meta">{award.meta}</span> : null}
              </li>
            ))}
          </ul>
        </Section>

        <section className="gateway">
          <Link className="gateway__link" to="/photos">
            <span className="gateway__name">Photographs</span>
            <span className="leader" aria-hidden="true" />
            <span className="gateway__num">{toRoman(albums.length)}</span>
          </Link>
          <p className="gateway__note">
            A book of pictures in {albums.length} chapters. One photograph to a page.
          </p>
        </section>

        <footer className="footer">
          <span>{site.location}</span>
          <a className="link" href="mailto:qile.zhu@mail.mcgill.ca">
            qile.zhu@mail.mcgill.ca
          </a>
        </footer>
      </main>
    </>
  )
}
