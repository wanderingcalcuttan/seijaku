import { publicBackendJson } from "@/src/lib/backend";
import { cacheTags } from "@/src/lib/cache-tags";

export type ProgramStatus = "DRAFT" | "UPCOMING" | "BOOKING_OPEN" | "CLOSED";

export type ProgramSessionStatus =
  | "UPCOMING"
  | "BOOKING_OPEN"
  | "FULL"
  | "CLOSED"
  | "CANCELLED";

export type ProgramSessionView = {
  id: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  city: string;
  venueName: string | null;
  capacity: number;
  spotsRemaining: number;
  status: ProgramSessionStatus;
};

export type ProgramView = {
  slug: string;
  name: string;
  shortDescription: string;
  detailDescription: string | null;
  durationLabel: string | null;
  groupSizeLabel: string | null;
  status: ProgramStatus;
  sessions: ProgramSessionView[];
};

type BackendProgram = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  detailDescription: string | null;
  durationLabel: string | null;
  groupSizeLabel: string | null;
  status: ProgramStatus;
  sessions: ProgramSessionView[];
  createdAt: string;
  updatedAt: string;
};

function toViewModel(program: BackendProgram): ProgramView {
  return {
    slug: program.slug,
    name: program.name,
    shortDescription: program.shortDescription,
    detailDescription: program.detailDescription,
    durationLabel: program.durationLabel,
    groupSizeLabel: program.groupSizeLabel,
    status: program.status,
    sessions: program.sessions,
  };
}

const programFetchTags = [cacheTags.programs, cacheTags.programSessions];

export async function fetchPrograms(): Promise<ProgramView[]> {
  const { items } = await publicBackendJson<{ items: BackendProgram[] }>(
    "/content/programs",
    { tags: programFetchTags },
  );
  return items.map(toViewModel);
}

export async function fetchProgram(slug: string): Promise<ProgramView | null> {
  try {
    const { item } = await publicBackendJson<{ item: BackendProgram }>(
      `/content/programs/${encodeURIComponent(slug)}`,
      { tags: programFetchTags },
    );
    return toViewModel(item);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes("program not found")) {
      return null;
    }
    throw err;
  }
}

export type FeaturedProgramSession = {
  program: ProgramView;
  session: ProgramSessionView;
};

// Picks the first program with status BOOKING_OPEN that has at least one
// future session whose status is UPCOMING or BOOKING_OPEN, and returns
// the earliest such session. Returns null if nothing qualifies — caller
// should hide the featured block in that case.
export function findFeaturedProgramSession(
  programs: ProgramView[],
  now: Date = new Date(),
): FeaturedProgramSession | null {
  const nowMs = now.getTime();

  for (const program of programs) {
    if (program.status !== "BOOKING_OPEN") continue;

    const eligible = program.sessions
      .filter(
        (s) =>
          (s.status === "UPCOMING" || s.status === "BOOKING_OPEN") &&
          new Date(s.startsAt).getTime() > nowMs,
      )
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

    if (eligible.length > 0) {
      return { program, session: eligible[0] };
    }
  }

  return null;
}
