import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Share, StyleSheet, Text, View} from 'react-native';
import {IconButton, Button} from '../components/UI';
import {Screen, useCompactLayout} from '../components/Screen';
import {findTip} from '../data/catalog';
import type {RootStackParamList} from '../navigation/types';
import {colors} from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TipDetail'>;

export function TipDetailScreen({navigation, route}: Props): React.JSX.Element {
  const tip = findTip(route.params.tipId);
  const compact = useCompactLayout();

  if (!tip) {
    return (
      <Screen withTabs={false} topOffset={10}>
        <IconButton icon="‹" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Tip not found</Text>
      </Screen>
    );
  }

  const shareTip = () => {
    Share.share({
      title: tip.title,
      message: `${tip.title}\n\n${tip.body.join('\n\n')}`,
    }).catch(() => undefined);
  };

  return (
    <Screen withTabs={false} topOffset={10}>
      <View style={[styles.topActions, compact && styles.topActionsCompact]}>
        <IconButton icon="‹" onPress={() => navigation.goBack()} />
        <IconButton icon="↗" onPress={shareTip} />
      </View>
      <View style={[styles.heroRow, compact && styles.heroRowCompact]}>
        <View style={[styles.heroIcon, compact && styles.heroIconCompact]}>
          <Text style={[styles.heroEmoji, compact && styles.heroEmojiCompact]}>
            {tip.icon}
          </Text>
        </View>
        <View style={styles.heroText}>
          <Text style={styles.eyebrow}>Expert Tip</Text>
          <Text style={[styles.title, compact && styles.titleCompact]}>
            {tip.title}
          </Text>
        </View>
      </View>
      <View style={[styles.authorCard, compact && styles.authorCardCompact]}>
        <Text style={styles.author}>{tip.author}</Text>
        <Text style={styles.role}>{tip.role}</Text>
      </View>
      <View style={[styles.divider, compact && styles.dividerCompact]} />
      {tip.body.map(paragraph => (
        <Text
          key={paragraph}
          style={[styles.paragraph, compact && styles.paragraphCompact]}>
          {paragraph}
        </Text>
      ))}
      <Button
        label="Share This Tip"
        icon="↗"
        tone="ghost"
        onPress={shareTip}
        style={styles.shareButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  topActionsCompact: {
    marginBottom: 18,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroRowCompact: {
    gap: 11,
  },
  heroIcon: {
    width: 62,
    height: 62,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroIconCompact: {
    width: 52,
    height: 52,
    borderRadius: 14,
  },
  heroEmoji: {
    fontSize: 31,
  },
  heroEmojiCompact: {
    fontSize: 26,
  },
  heroText: {
    flex: 1,
  },
  eyebrow: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: colors.text,
    fontSize: 23,
    lineHeight: 29,
    fontWeight: '900',
  },
  titleCompact: {
    fontSize: 21,
    lineHeight: 26,
  },
  authorCard: {
    marginTop: 22,
    marginLeft: 76,
  },
  authorCardCompact: {
    marginTop: 16,
    marginLeft: 63,
  },
  author: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  role: {
    color: '#4f83ca',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSoft,
    marginVertical: 26,
  },
  dividerCompact: {
    marginVertical: 20,
  },
  paragraph: {
    color: colors.textSoft,
    fontSize: 16,
    lineHeight: 27,
    fontWeight: '600',
    marginBottom: 18,
  },
  paragraphCompact: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 15,
  },
  shareButton: {
    marginTop: 6,
  },
});
