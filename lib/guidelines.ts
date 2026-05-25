/**
 * Curated catalog of IDSA practice guidelines. The slug is the local URL key;
 * `source` is the official IDSA landing page that we proxy live at request time.
 *
 * Slugs verified against https://www.idsociety.org/practice-guideline/all-practice-guidelines/.
 * IDSA reorganizes the listing periodically — the /api/health endpoint pings
 * each URL so a stale entry surfaces on the home page without anyone needing
 * to click through.
 */
export type Category =
  | "Respiratory"
  | "Urinary"
  | "Skin & Soft Tissue"
  | "GI"
  | "Bone & Joint"
  | "CNS"
  | "Bloodstream / Endocarditis"
  | "Fungal"
  | "Tick-borne"
  | "Oncology / ID"
  | "Stewardship & Dosing";

export interface Guideline {
  slug: string;
  title: string;
  shortLabel: string;
  category: Category;
  source: string;
  notes?: string;
}

export const GUIDELINES: Guideline[] = [
  {
    slug: "cap-adults",
    title: "Community-Acquired Pneumonia (Adults)",
    shortLabel: "CAP",
    category: "Respiratory",
    source: "https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap-in-adults/",
    notes: "ATS/IDSA 2019",
  },
  {
    slug: "cap-peds",
    title: "Community-Acquired Pneumonia (Infants & Children)",
    shortLabel: "CAP — Peds",
    category: "Respiratory",
    source: "https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap-in-infants-and-children/",
  },
  {
    slug: "hap-vap",
    title: "Hospital-Acquired & Ventilator-Associated Pneumonia",
    shortLabel: "HAP / VAP",
    category: "Respiratory",
    source: "https://www.idsociety.org/practice-guideline/hap_vap/",
    notes: "IDSA/ATS 2016",
  },
  {
    slug: "sinusitis",
    title: "Acute Bacterial Rhinosinusitis",
    shortLabel: "Sinusitis",
    category: "Respiratory",
    source: "https://www.idsociety.org/practice-guideline/rhinosinusitis/",
  },
  {
    slug: "pharyngitis",
    title: "Group A Streptococcal Pharyngitis",
    shortLabel: "Strep throat",
    category: "Respiratory",
    source: "https://www.idsociety.org/practice-guideline/streptococcal-pharyngitis/",
  },
  {
    slug: "uti-uncomplicated",
    title: "Uncomplicated Cystitis & Pyelonephritis (Women)",
    shortLabel: "Uncomplicated UTI",
    category: "Urinary",
    source: "https://www.idsociety.org/practice-guideline/uncomplicated-cystitis-and-pyelonephritis-uti/",
  },
  {
    slug: "uti-complicated",
    title: "Complicated Urinary Tract Infections",
    shortLabel: "Complicated UTI",
    category: "Urinary",
    source: "https://www.idsociety.org/practice-guideline/complicated-urinary-tract-infections/",
  },
  {
    slug: "asb",
    title: "Asymptomatic Bacteriuria",
    shortLabel: "ASB",
    category: "Urinary",
    source: "https://www.idsociety.org/practice-guideline/asymptomatic-bacteriuria/",
    notes: "IDSA 2019",
  },
  {
    slug: "cauti",
    title: "Catheter-Associated UTI",
    shortLabel: "CAUTI",
    category: "Urinary",
    source: "https://www.idsociety.org/practice-guideline/catheter-associated-urinary-tract-infection/",
  },
  {
    slug: "ssti",
    title: "Skin and Soft Tissue Infections",
    shortLabel: "SSTI",
    category: "Skin & Soft Tissue",
    source: "https://www.idsociety.org/practice-guideline/skin-and-soft-tissue-infections/",
    notes: "IDSA 2014",
  },
  {
    slug: "diabetic-foot",
    title: "Diabetic Foot Infections",
    shortLabel: "Diabetic foot",
    category: "Skin & Soft Tissue",
    source: "https://www.idsociety.org/practice-guideline/diabetic-foot-infections/",
  },
  {
    slug: "mrsa",
    title: "Methicillin-Resistant Staphylococcus aureus (MRSA)",
    shortLabel: "MRSA",
    category: "Skin & Soft Tissue",
    source: "https://www.idsociety.org/practice-guideline/mrsa/",
  },
  {
    slug: "cdiff",
    title: "Clostridioides difficile (2021 Focused Update)",
    shortLabel: "C. difficile",
    category: "GI",
    source: "https://www.idsociety.org/practice-guideline/clostridioides-difficile-2021-focused-update/",
    notes: "IDSA/SHEA 2021",
  },
  {
    slug: "iai",
    title: "Complicated Intra-abdominal Infections",
    shortLabel: "Intra-abdominal",
    category: "GI",
    source: "https://www.idsociety.org/practice-guideline/intra-abdominal-infections/",
  },
  {
    slug: "infectious-diarrhea",
    title: "Infectious Diarrhea",
    shortLabel: "Infectious diarrhea",
    category: "GI",
    source: "https://www.idsociety.org/practice-guideline/infectious-diarrhea/",
  },
  {
    slug: "vertebral-osteo",
    title: "Native Vertebral Osteomyelitis",
    shortLabel: "Vertebral osteo",
    category: "Bone & Joint",
    source: "https://www.idsociety.org/practice-guideline/vertebral-osteomyelitis/",
  },
  {
    slug: "pji",
    title: "Prosthetic Joint Infection",
    shortLabel: "PJI",
    category: "Bone & Joint",
    source: "https://www.idsociety.org/practice-guideline/prosthetic-joint-infection/",
  },
  {
    slug: "meningitis",
    title: "Bacterial Meningitis",
    shortLabel: "Meningitis",
    category: "CNS",
    source: "https://www.idsociety.org/practice-guideline/bacterial-meningitis/",
  },
  {
    slug: "encephalitis",
    title: "Encephalitis",
    shortLabel: "Encephalitis",
    category: "CNS",
    source: "https://www.idsociety.org/practice-guideline/encephalitis/",
  },
  {
    slug: "endocarditis",
    title: "Infective Endocarditis — Management",
    shortLabel: "Endocarditis",
    category: "Bloodstream / Endocarditis",
    source: "https://www.idsociety.org/practice-guideline/endocarditis-management/",
  },
  {
    slug: "saureus-bacteremia",
    title: "Staphylococcus aureus Bacteremia",
    shortLabel: "SAB",
    category: "Bloodstream / Endocarditis",
    source: "https://www.idsociety.org/practice-guideline/staphylococcus-aureus-bacteremia/",
  },
  {
    slug: "crbsi",
    title: "Intravascular Catheter-Related Infection",
    shortLabel: "CRBSI",
    category: "Bloodstream / Endocarditis",
    source: "https://www.idsociety.org/practice-guideline/iv-catheter/",
  },
  {
    slug: "candidiasis",
    title: "Candidiasis",
    shortLabel: "Candidiasis",
    category: "Fungal",
    source: "https://www.idsociety.org/practice-guideline/candidiasis/",
  },
  {
    slug: "aspergillosis",
    title: "Aspergillosis",
    shortLabel: "Aspergillosis",
    category: "Fungal",
    source: "https://www.idsociety.org/practice-guideline/aspergillosis/",
  },
  {
    slug: "histoplasmosis",
    title: "Histoplasmosis (2025)",
    shortLabel: "Histoplasmosis",
    category: "Fungal",
    source: "https://www.idsociety.org/practice-guideline/histoplasmosis-2025/",
  },
  {
    slug: "coccidioidomycosis",
    title: "Coccidioidomycosis",
    shortLabel: "Cocci",
    category: "Fungal",
    source: "https://www.idsociety.org/practice-guideline/coccidioidomycosis/",
  },
  {
    slug: "lyme",
    title: "Lyme Disease",
    shortLabel: "Lyme",
    category: "Tick-borne",
    source: "https://www.idsociety.org/practice-guideline/lyme-disease/",
    notes: "IDSA/AAN/ACR 2020",
  },
  {
    slug: "babesiosis",
    title: "Babesiosis",
    shortLabel: "Babesiosis",
    category: "Tick-borne",
    source: "https://www.idsociety.org/practice-guideline/babesiosis/",
  },
  {
    slug: "febrile-neutropenia",
    title: "Fever & Neutropenia in Adults with Cancer",
    shortLabel: "Febrile neutropenia",
    category: "Oncology / ID",
    source: "https://www.idsociety.org/practice-guideline/fever-and-neutropenia-in-adults-with-cancer/",
  },
  {
    slug: "amr-guidance",
    title: "Antimicrobial-Resistant Gram-Negative Infections (AMR Guidance)",
    shortLabel: "AMR / MDR-GNR",
    category: "Stewardship & Dosing",
    source: "https://www.idsociety.org/practice-guideline/amr-guidance/",
  },
  {
    slug: "vancomycin",
    title: "Vancomycin Therapeutic Drug Monitoring",
    shortLabel: "Vancomycin TDM",
    category: "Stewardship & Dosing",
    source: "https://www.idsociety.org/practice-guideline/vancomycin/",
  },
  {
    slug: "stewardship",
    title: "Antimicrobial Stewardship",
    shortLabel: "Stewardship",
    category: "Stewardship & Dosing",
    source: "https://www.idsociety.org/practice-guideline/antimicrobial-stewardship/",
  },
];

export const CATEGORIES: Category[] = [
  "Respiratory",
  "Urinary",
  "Skin & Soft Tissue",
  "GI",
  "Bone & Joint",
  "CNS",
  "Bloodstream / Endocarditis",
  "Fungal",
  "Tick-borne",
  "Oncology / ID",
  "Stewardship & Dosing",
];

export function getGuideline(slug: string): Guideline | undefined {
  return GUIDELINES.find((g) => g.slug === slug);
}
