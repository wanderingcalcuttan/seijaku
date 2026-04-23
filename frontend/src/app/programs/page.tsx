import Link from "next/link";

import {
  fetchPrograms,
  findFeaturedProgramSession,
  type ProgramSessionView,
} from "@/src/lib/program-types";

export const dynamic = "force-dynamic";

// Static marketing scaffolding — page-level decoration, not per-program.
// Handled in Phase 5 block-level work when pages become CMS-editable.
const trustNotes = ["Intimate group size", "Research-rooted design", "Facilitator-led guidance"];

const expectations = [
  "Guided breath and grounding ritual",
  "Memory and reflection circle",
  "Gentle movement",
  "Closing tea meditation",
];

function formatSessionDate(session: ProgramSessionView): string {
  return new Date(session.startsAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatSessionTimeRange(session: ProgramSessionView): string {
  const opts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  const start = new Date(session.startsAt).toLocaleTimeString("en-IN", opts);
  const end = new Date(session.endsAt).toLocaleTimeString("en-IN", opts);
  return `${start} – ${end}`;
}

export default async function ProgramsPage() {
  const programs = await fetchPrograms();
  const featured = findFeaturedProgramSession(programs);

  return (
    <main className="min-h-screen bg-[#F3EFE7] pt-[72px] text-[#3a3a3a] sm:pt-[76px]">
      <section className="section-primary bg-[#F3EFE7]">
        <div className="page-container grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="max-w-[560px]">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a785d]">Guided Programs</p>
            <h1 className="mt-5">Guided Programs</h1>
            <p className="mt-5 max-w-[44ch] text-[16px] leading-[1.82] text-[#5e584f]">
              Daytime sensory immersions designed to reset rhythm and deepen everyday practice.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              {featured ? (
                <Link
                  href="#upcoming-program"
                  className="inline-flex items-center justify-center rounded-full bg-[#2e4a36] px-7 py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-[#f4efe8] hover:bg-[#243c2c]"
                >
                  View Upcoming Program
                </Link>
              ) : null}
              <Link
                href="/lifestyle"
                className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-[#2e4a36] hover:text-[#1d3024]"
              >
                <span>Explore Ritual Boxes</span>
                <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#D8CEC1] bg-[#FAF7F1] p-8 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#8d7d6d]">Daytime Format</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[20px] border border-[#e0d5c9] bg-[#f7f2eb] px-5 py-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#8d7d6d]">Designed For</p>
                <p className="mt-2 font-serif text-[28px] leading-[1.08] tracking-[-0.02em] text-[#1c1c1c]">Small groups</p>
              </div>
              <div className="rounded-[20px] border border-[#e0d5c9] bg-[#f7f2eb] px-5 py-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#8d7d6d]">Format</p>
                <p className="mt-2 font-serif text-[28px] leading-[1.08] tracking-[-0.02em] text-[#1c1c1c]">Guided sessions</p>
              </div>
              <div className="rounded-[20px] border border-[#e0d5c9] bg-[#f7f2eb] px-5 py-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#8d7d6d]">Intent</p>
                <p className="mt-2 font-serif text-[28px] leading-[1.08] tracking-[-0.02em] text-[#1c1c1c]">Daily continuity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-primary bg-[#EAE3D8]">
        <div className="page-container">
          <div className="section-divider pt-12">
            <div className="max-w-[620px]">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a785d]">Program Pathways</p>
              <h2 className="mt-4 text-[#1c1c1c]">Three daytime formats</h2>
            </div>

            {programs.length === 0 ? (
              <p className="mt-12 text-[15px] text-[#5d574e]">New programs are being prepared. Check back shortly.</p>
            ) : (
              <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {programs.map((program) => (
                  <article
                    key={program.slug}
                    className="flex h-full flex-col rounded-[24px] border border-[#D8CEC1] bg-[#FAF7F1] p-7 shadow-[0_10px_24px_rgba(45,38,28,0.04)]"
                  >
                    <h3 className="font-serif text-[28px] leading-[1.1] tracking-[-0.02em] text-[#1c1c1c]">{program.name}</h3>
                    <p className="mt-4 max-w-[30ch] text-[15px] leading-[1.8] text-[#5f584f]">{program.shortDescription}</p>
                    <div className="mt-6 space-y-3 border-t border-[rgba(0,0,0,0.06)] pt-5">
                      {program.durationLabel ? (
                        <p className="text-[12px] uppercase tracking-[0.18em] text-[#8d7d6d]">
                          Duration <span className="ml-2 normal-case tracking-normal text-[#4f4943]">{program.durationLabel}</span>
                        </p>
                      ) : null}
                      {program.groupSizeLabel ? (
                        <p className="text-[12px] uppercase tracking-[0.18em] text-[#8d7d6d]">
                          Ideal group <span className="ml-2 normal-case tracking-normal text-[#4f4943]">{program.groupSizeLabel}</span>
                        </p>
                      ) : null}
                    </div>
                    <Link
                      href={`/programs/${program.slug}`}
                      className="mt-auto pt-8 text-[12px] uppercase tracking-[0.18em] text-[#2e4a36] hover:text-[#1d3024]"
                    >
                      View Details &rarr;
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {featured ? (
        <section id="upcoming-program" className="section-primary bg-[#F3EFE7]">
          <div className="page-container">
            <div className="section-divider pt-12">
              <div className="rounded-[30px] border border-[#cdbfaa] bg-[#f8f3ec] p-8 shadow-[0_18px_40px_rgba(48,40,30,0.06)] sm:p-10 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a785d]">Featured Upcoming Program</p>
                  <h2 className="mt-4 text-[#1c1c1c]">{featured.program.name} — Upcoming Session</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[20px] border border-[#ddd2c5] bg-[#fcf9f4] px-5 py-5">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#8d7d6d]">Date</p>
                      <p className="mt-2 text-[16px] text-[#1c1c1c]">{formatSessionDate(featured.session)}</p>
                    </div>
                    <div className="rounded-[20px] border border-[#ddd2c5] bg-[#fcf9f4] px-5 py-5">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#8d7d6d]">Time</p>
                      <p className="mt-2 text-[16px] text-[#1c1c1c]">{formatSessionTimeRange(featured.session)}</p>
                    </div>
                    <div className="rounded-[20px] border border-[#ddd2c5] bg-[#fcf9f4] px-5 py-5">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#8d7d6d]">Seats</p>
                      <p className="mt-2 text-[16px] text-[#1c1c1c]">{featured.session.spotsRemaining} of {featured.session.capacity} available</p>
                    </div>
                    <div className="rounded-[20px] border border-[#ddd2c5] bg-[#fcf9f4] px-5 py-5">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#8d7d6d]">Location</p>
                      <p className="mt-2 text-[16px] text-[#1c1c1c]">{featured.session.venueName ?? featured.session.city}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 lg:mt-0">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#8d7d6d]">What to Expect</p>
                  <div className="mt-5 grid gap-4">
                    {expectations.map((item) => (
                      <div key={item} className="rounded-[18px] border border-[#ddd2c5] bg-[#fcf9f4] px-5 py-4">
                        <p className="text-[15px] leading-[1.75] text-[#4f4943]">{item}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/programs/${featured.program.slug}`}
                    className="mt-8 inline-flex items-center justify-center rounded-full bg-[#2e4a36] px-7 py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-[#f4efe8] hover:bg-[#243c2c]"
                  >
                    Reserve Your Spot
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-secondary bg-[#EAE3D8]">
        <div className="page-container">
          <div className="section-divider flex flex-col gap-6 pt-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[520px]">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a785d]">Practice Beyond the Day</p>
              <h3 className="mt-4 font-serif text-[clamp(28px,3vw,36px)] leading-[1.12] tracking-[-0.02em] text-[#1c1c1c]">
                Practice Beyond the Day
              </h3>
              <p className="mt-4 text-[16px] leading-[1.82] text-[#5f584f]">
                Our ritual boxes are designed to sustain what begins in these programs.
              </p>
            </div>
            <Link
              href="/lifestyle"
              className="inline-flex items-center justify-center rounded-full border border-[#D8CEC1] bg-[#FAF7F1] px-6 py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-[#2e4a36] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(44,40,34,0.08)]"
            >
              Explore Ritual Boxes &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="section-editorial bg-[#F3EFE7]">
        <div className="page-container">
          <div className="section-divider grid gap-4 pt-10 text-center sm:grid-cols-3 sm:text-left">
            {trustNotes.map((item) => (
              <p
                key={item}
                className="rounded-[18px] border border-[#e0d5c9] bg-[#FAF7F1] px-5 py-4 text-[12px] uppercase tracking-[0.22em] text-[#4f4943]"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
