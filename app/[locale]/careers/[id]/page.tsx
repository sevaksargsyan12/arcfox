import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getJobById, getJobIds } from "@/lib/data/jobs";
import { Locale } from "@/lib/data/types";
import { JobApplyForm } from "@/components/careers/JobApplyForm";

export async function generateStaticParams() {
  const ids = await getJobIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const job = await getJobById(id, locale as Locale);
  if (!job) return {};
  return { title: job.title };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [job, t] = await Promise.all([
    getJobById(id, locale as Locale),
    getTranslations({ locale, namespace: "careers.detail" }),
  ]);

  if (!job) {
    notFound();
  }

  return (
    <div className="container-max max-w-3xl py-16 md:py-24">
      <h1 className="font-display text-3xl font-bold md:text-4xl">{job.title}</h1>
      <p className="mt-3 flex items-center gap-2 text-charcoal-600">
        <MapPin size={16} />
        {job.areaName}
      </p>

      <hr className="my-8 border-charcoal-500/15" />

      <h2 className="font-display text-xl font-semibold">{t("descriptionTitle")}</h2>
      <div className="g-html mt-4" dangerouslySetInnerHTML={{ __html: job.descriptionHtml }} />

      <a href="#apply-form" className="btn mt-10 inline-flex">
        {t("applyCta")}
      </a>

      <div className="mt-10">
        <JobApplyForm jobId={job.id} jobTitle={job.title} />
      </div>
    </div>
  );
}
