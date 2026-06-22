import AsyncStorage from '@react-native-async-storage/async-storage';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Screen} from '../components/Screen';
import {images} from '../assets';
import {STORAGE_KEYS} from '../storage/keys';
import {colors} from '../theme';
import type {RootStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({navigation}: Props): React.JSX.Element {
  useEffect(() => {
    const timer = setTimeout(() => {
      AsyncStorage.getItem(STORAGE_KEYS.onboardingComplete)
        .then(value => {
          navigation.replace(value === 'true' ? 'Main' : 'Onboarding');
        })
        .catch(() => {
          navigation.replace('Onboarding');
        });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Screen scroll={false} withTabs={false} contentStyle={styles.content}>
      <View style={styles.sparkLarge} />
      <View style={styles.sparkSmall} />
      <View style={styles.center}>
        <Image source={images.splashHero} style={styles.hero} />
        <Text style={styles.title}>Fishing Boat Handbook</Text>
        <Text style={styles.subtitle}>FIND YOUR PERFECT FISHING BOAT</Text>
      </View>
      <View style={styles.dots}>
        <View style={styles.dotActive} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <Text style={styles.version}>Version 2.4.1</Text>
      <View style={styles.wave} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  center: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  hero: {
    width: 315,
    maxWidth: '88%',
    aspectRatio: 1,
    borderRadius: 24,
    marginBottom: 28,
  },
  title: {
    color: colors.text,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#9ec3ff',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(77, 137, 220, 0.45)',
  },
  dotActive: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4d9bff',
  },
  version: {
    color: '#2d64b9',
    fontSize: 11,
    marginBottom: 22,
  },
  wave: {
    position: 'absolute',
    left: -40,
    right: -40,
    bottom: -46,
    height: 118,
    borderTopLeftRadius: 220,
    borderTopRightRadius: 220,
    backgroundColor: '#132f67',
    opacity: 0.72,
  },
  sparkLarge: {
    position: 'absolute',
    right: 30,
    top: 118,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4587ce',
    opacity: 0.8,
  },
  sparkSmall: {
    position: 'absolute',
    left: 40,
    top: 205,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.orange,
    opacity: 0.8,
  },
});
