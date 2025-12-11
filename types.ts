export interface Landmark {
  name: string;
  description: string;
}

export interface Food {
  name: string;
  description: string;
}

export interface CountryData {
  name: string;
  capital: string;
  languages: string[];
  population: string;
  currency: string;
  funFact: string;
  landmarks: Landmark[];
  foods: Food[];
  emoji: string;
}

export interface GeoJsonProperties {
  name: string;
  'hc-key'?: string;
  'hc-a2'?: string; // Highcharts alpha-2 code
  [key: string]: any;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}