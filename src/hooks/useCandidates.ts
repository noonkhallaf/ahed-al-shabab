import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  image_url: string | null;
  promotion_priority: number;
}

export function useCandidates() {
  return useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("promotion_priority", { ascending: false })
        .order("id");
      if (error) throw error;
      return data as Candidate[];
    },
  });
}

export function useCandidate(id: number) {
  return useQuery({
    queryKey: ["candidates", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Candidate;
    },
    enabled: !!id,
  });
}
