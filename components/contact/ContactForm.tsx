"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { TextField, SelectField, TextAreaField } from "@/components/forms/fields";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { SelectOption } from "@/lib/data/types";

const schema = z
  .object({
    gender: z.string().min(1),
    name: z.string().min(1),
    nationality: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().min(1).email(),
    problemType: z.string().min(1),
    vin: z.string().optional(),
    message: z.string().min(1),
  })
  .refine((data) => data.problemType !== "after-sales" || !!data.vin, {
    message: "VIN required",
    path: ["vin"],
  });

type FormValues = z.infer<typeof schema>;

interface ContactFormProps {
  genders: SelectOption[];
  countries: SelectOption[];
  problemTypes: SelectOption[];
}

export function ContactForm({ genders, countries, problemTypes }: ContactFormProps) {
  const t = useTranslations("contact.form");
  const tValidation = useTranslations("form.validation");
  const tCommon = useTranslations("common.buttons");
  const { submit, isSubmitting } = useFormSubmit();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // useWatch (not the form instance's watch()) so this stays compatible
  // with the React Compiler -- watch() returns a function that can't be
  // safely memoized.
  const problemType = useWatch({ control, name: "problemType" });
  const isAfterSales = problemType === "after-sales";

  function onSubmit() {
    void submit(() => reset());
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contact-form mx-auto flex max-w-2xl flex-col gap-5">
      <SelectField
        label={t("gender")}
        options={genders}
        error={errors.gender && tValidation("required")}
        {...register("gender")}
      />
      <TextField label={t("name")} error={errors.name && tValidation("required")} {...register("name")} />
      <SelectField
        label={t("nationality")}
        options={countries}
        error={errors.nationality && tValidation("required")}
        {...register("nationality")}
      />
      <TextField
        label={t("phone")}
        type="tel"
        error={errors.phone && tValidation("required")}
        {...register("phone")}
      />
      <TextField
        label={t("email")}
        type="email"
        error={errors.email && tValidation("invalidEmail")}
        {...register("email")}
      />
      <SelectField
        label={t("problemType")}
        options={problemTypes}
        error={errors.problemType && tValidation("required")}
        {...register("problemType")}
      />

      {isAfterSales && (
        <div>
          <TextField label={t("vin")} error={errors.vin?.message && tValidation("required")} {...register("vin")} />
          <p className="mt-1 text-xs text-charcoal-500">{t("vinHint")}</p>
        </div>
      )}

      <TextAreaField
        label={t("message")}
        rows={6}
        error={errors.message && tValidation("required")}
        {...register("message")}
      />

      <button type="submit" disabled={isSubmitting} className="btn mt-2 self-start">
        {isSubmitting ? tCommon("sending") : tCommon("submit")}
      </button>
    </form>
  );
}
