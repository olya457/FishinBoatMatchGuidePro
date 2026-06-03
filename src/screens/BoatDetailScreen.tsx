import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Image, Share, StyleSheet, Text, View} from 'react-native';
import {IconButton, Button, SectionTitle} from '../components/UI';
import {Screen, useCompactLayout} from '../components/Screen';
import {useSavedItems} from '../context/SavedItemsContext';
import {findBoat} from '../data/catalog';
import type {RootStackParamList} from '../navigation/types';
import {categoryTheme, colors} from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'BoatDetail'>;

export function BoatDetailScreen({navigation, route}: Props): React.JSX.Element {
  const boat = findBoat(route.params.boatId);
  const savedItems = useSavedItems();
  const compact = useCompactLayout();

  if (!boat) {
    return (
      <Screen withTabs={false} topOffset={10}>
        <IconButton icon="‹" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Boat not found</Text>
      </Screen>
    );
  }

  const category = categoryTheme[boat.category];
  const saved = savedItems.isBoatSaved(boat.id);

  const shareBoat = () => {
    Share.share({
      title: boat.name,
      message: `${boat.name}\n\n${boat.summary}\n\nBest for: ${boat.bestFor}`,
    }).catch(() => undefined);
  };

  return (
    <Screen withTabs={false} topOffset={10}>
      <View style={[styles.topActions, compact && styles.topActionsCompact]}>
        <IconButton icon="‹" onPress={() => navigation.goBack()} />
        <View style={[styles.actionGroup, compact && styles.actionGroupCompact]}>
          <IconButton icon="↗" onPress={shareBoat} />
          <IconButton
            icon={saved ? '🔖' : '♡'}
            active={saved}
            onPress={() => savedItems.toggleBoat(boat.id)}
          />
        </View>
      </View>
      <Image source={boat.image} style={[styles.hero, compact && styles.heroCompact]} />
      <View style={[styles.badge, {backgroundColor: category.surface}]}>
        <Text style={[styles.badgeText, {color: category.color}]}>
          {boat.family}
        </Text>
      </View>
      <Text style={styles.maker}>{boat.maker}</Text>
      <Text style={[styles.title, compact && styles.titleCompact]}>{boat.name}</Text>
      <Button
        label={saved ? 'Saved Boat' : 'Save Boat'}
        icon={saved ? '🔖' : '♡'}
        onPress={() => savedItems.toggleBoat(boat.id)}
        style={[styles.saveButton, compact && styles.saveButtonCompact]}
      />
      <View style={[styles.divider, compact && styles.dividerCompact]} />
      <SectionTitle label="Best Fishing Use" />
      <View style={[styles.bestUse, compact && styles.bestUseCompact]}>
        <View style={[styles.bestUseBar, {backgroundColor: category.color}]} />
        <Text style={[styles.bestUseText, compact && styles.bestUseTextCompact]}>
          {boat.bestFor}
        </Text>
      </View>
      <View style={[styles.divider, compact && styles.dividerCompact]} />
      <SectionTitle label="Specifications" />
      <View style={styles.specGrid}>
        {boat.specs.map(spec => (
          <View key={spec.label} style={styles.specCard}>
            <Text style={styles.specLabel}>{spec.label}</Text>
            <Text style={styles.specValue}>{spec.value}</Text>
          </View>
        ))}
      </View>
      <View style={[styles.divider, compact && styles.dividerCompact]} />
      <SectionTitle label="About This Boat" />
      <Text style={[styles.description, compact && styles.descriptionCompact]}>
        {boat.description}
      </Text>
      <Button
        label="Share This Boat"
        icon="↗"
        tone="ghost"
        onPress={shareBoat}
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
    marginBottom: 10,
  },
  topActionsCompact: {
    marginBottom: 8,
  },
  actionGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  actionGroupCompact: {
    gap: 8,
  },
  hero: {
    width: '100%',
    height: 270,
    borderRadius: 18,
    backgroundColor: '#112448',
    marginBottom: 16,
  },
  heroCompact: {
    height: 205,
    borderRadius: 16,
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    minHeight: 28,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  maker: {
    color: '#73a6e8',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
  },
  titleCompact: {
    fontSize: 23,
    lineHeight: 28,
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonCompact: {
    marginTop: 14,
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSoft,
    marginVertical: 18,
  },
  dividerCompact: {
    marginVertical: 14,
  },
  bestUse: {
    flexDirection: 'row',
    backgroundColor: 'rgba(19, 210, 161, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(19, 210, 161, 0.24)',
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  bestUseCompact: {
    padding: 13,
    gap: 11,
  },
  bestUseBar: {
    width: 4,
    borderRadius: 2,
  },
  bestUseText: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '700',
  },
  bestUseTextCompact: {
    fontSize: 15,
    lineHeight: 21,
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  specCard: {
    width: '48.5%',
    minHeight: 72,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  specLabel: {
    color: '#5891dd',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  specValue: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  description: {
    color: colors.textSoft,
    fontSize: 16,
    lineHeight: 25,
    fontWeight: '600',
  },
  descriptionCompact: {
    fontSize: 15,
    lineHeight: 23,
  },
  shareButton: {
    marginTop: 22,
  },
});
