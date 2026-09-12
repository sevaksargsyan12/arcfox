"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { TextField } from "@/components/forms/fields";
import { FileUploadField } from "@/components/forms/FileUploadField";
import { useFormSubmit } from "@/components/forms/useFormSubmit";

const schema = z.object({
  fullName: z.string().min(1),
  nationality: z.string().min(1),
  email: z.string().min(1).email(),
  phone: z.string().min(1),
  currentCountry: z.string().min(1),
  currentCompany: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export function JobApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const t = useTranslations("careers.form");
  const tValidation = useTranslations("form.validation");
  const tCommon = useTranslations("common.buttons");
  const { submit, isSubmitting } = useFormSubmit();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit() {
    if (!resumeFile) {
      setResumeError(tValidation("fileRequired"));
      return;
    }
    setResumeError(null);
    void submit(() => {
      reset();
      setResumeFile(null);
    });
  }

  return (
    <form id="apply-form" onSubmit={handleSubmit(onSubmit)} className="scroll-mt-24 rounded-2xl bg-form-bg p-6 md:p-10">
      <h2 className="font-display text-2xl font-semibold">
        {t("title")} - {jobTitle}
      </h2>
      <input type="hidden" value={jobId} readOnly />

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TextField
          label={t("fullName")}
          error={errors.fullName && tValidation("required")}
          {...register("fullName")}
        />
        <TextField
          label={t("nationality")}
          error={errors.nationality && tValidation("required")}
          {...register("nationality")}
        />
        <TextField
          label={t("email")}
          type="email"
          error={errors.email && tValidation("invalidEmail")}
          {...register("email")}
        />
        <TextField
          label={t("phone")}
          type="tel"
          error={errors.phone && tValidation("required")}
          {...register("phone")}
        />
        <TextField
          label={t("currentCountry")}
          error={errors.currentCountry && tValidation("required")}
          {...register("currentCountry")}
        />
        <TextField
          label={t("currentCompany")}
          error={errors.currentCompany && tValidation("required")}
          {...register("currentCompany")}
        />
      </div>

      <div className="mt-5">
        <FileUploadField
          label={t("resume")}
          hint={t("resumeHint")}
          chooseLabel={t("resumeChoose")}
          emptyLabel={t("resumeNone")}
          file={resumeFile}
          onChange={setResumeFile}
          error={resumeError ?? undefined}
        />
      </div>

      <button type="submit" disabled={isSubmitting} className="btn mt-8">
        {isSubmitting ? tCommon("sending") : tCommon("submit")}
      </button>
    </form>
  );
}
