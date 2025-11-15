export interface IMovie {
  id: number;
  title: string;
  originalTitle?: string;
  language?: string;
  releaseYear?: number;
  releaseDate?: string;
  genres: string[]; // Это массив строк
  plot?: string;
  runtime?: number;
  budget?: string;
  revenue?: string;
  homepage?: string;
  status?: string;
  posterUrl: string; // Нам это точно понадобится
  backdropUrl?: string;
  trailerUrl?: string;
  trailerYoutubeId?: string;
  tmdbRating?: number;
  searchL?: string;
  keywords?: string[];
  countriesOfOrigin?: string[];
  languages?: string[];
  cast?: string[];
  director?: string;
  production?: string;
  awardsSummary?: string;
}