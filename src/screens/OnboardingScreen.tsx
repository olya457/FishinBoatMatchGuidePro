import AsyncStorage from '@react-native-async-storage/async-storage';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Button} from '../components/UI';
import {Screen} from '../components/Screen';
import {images} from '../assets';
import {STORAGE_KEYS} from '../storage/keys';
import {colors} from '../theme';
import type {RootStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const slides = [
  {
    title: 'Welcome, Fellow Angler',
    intro:
      'I’ve spent 30 years on the water. Let me help you find your perfect fishing boat.',
    body:
      'Whether you’re chasing bass on a quiet farm pond or hunting blue marlin 60 miles offshore, the right boat makes all the difference. Fishin Boat brings you everything you need to make that decision with confidence.',
    image: images.anglerWelcome,
    accent: colors.primary,
  },
  {
    title: 'Explore Every Boat Type',
    intro: 'From humble jon boats to trophy-class sportfishing yachts.',
    body:
      'Browse freshwater, coastal, and offshore fishing vessels. Each boat includes practical specifications, fishing strengths, and the details that matter before you buy.',
    image: images.anglerWave,
    accent: colors.orange,
  },
  {
    title: 'Compare Boat Types',
    intro: 'Know the difference before you sign the check.',
    body:
      'Bass boats, bay boats, center consoles, walkarounds, and offshore yachts all serve different waters. Learn what each one does best and where it becomes a compromise.',
    image: images.anglerBoat,
    accent: colors.primary,
  },
  {
    title: 'Find Prime Fishing Spots',
    intro: 'I’ll show you where the fish are and what boat you need to get there.',
    body:
      'Discover top fishing destinations across freshwater lakes, coastal bays, and offshore grounds. Each location includes coordinates, recommended boats, and practical notes.',
    image: images.anglerFish,
    accent: colors.orange,
  },
  {
    title: 'Test Your Knowledge',
    intro: 'How well do you really know your boats?',
    body:
      'Take the timed boat identification quiz, review the answers, and sharpen the same skill experienced anglers use when evaluating boats in person.',
    image: images.anglerInvite,
    accent: colors.primary,
  },
];

export function OnboardingScreen({navigation}: Props): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const {height} = useWindowDimensions();
  const slide = slides[index];
  const compact = height < 740;
  const imageSize = compact ? 210 : 270;
  const done = index === slides.length - 1;

  const dots = useMemo(
    () =>
      slides.map((item, dotIndex) => (
        <View
          key={item.title}
          style={[
            styles.dot,
            dotIndex === index && styles.dotActive,
            dotIndex === index && {backgroundColor: slide.accent},
          ]}
        />
      )),
    [index, slide.accent],
  );

  const finish = () => {
    AsyncStorage.setItem(STORAGE_KEYS.onboardingComplete, 'true')
      .catch(() => undefined)
      .finally(() => navigation.replace('Main'));
  };

  const next = () => {
    if (done) {
      finish();
      return;
    }

    setIndex(value => value + 1);
  };

  return (
    <Screen scroll={false} withTabs={false} contentStyle={styles.content}>
      <Pressable onPress={finish} style={styles.skip}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>
      <View style={[styles.portraitWrap, {width: imageSize, height: imageSize}]}>
        <View style={styles.portraitCircle} />
        <Image source={slide.image} style={styles.portrait} resizeMode="contain" />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, compact && styles.titleCompact]}>
          {slide.title}
        </Text>
        <Text style={[styles.intro, {color: slide.accent}]}>{slide.intro}</Text>
        <Text style={styles.body}>{slide.body}</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.dots}>{dots}</View>
        <Button
          label={done ? 'Get Started' : 'Next'}
          icon="›"
          onPress={next}
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
  },
  skip: {
    alignSelf: 'flex-end',
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginBottom: 12,
  },
  skipText: {
    color: '#4e95ff',
    fontSize: 14,
    fontWeight: '800',
  },
  portraitWrap: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 28,
  },
  portraitCircle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: '#1d3f78',
    borderWidth: 2,
    borderColor: '#163a78',
  },
  portrait: {
    width: '84%',
    height: '108%',
  },
  copy: {
    flex: 1,
    justifyContent: 'center',
    gap: 22,
  },
  title: {
    color: colors.text,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '900',
  },
  titleCompact: {
    fontSize: 24,
    lineHeight: 30,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '800',
  },
  body: {
    color: colors.textSoft,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34435e',
  },
  dotActive: {
    width: 24,
  },
  button: {
    minWidth: 118,
    minHeight: 52,
  },
});
