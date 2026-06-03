import type {ImageSourcePropType} from 'react-native';

export type Category = 'freshwater' | 'coastal' | 'offshore';

export type Spec = {
  label: string;
  value: string;
};

export type Boat = {
  id: string;
  name: string;
  maker: string;
  category: Category;
  family: string;
  image: ImageSourcePropType;
  summary: string;
  description: string;
  bestFor: string;
  specs: Spec[];
};

export type FishingLocation = {
  id: string;
  name: string;
  region: string;
  category: Category;
  image: ImageSourcePropType;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  description: string;
  targetSpecies: string;
  recommendedBoat: string;
  bestSeason: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
};

export type Article = {
  id: string;
  title: string;
  category: Category;
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  hero: ImageSourcePropType;
  body: string[];
};

export type Tip = {
  id: string;
  title: string;
  icon: string;
  author: string;
  role: string;
  excerpt: string;
  body: string[];
};

export type QuizQuestion = {
  id: string;
  image: ImageSourcePropType;
  question: string;
  options: string[];
  correctAnswer: string;
};

export type QuizAnswer = {
  questionId: string;
  title: string;
  chosenAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};
