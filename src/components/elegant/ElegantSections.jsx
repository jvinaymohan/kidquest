import { Link, useNavigate } from "react-router-dom";
import { SUBJECTS } from "../../data/subjects";
import { isLiveSubject, pathForSubject } from "../../config/liveSubjects";
import {
  BEYOND_SCHOOL_CARDS,
  LIFE_SKILLS,
  PLATFORM_STATS,
  WORLD_STYLES,
  COMING_SOON_WORLDS,
} from "./elegantContent";

export function CuriosityTeaser({ compact = false }) {
  return (
    <section className={`elegant-curiosity ${compact ? "elegant-curiosity-compact" : ""}`}>
      <p className="elegant-section-label">What is KidQuest?</p>
      <h2 className="elegant-section-headline">
        School teaches you <em>the answers.</em>
        <br />
        We teach you to love the questions.
      </h2>
      {!compact && (
        <p className="elegant-section-body">
          KidQuest is a world built around your child&apos;s curiosity. Every quest ignites wonder,
          sparks new passions, and builds skills the world actually needs — things no textbook ever
          covers.
        </p>
      )}
    </section>
  );
}

export function BeyondSchoolGrid({ onComingSoon }) {
  const navigate = useNavigate();

  function openCard(card) {
    if (card.to) navigate(card.to);
    else onComingSoon?.(card.tag);
  }

  return (
    <div className="elegant-beyond-grid">
      {BEYOND_SCHOOL_CARDS.map((card) => {
        const Tag = card.to ? "button" : "div";
        return (
          <Tag
            key={card.id}
            type={card.to ? "button" : undefined}
            onClick={card.to ? () => openCard(card) : undefined}
            className={`elegant-beyond-card ${card.glow} ${card.to ? "elegant-beyond-card-link focus-ring" : ""}`}
          >
            <div className={`elegant-card-icon-wrap ${card.iconWrap}`}>{card.icon}</div>
            <div className="elegant-card-title">{card.title}</div>
            <div className="elegant-card-desc">{card.desc}</div>
            <span className={`elegant-card-tag ${card.tagClass}`}>
              {card.exploreLabel && card.to ? card.exploreLabel : card.tag}
            </span>
          </Tag>
        );
      })}
    </div>
  );
}

export function LifeSkillsStrip() {
  return (
    <section className="elegant-life-skills">
      <div className="elegant-ls-inner">
        <p className="elegant-section-label">Life skills, unlocked</p>
        <h2 className="elegant-section-headline elegant-ls-headline">
          Everything they need to thrive — beyond any exam
        </h2>
        <div className="elegant-ls-grid">
          {LIFE_SKILLS.map((skill) => (
            <div key={skill.name} className="elegant-ls-item">
              <div className="elegant-ls-ring">{skill.icon}</div>
              <div className="elegant-ls-name">{skill.name}</div>
              <div className="elegant-ls-sub">{skill.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WonderQuote() {
  return (
    <section className="elegant-wonder">
      <p className="elegant-wonder-quote">
        &ldquo;The important thing is <strong>not to stop questioning.</strong> Curiosity has its
        own reason for existing.&rdquo;
      </p>
      <p className="elegant-wonder-attr">— Albert Einstein</p>
    </section>
  );
}

export function StatsRow({ stats = PLATFORM_STATS }) {
  return (
    <div className="elegant-stats-row">
      {stats.map((s) => (
        <div key={s.label} className="elegant-stat-item">
          <div className="elegant-stat-num">
            {s.num}
            <span>{s.suffix}</span>
          </div>
          <div className="elegant-stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function WorldsShowcase({ onWorldClick, onComingSoon, interactive = true }) {
  const navigate = useNavigate();
  const live = SUBJECTS.filter((s) => isLiveSubject(s.id));
  const soonFromSubjects = SUBJECTS.filter((s) => !isLiveSubject(s.id));

  function handleLiveWorld(subject) {
    if (onWorldClick) {
      onWorldClick(subject);
      return;
    }
    const path = pathForSubject(subject.id);
    if (path) navigate(path);
  }

  return (
    <section className="elegant-worlds-section">
      <p className="elegant-worlds-label">Live worlds</p>
      <h2 className="elegant-section-headline">Pick a world, start a quest</h2>
      <p className="elegant-section-body elegant-worlds-sub">
        {live.length} worlds live now — dozens more unlocking as you quest.
      </p>
      <div className="elegant-worlds-grid">
        {live.map((subject) => {
          const style = WORLD_STYLES[subject.id] ?? {
            emoji: "✨",
            gradient: "wc-sci",
            xp: 30,
            displayName: subject.name,
          };
          const path = pathForSubject(subject.id);
          const Tag = interactive && path ? "button" : "div";
          return (
            <Tag
              key={subject.id}
              type={interactive && path ? "button" : undefined}
              onClick={interactive && path ? () => handleLiveWorld(subject) : undefined}
              className={`elegant-world-card ${style.gradient} focus-ring`}
            >
              <span className="elegant-world-emoji">{style.emoji}</span>
              <div className="elegant-world-name">{style.displayName ?? subject.name}</div>
              <div className="elegant-world-xp">+{style.xp} XP</div>
              <span className="elegant-live-badge">Live</span>
            </Tag>
          );
        })}
        {soonFromSubjects.map((subject) => {
          const style = WORLD_STYLES[subject.id] ?? { emoji: "🔒", gradient: "wc-hist" };
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => onComingSoon?.(subject.name)}
              className={`elegant-world-card elegant-world-coming ${style.gradient} focus-ring`}
            >
              <span className="elegant-world-emoji">{style.emoji ?? "📚"}</span>
              <div className="elegant-world-name">{subject.name}</div>
              <div className="elegant-world-xp">Coming soon</div>
            </button>
          );
        })}
        {COMING_SOON_WORLDS.filter(
          (w) => !soonFromSubjects.some((s) => s.id === w.id)
        ).map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => onComingSoon?.(w.name)}
            className={`elegant-world-card elegant-world-coming ${w.gradient} focus-ring`}
          >
            <span className="elegant-world-emoji">{w.emoji}</span>
            <div className="elegant-world-name">{w.name}</div>
            <div className="elegant-world-xp">Coming soon</div>
          </button>
        ))}
      </div>
    </section>
  );
}

/** Pre-login bottom CTA with invite buttons. */
export function LandingBottomCta() {
  return (
    <section className="elegant-cta-bottom">
      <div className="elegant-cta-card">
        <h2 className="elegant-cta-title">Ready to start your quest?</h2>
        <p className="elegant-cta-sub">
          Join curious kids exploring worlds, earning XP, and learning things they&apos;ll actually
          use in life — for free.
        </p>
        <div className="elegant-cta-btns">
          <Link to="/register" className="elegant-btn-primary focus-ring">
            🚀 I have an invite code
          </Link>
          <Link to="/invite-request" className="elegant-btn-secondary focus-ring">
            ✨ Request an invite
          </Link>
        </div>
        <p className="elegant-footer-note">100% free · Safe for ages 6–14 · No ads, ever</p>
      </div>
    </section>
  );
}

/** Logged-in bottom CTA — mirrors hero, drives play. */
export function HomeBottomCta({ kidName }) {
  const name = kidName || "explorer";
  return (
    <section className="elegant-cta-bottom">
      <div className="elegant-cta-card">
        <h2 className="elegant-cta-title">Keep questioning, {name}</h2>
        <p className="elegant-cta-sub">
          Your next quest is waiting. Pick a world, earn XP, and come back tomorrow for new
          surprises.
        </p>
        <div className="elegant-cta-btns">
          <Link to="/explore" className="elegant-btn-primary focus-ring">
            🌍 Explore worlds
          </Link>
          <Link to="/journey" className="elegant-btn-secondary focus-ring">
            ✨ My journey
          </Link>
        </div>
        <p className="elegant-footer-note">Streaks, treasure & badges — all in your hub</p>
      </div>
    </section>
  );
}

export function HeroEyebrow({ text = "Free for curious kids everywhere" }) {
  return (
    <div className="elegant-eyebrow">
      <span className="elegant-eyebrow-dot" aria-hidden />
      {text}
    </div>
  );
}

export function HeroPills({ pills }) {
  const items = pills ?? [];
  return (
    <div className="elegant-pills">
      {items.map((p) => (
        <span key={p.label} className="elegant-pill">
          <span className="elegant-pill-icon" aria-hidden>
            {p.icon}
          </span>
          {p.label}
        </span>
      ))}
    </div>
  );
}

export { HERO_PILLS } from "./elegantContent";
