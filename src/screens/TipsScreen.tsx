import React, {useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Screen, useCompactLayout} from '../components/Screen';
import {boatImages} from '../assets';
import {tips} from '../data/catalog';
import type {MainScreenProps} from '../navigation/types';
import {colors} from '../theme';
import type {Tip} from '../types';

export function TipsScreen({navigation}: MainScreenProps): React.JSX.Element {
  const [randomTipId, setRandomTipId] = useState<string | null>(null);
  const compact = useCompactLayout();
  const randomTip = useMemo(
    () => tips.find(item => item.id === randomTipId),
    [randomTipId],
  );

  const pickRandom = () => {
    const next = tips[Math.floor(Math.random() * tips.length)];
    setRandomTipId(next.id);
  };

  return (
    <Screen>
      <View style={[styles.headerRow, compact && styles.headerRowCompact]}>
        <View style={styles.headerCopy}>
          <Text style={[styles.title, compact && styles.titleCompact]}>
            Boat Selection Tips
          </Text>
          <Text style={styles.subtitle}>Expert guidance from seasoned anglers</Text>
        </View>
        <Pressable
          onPress={pickRandom}
          style={({pressed}) => [
            styles.randomButton,
            compact && styles.randomButtonCompact,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.randomButtonIcon}>🔀</Text>
          <Text style={styles.randomButtonText}>Random</Text>
        </Pressable>
      </View>
      {randomTip ? (
        <Pressable
          onPress={() => navigation.navigate('TipDetail', {tipId: randomTip.id})}
          style={({pressed}) => [styles.randomCard, pressed && styles.pressed]}>
          <View style={styles.randomTop}>
            <Text style={styles.randomLabel}>🚤 Random Tip</Text>
            <Pressable onPress={() => setRandomTipId(null)}>
              <Text style={styles.close}>×</Text>
            </Pressable>
          </View>
          <Text style={styles.randomTitle}>{randomTip.title}</Text>
          <Text style={styles.randomText}>{randomTip.excerpt}</Text>
          <Text style={styles.randomLink}>Tap to read full tip →</Text>
        </Pressable>
      ) : null}
      <View style={[styles.captainCard, compact && styles.captainCardCompact]}>
        <Image
          source={boatImages.pathfinder2200Trs}
          style={[styles.captain, compact && styles.captainCompact]}
          resizeMode="cover"
        />
        <View style={styles.captainText}>
          <Text style={styles.captainName}>Captain Rick Hartley</Text>
          <Text style={styles.captainRole}>25-year tournament angler</Text>
          <Text style={styles.captainQuote}>
            “The right boat changes everything. Here’s what I’ve learned.”
          </Text>
        </View>
      </View>
      <View style={styles.list}>
        {tips.map(tip => (
          <TipCard
            key={tip.id}
            tip={tip}
            onPress={() => navigation.navigate('TipDetail', {tipId: tip.id})}
          />
        ))}
      </View>
    </Screen>
  );
}

function TipCard({
  tip,
  onPress,
}: {
  tip: Tip;
  onPress: () => void;
}): React.JSX.Element {
  const compact = useCompactLayout();

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.tipCard,
        compact && styles.tipCardCompact,
        pressed && styles.pressed,
      ]}>
      <View style={[styles.tipIcon, compact && styles.tipIconCompact]}>
        <Text style={[styles.tipEmoji, compact && styles.tipEmojiCompact]}>
          {tip.icon}
        </Text>
      </View>
      <View style={styles.tipCopy}>
        <Text style={[styles.tipTitle, compact && styles.tipTitleCompact]}>
          {tip.title}
        </Text>
        <Text style={styles.tipExcerpt}>{tip.excerpt}</Text>
        <Text style={styles.tipAuthor}>{tip.author}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 4,
    marginBottom: 18,
  },
  headerRowCompact: {
    marginBottom: 14,
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '900',
  },
  titleCompact: {
    fontSize: 23,
    lineHeight: 28,
  },
  subtitle: {
    color: '#6f96c6',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  randomButton: {
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: colors.orange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    shadowColor: colors.orange,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 9,
  },
  randomButtonCompact: {
    minHeight: 42,
    borderRadius: 21,
    paddingHorizontal: 12,
    gap: 6,
  },
  randomButtonIcon: {
    fontSize: 19,
  },
  randomButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  randomCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 24, 0.45)',
    backgroundColor: 'rgba(255, 107, 24, 0.08)',
    padding: 16,
    marginBottom: 14,
  },
  randomTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  randomLabel: {
    color: colors.orange,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  close: {
    color: colors.textMuted,
    fontSize: 20,
    lineHeight: 20,
  },
  randomTitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },
  randomText: {
    color: '#8099ba',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginTop: 8,
  },
  randomLink: {
    color: colors.orange,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
    marginTop: 12,
  },
  captainCard: {
    minHeight: 110,
    borderRadius: 16,
    backgroundColor: '#1c3d78',
    borderWidth: 1,
    borderColor: '#2f5aa4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  captainCardCompact: {
    minHeight: 92,
    marginBottom: 12,
  },
  captain: {
    width: 118,
    height: 96,
    borderRadius: 14,
    marginLeft: 12,
    marginRight: 12,
    backgroundColor: colors.surfaceStrong,
  },
  captainCompact: {
    width: 92,
    height: 72,
    marginLeft: 10,
    marginRight: 10,
  },
  captainText: {
    flex: 1,
  },
  captainName: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },
  captainRole: {
    color: '#75a4df',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  captainQuote: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  list: {
    gap: 12,
  },
  tipCard: {
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  tipCardCompact: {
    padding: 12,
    gap: 11,
  },
  pressed: {
    opacity: 0.82,
  },
  tipIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#203869',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3d63a3',
  },
  tipIconCompact: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },
  tipEmoji: {
    fontSize: 28,
  },
  tipEmojiCompact: {
    fontSize: 23,
  },
  tipCopy: {
    flex: 1,
  },
  tipTitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },
  tipTitleCompact: {
    fontSize: 15,
    lineHeight: 20,
  },
  tipExcerpt: {
    color: '#7690b3',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    marginTop: 4,
  },
  tipAuthor: {
    color: '#4f83ca',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  chevron: {
    color: '#4e93ff',
    fontSize: 34,
    fontWeight: '900',
  },
});
