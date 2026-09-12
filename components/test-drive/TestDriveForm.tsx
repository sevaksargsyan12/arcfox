"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { TextField, SelectField } from "@/components/forms/fields";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { SelectOption } from "@/lib/data/types";
import { ModelSummary } from "@/lib/data/models";

const schema = z.object({
  country: z.string().min(1),
  gender: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().min(1).email(),
  modelSlug: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

interface TestDriveFormProps {
  countries: SelectOption[];
  genders: SelectOption[];
  models: ModelSummary[];
}

export function TestDriveForm({ countries, genders, models }: TestDriveFormProps) {
  const t = useTranslations("testDrive");
  const tForm = useTranslations("testDrive.form");
  const tValidation = useTranslations("form.validation");
  const tCommon = useTranslations("common.buttons");
  const { submit, isSubmitting } = useFormSubmit();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { modelSlug: models[0]?.slug } });

  // useWatch (not the form instance's watch()) so this stays compatible
  // with the React Compiler -- watch() returns a function that can't be
  // safely memoized.
  const values = useWatch({ control });
  const selectedModel = models.find((m) => m.slug === values.modelSlug);

  async function goNext() {
    const fieldsByStep: (keyof FormValues)[][] = [
      ["country", "gender", "name", "phone", "email"],
      ["modelSlug"],
    ];
    const valid = await trigger(fieldsByStep[step - 1]);
    if (valid) setStep((s) => s + 1);
  }

  function onSubmit() {
    void submit(() => {
      reset();
      setStep(1);
    });
  }

  const steps = [
    { title: t("step1Title"), desc: t("step1Desc") },
    { title: t("step2Title"), desc: t("step2Desc") },
    { title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl">
      <div className="mb-10 flex justify-between">
        {steps.map((s, i) => (
          <div key={s.title} className={`flex-1 text-center ${i + 1 <= step ? "text-brand-blue" : "text-charcoal-500/50"}`}>
            <p className="text-xs font-semibold uppercase tracking-wide">{s.title}</p>
            <p className="text-sm">{s.desc}</p>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <SelectField
            label={tForm("country")}
            options={countries}
            error={errors.country && tValidation("required")}
            {...register("country")}
          />
          <SelectField
            label={tForm("gender")}
            options={genders}
            error={errors.gender && tValidation("required")}
            {...register("gender")}
          />
          <TextField label={tForm("name")} error={errors.name && tValidation("required")} {...register("name")} />
          <TextField
            label={tForm("phone")}
            type="tel"
            error={errors.phone && tValidation("required")}
            {...register("phone")}
          />
          <TextField
            label={tForm("email")}
            type="email"
            error={errors.email && tValidation("invalidEmail")}
            {...register("email")}
          />
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {models.map((model) => {
            const active = values.modelSlug === model.slug;
            return (
              <label
                key={model.slug}
                className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 ${
                  active ? "border-brand-blue" : "border-transparent"
                }`}
              >
                <input type="radio" value={model.slug} className="sr-only" {...register("modelSlug")} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={model.heroImageUrl} alt={model.name} className="aspect-[4/3] w-full object-cover" />
                {active && (
                  <CheckCircle2 className="absolute right-2 top-2 rounded-full bg-white text-brand-blue" size={22} />
                )}
                <p className="p-2 text-center text-sm font-medium">{model.name}</p>
              </label>
            );
          })}
        </div>
      )}

      {step === 3 && (
        <div className="rounded-2xl bg-form-bg p-6 text-sm">
          <p>
            <strong>{tForm("name")}:</strong> {values.name}
          </p>
          <p>
            <strong>{tForm("email")}:</strong> {values.email}
          </p>
          <p>
            <strong>{tForm("phone")}:</strong> {values.phone}
          </p>
          <p className="mt-2">
            <strong>{t("step2Title")}:</strong> {selectedModel?.name}
          </p>
        </div>
      )}

      <div className="mt-10 flex justify-center gap-4">
        {step > 1 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-outline">
            {t("back")}
          </button>
        )}
        {step < 3 ? (
          <button type="button" onClick={goNext} className="btn">
            {t("next")}
          </button>
        ) : (
          <button type="submit" disabled={isSubmitting} className="btn">
            {isSubmitting ? tCommon("sending") : tCommon("submit")}
          </button>
        )}
      </div>
    </form>
  );
}
