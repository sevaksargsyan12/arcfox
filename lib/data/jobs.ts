import jobsFixture from "./fixtures/jobs.json";
import { Locale, PaginatedResult, resolveLocalizedText, SelectOption } from "./types";

export interface JobCategory {
  id: string;
  label: string;
}

export interface JobArea {
  id: string;
  label: string;
}

export interface JobListItem {
  id: string;
  title: string;
  employmentType: string;
  openings: number;
  categoryId: string;
  areaId: string;
  areaName: string;
}

export interface JobDetail extends JobListItem {
  descriptionHtml: string;
}

/** Documents the eventual submission shape; not implemented in Phase 1. */
export interface JobApplicationInput {
  jobId: string;
  fullName: string;
  nationality: string;
  email: string;
  phone: string;
  currentCountry: string;
  currentCompany: string;
  resumeFileName: string;
}

interface RawJob {
  id: string;
  categoryId: string;
  areaId: string;
  openings: number;
  employmentType: Record<Locale, string>;
  title: Record<Locale, string>;
  descriptionHtml: Record<Locale, string>;
}

const rawJobs = jobsFixture.items as RawJob[];
const rawCategories = jobsFixture.categories as { id: string; label: Record<Locale, string> }[];
const rawAreas = jobsFixture.areas as { id: string; label: Record<Locale, string> }[];

function areaLabel(areaId: string, locale: Locale): string {
  const area = rawAreas.find((a) => a.id === areaId);
  return area ? resolveLocalizedText(area.label, locale) : areaId;
}

function toListItem(raw: RawJob, locale: Locale): JobListItem {
  return {
    id: raw.id,
    title: resolveLocalizedText(raw.title, locale),
    employmentType: resolveLocalizedText(raw.employmentType, locale),
    openings: raw.openings,
    categoryId: raw.categoryId,
    areaId: raw.areaId,
    areaName: areaLabel(raw.areaId, locale),
  };
}

export async function getJobCategories(locale: Locale): Promise<JobCategory[]> {
  return rawCategories.map((c) => ({ id: c.id, label: resolveLocalizedText(c.label, locale) }));
}

export async function getJobAreas(locale: Locale): Promise<JobArea[]> {
  return rawAreas.map((a) => ({ id: a.id, label: resolveLocalizedText(a.label, locale) }));
}

export async function getJobCategoryOptions(locale: Locale): Promise<SelectOption[]> {
  return (await getJobCategories(locale)).map((c) => ({ value: c.id, label: c.label }));
}

export async function getJobAreaOptions(locale: Locale): Promise<SelectOption[]> {
  return (await getJobAreas(locale)).map((a) => ({ value: a.id, label: a.label }));
}

export async function getJobList(
  locale: Locale,
  params: { page?: number; pageSize?: number; categoryId?: string; areaId?: string } = {}
): Promise<PaginatedResult<JobListItem>> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const filtered = rawJobs.filter(
    (j) =>
      (!params.categoryId || j.categoryId === params.categoryId) &&
      (!params.areaId || j.areaId === params.areaId)
  );
  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize).map((raw) => toListItem(raw, locale)),
    total: filtered.length,
    page,
    pageSize,
  };
}

export async function getJobIds(): Promise<string[]> {
  return rawJobs.map((j) => j.id);
}

export async function getJobById(id: string, locale: Locale): Promise<JobDetail | null> {
  const raw = rawJobs.find((j) => j.id === id);
  if (!raw) return null;
  return {
    ...toListItem(raw, locale),
    descriptionHtml: resolveLocalizedText(raw.descriptionHtml, locale),
  };
}

// Not implemented in Phase 1 -- forms show a shared success dialog instead
// of calling this. Documented so the Phase 2 WPGraphQL implementation has a
// stable signature to fill in.
export async function submitJobApplication(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature-only stub
  _input: JobApplicationInput
): Promise<{ success: true }> {
  throw new Error("submitJobApplication is not implemented in Phase 1 (mock data only).");
}
