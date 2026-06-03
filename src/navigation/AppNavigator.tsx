import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SavedItemsProvider} from '../context/SavedItemsContext';
import {ArticleDetailScreen} from '../screens/ArticleDetailScreen';
import {BlogScreen} from '../screens/BlogScreen';
import {BoatDetailScreen} from '../screens/BoatDetailScreen';
import {BoatsScreen} from '../screens/BoatsScreen';
import {LocationDetailScreen} from '../screens/LocationDetailScreen';
import {MapScreen} from '../screens/MapScreen';
import {OnboardingScreen} from '../screens/OnboardingScreen';
import {QuizScreen} from '../screens/QuizScreen';
import {SavedScreen} from '../screens/SavedScreen';
import {SplashScreen} from '../screens/SplashScreen';
import {TipDetailScreen} from '../screens/TipDetailScreen';
import {TipsScreen} from '../screens/TipsScreen';
import {colors} from '../theme';
import {FloatingTabBar} from './FloatingTabBar';
import type {MainTabKey, RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const appTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    border: colors.border,
    primary: colors.primary,
    text: colors.text,
  },
};

function MainTabsScreen({
  navigation,
}: NativeStackScreenProps<
  RootStackParamList,
  'Main'
>): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<MainTabKey>('boats');

  return (
    <View style={styles.root}>
      {activeTab === 'boats' ? <BoatsScreen navigation={navigation} /> : null}
      {activeTab === 'blog' ? <BlogScreen navigation={navigation} /> : null}
      {activeTab === 'tips' ? <TipsScreen navigation={navigation} /> : null}
      {activeTab === 'map' ? <MapScreen navigation={navigation} /> : null}
      {activeTab === 'saved' ? <SavedScreen navigation={navigation} /> : null}
      {activeTab === 'quiz' ? <QuizScreen /> : null}
      <FloatingTabBar activeTab={activeTab} onChange={setActiveTab} />
    </View>
  );
}

export function AppNavigator(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <SavedItemsProvider>
        <NavigationContainer theme={appTheme}>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              contentStyle: {backgroundColor: colors.background},
              animation: 'fade_from_bottom',
            }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Main" component={MainTabsScreen} />
            <Stack.Screen name="BoatDetail" component={BoatDetailScreen} />
            <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
            <Stack.Screen name="TipDetail" component={TipDetailScreen} />
            <Stack.Screen
              name="LocationDetail"
              component={LocationDetailScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SavedItemsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
