import { getTranslations, setRequestLocale } from "next-intl/server";
import { getJobAreaOptions, getJobCategoryOptions, getJobList } from "@/lib/data/jobs";
import { Locale } from "@/lib/data/types";
import { Link } from "@/i18n/navigation";
import { JobFilterForm } from "@/components/careers/JobFilterForm";
import { Pagination } from "@/components/ui/Pagination";

export default async function CareersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; category?: string; area?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam, category, area } = await searchParams;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const page = Number(pageParam) || 1;

  const [t, tCommon, categories, areas, list] = await Promise.all([
    getTranslations({ locale, namespace: "careers" }),
    getTranslations({ locale, namespace: "common.pagination" }),
    getJobCategoryOptions(typedLocale),
    getJobAreaOptions(typedLocale),
    getJobList(typedLocale, { page, pageSize: 8, categoryId: category, areaId: area }),
  ]);

  const totalPages = Math.ceil(list.total / list.pageSize) || 1;

  return (
    <div className="container-max py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{t("pageTitle")}</h1>
        <p className="mt-4 text-charcoal-600">{t("subtitle")}</p>
      </div>

      <div className="mx-auto mt-10 max-w-xl">
        <JobFilterForm
          categories={categories}
          areas={areas}
          categoryValue={category}
          areaValue={area}
          categoryAllLabel={t("filterCategory")}
          areaAllLabel={t("filterArea")}
        />
      </div>

      <div className="mt-10 overflow-x-auto">
        {list.items.length === 0 ? (
          <p className="text-center text-charcoal-500">{t("empty")}</p>
        ) : (
          <table className="w-full min-w-140 text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal-500/15 text-charcoal-500">
                <th className="py-3 font-medium">{t("tableTitle")}</th>
                <th className="py-3 font-medium">{t("tableNature")}</th>
                <th className="py-3 text-center font-medium">{t("tableNumber")}</th>
                <th className="py-3 font-medium">{t("tableLocation")}</th>
              </tr>
            </thead>
            <tbody>
              {list.items.map((job) => (
                <tr key={job.id} className="border-b border-charcoal-500/10">
                  <td className="py-4">
                    <Link href={`/careers/${job.id}`} className="font-medium hover:text-brand-blue">
                      {job.title}
                    </Link>
                  </td>
                  <td className="py-4 text-charcoal-600">{job.employmentType}</td>
                  <td className="py-4 text-center text-charcoal-600">{job.openings}</td>
                  <td className="py-4 text-charcoal-600">{job.areaName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/careers"
        extraQuery={{ category, area }}
        prevLabel={tCommon("prev")}
        nextLabel={tCommon("next")}
      />
    </div>
  );
}
