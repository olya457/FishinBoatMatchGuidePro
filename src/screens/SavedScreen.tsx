import React, {useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Screen, useCompactLayout} from '../components/Screen';
import {EmptyState} from '../components/UI';
import {useSavedItems} from '../context/SavedItemsContext';
import {boats, locations} from '../data/catalog';
import type {MainScreenProps} from '../navigation/types';
import {categoryTheme, colors} from '../theme';
import type {Boat, FishingLocation} from '../types';

export function SavedScreen({navigation}: MainScreenProps): React.JSX.Element {
  const savedItems = useSavedItems();
  const [tab, setTab] = useState<'boats' | 'locations'>('boats');
  const compact = useCompactLayout();

  const savedBoats = useMemo(
    () => savedItems.saved.boats.map(id => boats.find(item => item.id === id)).filter(Boolean) as Boat[],
    [savedItems.saved.boats],
  );
  const savedLocations = useMemo(
    () =>
      savedItems.saved.locations
        .map(id => locations.find(item => item.id === id))
        .filter(Boolean) as FishingLocation[],
    [savedItems.saved.locations],
  );

  return (
    <Screen scroll={tab === 'boats' ? savedBoats.length > 0 : savedLocations.length > 0}>
      <Text style={[styles.title, compact && styles.titleCompact]}>Saved</Text>
      <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
        {savedBoats.length} boats · {savedLocations.length} locations
      </Text>
      <View style={[styles.segmented, compact && styles.segmentedCompact]}>
        <Pressable
          onPress={() => setTab('boats')}
          style={[styles.segment, tab === 'boats' && styles.segmentActive]}>
          <Text style={[styles.segmentText, tab === 'boats' && styles.segmentTextActive]}>
            ⛵ Saved Boats {savedBoats.length ? ` ${savedBoats.length}` : ''}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab('locations')}
          style={[styles.segment, tab === 'locations' && styles.segmentActive]}>
          <Text
            style={[
              styles.segmentText,
              tab === 'locations' && styles.segmentTextActive,
            ]}>
            📍 Saved Locations {savedLocations.length ? ` ${savedLocations.length}` : ''}
          </Text>
        </Pressable>
      </View>
      {tab === 'boats' ? (
        savedBoats.length ? (
          <View style={styles.list}>
            {savedBoats.map(boat => (
              <SavedBoatCard
                key={boat.id}
                boat={boat}
                onPress={() => navigation.navigate('BoatDetail', {boatId: boat.id})}
                onRemove={() => savedItems.removeBoat(boat.id)}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            icon="⛵"
            title="No saved boats yet"
            text="Explore boats and tap Save to add them here"
          />
        )
      ) : savedLocations.length ? (
        <View style={styles.list}>
          {savedLocations.map(location => (
            <SavedLocationCard
              key={location.id}
              location={location}
              onPress={() =>
                navigation.navigate('LocationDetail', {locationId: location.id})
              }
              onRemove={() => savedItems.removeLocation(location.id)}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          icon="📍"
          title="No saved locations yet"
          text="Explore the map and save your favorite fishing spots"
        />
      )}
    </Screen>
  );
}

function SavedBoatCard({
  boat,
  onPress,
  onRemove,
}: {
  boat: Boat;
  onPress: () => void;
  onRemove: () => void;
}): React.JSX.Element {
  const category = categoryTheme[boat.category];
  const compact = useCompactLayout();

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.savedCard,
        compact && styles.savedCardCompact,
        pressed && styles.pressed,
      ]}>
      <Image
        source={boat.image}
        style={[styles.savedImage, compact && styles.savedImageCompact]}
      />
      <View style={[styles.savedCopy, compact && styles.savedCopyCompact]}>
        <Text style={[styles.badgeText, {color: category.color}]}>
          {boat.family}
        </Text>
        <Text style={styles.savedTitle}>{boat.name}</Text>
        <Text style={styles.savedMeta}>{boat.maker} · {boat.specs[0].value}</Text>
      </View>
      <Pressable onPress={onRemove} style={styles.deleteButton}>
        <Text style={styles.deleteText}>🗑</Text>
      </Pressable>
    </Pressable>
  );
}

function SavedLocationCard({
  location,
  onPress,
  onRemove,
}: {
  location: FishingLocation;
  onPress: () => void;
  onRemove: () => void;
}): React.JSX.Element {
  const category = categoryTheme[location.category];
  const compact = useCompactLayout();

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.savedCard,
        compact && styles.savedCardCompact,
        pressed && styles.pressed,
      ]}>
      <Image
        source={location.image}
        style={[styles.savedImage, compact && styles.savedImageCompact]}
      />
      <View style={[styles.savedCopy, compact && styles.savedCopyCompact]}>
        <Text style={[styles.badgeText, {color: category.color}]}>
          {category.label}
        </Text>
        <Text style={styles.savedTitle}>{location.name}</Text>
        <Text style={styles.savedMeta}>{location.region} · {location.difficulty}</Text>
      </View>
      <Pressable onPress={onRemove} style={styles.deleteButton}>
        <Text style={styles.deleteText}>🗑</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '900',
    marginTop: 4,
  },
  titleCompact: {
    fontSize: 25,
    lineHeight: 30,
  },
  subtitle: {
    color: '#6f96c6',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 18,
  },
  subtitleCompact: {
    marginBottom: 14,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 17,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  segmentedCompact: {
    marginBottom: 12,
  },
  segment: {
    flex: 1,
    minHeight: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  segmentTextActive: {
    color: colors.text,
  },
  list: {
    gap: 12,
  },
  savedCard: {
    minHeight: 90,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedCardCompact: {
    minHeight: 78,
  },
  pressed: {
    opacity: 0.82,
  },
  savedImage: {
    width: 88,
    height: '100%',
    minHeight: 90,
    backgroundColor: colors.surfaceStrong,
  },
  savedImageCompact: {
    width: 74,
    minHeight: 78,
  },
  savedCopy: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  savedCopyCompact: {
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  savedTitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },
  savedMeta: {
    color: '#6f8ab0',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    marginTop: 3,
  },
  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 79, 94, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  deleteText: {
    fontSize: 17,
  },
});
