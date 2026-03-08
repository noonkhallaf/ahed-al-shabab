import { candidatesData } from "@/data/candidates";

export interface Candidate {
  id: number;
  name: string;
  age: number;
  specialty: string;
  education: string;
  location: string;
  experience: string[];
  achievements: string[];
  bio: string;
  quote: string;
}

export const candidates: Candidate[] = candidatesData;
