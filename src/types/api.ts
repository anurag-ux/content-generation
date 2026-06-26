export type ContentType = 'Article' | 'Guide' | 'Opinion' | 'Trend Analysis';

export type ToneType = 'Professional' | 'Casual' | 'Inspirational';
export type ImageStyleType = 'Photographic' | 'Minimalist' | '3D Render';

export interface GenerateRequest {
  topic: string;
  contentType: ContentType;
  tone: ToneType;
  imageStyle: ImageStyleType;
}

export interface GenerateResponse {
  text: string;
  imageUrl?: string;
}

export interface SavedArticle {
  id: string;
  topic: string;
  contentType: ContentType;
  tone: ToneType;
  imageStyle: ImageStyleType;
  text: string;
  imageUrl?: string;
  savedAt: string;
  generationTime?: number;
}
