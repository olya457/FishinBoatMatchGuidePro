import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Image, Share, StyleSheet, Text, View} from 'react-native';
import {Button, IconButton} from '../components/UI';
import {Screen, useCompactLayout} from '../components/Screen';
import {useSavedItems} from '../context/SavedItemsContext';
import {findLocation} from '../data/catalog';
import type {RootStackParamList} from '../navigation/types';
import {categoryTheme, colors} from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationDetail'>;

export function LocationDetailScreen({
  navigation,
  route,
}: Props): React.JSX.Element {
  const location = findLocation(route.params.locationId);
  const savedItems = useSavedItems();
  const compact = useCompactLayout();

  if (!location) {
    return (
      <Screen withTabs={false} topOffset={10}>
        <IconButton icon="‹" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Location not found</Text>
      </Screen>
    );
  }

  const category = categoryTheme[location.category];
  const saved = savedItems.isLocationSaved(location.id);

  const shareLocation = () => {
    Share.share({
      title: location.name,
      message: `${location.name}\n${location.region}\n${location.coordinates.latitude}, ${location.coordinates.longitude}\n\n${location.description}`,
    }).catch(() => undefined);
  };

  return (
    <Screen withTabs={false} horizontalPadding={0} topOffset={10}>
      <View style={[styles.heroWrap, compact && styles.heroWrapCompact]}>
        <Image source={location.image} style={styles.hero} />
        <View style={styles.heroShade} />
        <View style={[styles.topActions, compact && styles.topActionsCompact]}>
          <IconButton icon="‹" onPress={() => navigation.goBack()} />
          <View style={[styles.actionGroup, compact && styles.actionGroupCompact]}>
            <IconButton icon="↗" onPress={shareLocation} />
            <IconButton
              icon={saved ? '🔖' : '♡'}
              active={saved}
              onPress={() => savedItems.toggleLocation(location.id)}
            />
          </View>
        </View>
        <View style={[styles.heroCopy, compact && styles.heroCopyCompact]}>
          <View style={styles.tagRow}>
            <View style={[styles.badge, {backgroundColor: category.surface}]}>
              <Text style={[styles.badgeText, {color: category.color}]}>
                {category.label}
              </Text>
            </View>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{location.difficulty}</Text>
            </View>
          </View>
          <Text style={[styles.title, compact && styles.titleCompact]}>
            {location.name}
          </Text>
          <Text style={styles.region}>{location.region}</Text>
        </View>
      </View>
      <View style={[styles.body, compact && styles.bodyCompact]}>
        <View style={[styles.coordinateRow, compact && styles.coordinateRowCompact]}>
          <View>
            <Text style={styles.smallLabel}>Coordinates</Text>
            <Text style={styles.coordText}>
              {location.coordinates.latitude.toFixed(4)}° N,{' '}
              {Math.abs(location.coordinates.longitude).toFixed(4)}° W
            </Text>
          </View>
          <Button
            label={saved ? 'Saved' : 'Save'}
            icon={saved ? '🔖' : '♡'}
            onPress={() => savedItems.toggleLocation(location.id)}
            style={[styles.saveButton, compact && styles.saveButtonCompact]}
          />
        </View>
        <View style={[styles.divider, compact && styles.dividerCompact]} />
        <Text style={[styles.description, compact && styles.descriptionCompact]}>
          {location.description}
        </Text>
        <View style={[styles.detailCards, compact && styles.detailCardsCompact]}>
          <InfoCard icon="🐟" label="Target Species" value={location.targetSpecies} />
          <InfoCard icon="🗓️" label="Best Season" value={location.bestSeason} />
          <InfoCard
            icon="⛵"
            label="Recommended Boat"
            value={location.recommendedBoat}
          />
        </View>
      </View>
    </Screen>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoIcon}>
        <Text style={styles.infoEmoji}>{icon}</Text>
      </View>
      <View style={styles.infoCopy}>
        <Text style={styles.smallLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    height: 330,
    backgroundColor: colors.surfaceStrong,
    overflow: 'hidden',
  },
  heroWrapCompact: {
    height: 255,
  },
  hero: {
    width: '100%',
    height: '100%',
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 11, 24, 0.5)',
  },
  topActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topActionsCompact: {
    left: 12,
    right: 12,
    top: 16,
  },
  actionGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  actionGroupCompact: {
    gap: 8,
  },
  heroCopy: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 26,
  },
  heroCopyCompact: {
    left: 12,
    right: 12,
    bottom: 18,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    minHeight: 26,
    borderRadius: 13,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'lowercase',
  },
  difficultyBadge: {
    minHeight: 26,
    borderRadius: 13,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(246, 184, 47, 0.16)',
  },
  difficultyText: {
    color: colors.yellow,
    fontSize: 11,
    fontWeight: '900',
  },
  title: {
    color: colors.text,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '900',
  },
  titleCompact: {
    fontSize: 24,
    lineHeight: 29,
  },
  region: {
    color: '#79a6dc',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 22,
  },
  bodyCompact: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  coordinateRowCompact: {
    alignItems: 'stretch',
    flexDirection: 'column',
    gap: 10,
  },
  smallLabel: {
    color: '#4f83ca',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
  },
  coordText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
    marginTop: 5,
  },
  saveButton: {
    minHeight: 42,
    minWidth: 112,
    borderRadius: 14,
  },
  saveButtonCompact: {
    alignSelf: 'stretch',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSoft,
    marginVertical: 20,
  },
  dividerCompact: {
    marginVertical: 15,
  },
  description: {
    color: colors.textSoft,
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '600',
  },
  descriptionCompact: {
    fontSize: 15,
    lineHeight: 23,
  },
  detailCards: {
    gap: 12,
    marginTop: 24,
  },
  detailCardsCompact: {
    gap: 10,
    marginTop: 18,
  },
  infoCard: {
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoEmoji: {
    fontSize: 21,
  },
  infoCopy: {
    flex: 1,
  },
  infoValue: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    marginTop: 3,
  },
});
