export interface HavenRequest {
  message: string;
  location: string;
  language?: string;
  need_document?: boolean;
}

export interface NearbyResource {
  name: string;
  type: string;
  description: string;
  contact: string;
  phone?: string;
  location?: string;
  website?: string;
}

export interface HavenResponse {
  detected_language: string;
  translated_input: string;
  situation_summary: string;
  urgent_needs: string[];
  severity: string;
  generated_document: string | null;
  nearby_resources: NearbyResource[];
  emotional_support: string;
  next_steps: string[];
  final_response: string;
  response_in_user_language: string;
}
