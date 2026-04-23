import Link from "next/link";
import { notFound } from "next/navigation";

import ProgramReservationForm from "@/src/components/ProgramReservationForm";
import { fetchProgram, type ProgramSessionView } from "@/src/lib/program-types";

export const dynamic = "force-dynamic";

type ProgramDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatSessionRow(session: ProgramSessionView): string {
  const starts = new Date(session.startsAt);
  const date = starts.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = starts.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  return `${date} • ${time} • ${session.venueName ?? session.city}`;
}

export default async function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { slug } = await params;
  const program = await fetchProgram(slug);

  if (!program) {
    notFound();
  }

  const now = Date.now();
  const upcomingSessions = program.sessions
    .filter((s) => new Date(s.startsAt).getTime() > now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#F3EFE7] pt-[72px] text-[#3a3a3a] sm:pt-[76px]">
      <section className="section-primary bg-[#F3EFE7]">
        <div className="page-container">
          <div className="max-w-[760px]">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a785d]">Program Detail</p>
            <h1 className="mt-5">{program.name}</h1>
            <p className="mt-5 max-w-[48ch] text-[16px] leading-[1.82] text-[#5e584f]">
              {program.shortDescription}
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-6">
              <div className="rounded-[28px] border border-[#D8CEC1] bg-[#FAF7F1] p-8">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#8d7d6d]">Program Overview</p>
                {program.detailDescription ? (
                  <p className="mt-5 whitespace-pre-line text-[15px] leading-[1.85] text-[#5f584f]">
                    {program.detailDescription}
                  </p>
                ) : (
                  <p className="mt-5 text-[15px] leading-[1.85] text-[#5f584f]">
                    Detail pending. Seijaku will follow up on confirmation.
                  </p>
                )}
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
                  href="/programs"
                  className="mt-6 inline-flex text-[12px] uppercase tracking-[0.18em] text-[#2e4a36] hover:text-[#1d3024]"
                >
                  Return to Programs &rarr;
                </Link>
              </div>

              {upcomingSessions.length > 0 ? (
                <div className="rounded-[28px] border border-[#D8CEC1] bg-[#FAF7F1] p-8">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#8d7d6d]">Upcoming Sessions</p>
                  <ul className="mt-5 space-y-3">
                    {upcomingSessions.map((session) => (
                      <li
                        key={session.id}
                        className="rounded-[18px] border border-[#e0d5c9] bg-[#fcf9f4] px-5 py-4 text-[14px] leading-[1.7] text-[#4f4943]"
                      >
                        <p>{formatSessionRow(session)}</p>
                        <p className="mt-1 text-[12px] uppercase tracking-[0.18em] text-[#8d7d6d]">
                          {session.spotsRemaining} of {session.capacity} seats available
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <ProgramReservationForm slug={program.slug} title={program.name} />
          </div>
        </div>
      </section>
    </main>
  );
}
