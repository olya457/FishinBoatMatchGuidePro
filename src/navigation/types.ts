import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {QuizAnswer} from '../types';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
  BoatDetail: {boatId: string};
  ArticleDetail: {articleId: string};
  TipDetail: {tipId: string};
  LocationDetail: {locationId: string};
};

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;
export type MainNavigation = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export type MainTabKey =
  | 'boats'
  | 'blog'
  | 'tips'
  | 'map'
  | 'saved'
  | 'quiz';

export type MainScreenProps = {
  navigation: MainNavigation;
};

export type QuizResultPayload = {
  score: number;
  answers: QuizAnswer[];
};
