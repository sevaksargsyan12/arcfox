import { PageBuilderSection } from "@/lib/data/models";

/** Narrows the PageBuilderSection union down to one variant by its `type` tag. */
export type SectionOf<T extends PageBuilderSection["type"]> = Extract<PageBuilderSection, { type: T }>;
