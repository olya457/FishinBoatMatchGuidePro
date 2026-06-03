import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Image, Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import MapView, {Marker, type Region} from 'react-native-maps';
import {Screen, useChromeSpacing, useCompactLayout} from '../components/Screen';
import {Button, Chip} from '../components/UI';
import {locations} from '../data/catalog';
import type {MainScreenProps} from '../navigation/types';
import {categoryTheme, colors} from '../theme';
import type {Category, FishingLocation} from '../types';

const filters: (
  | {key: 'all'; label: string; icon: string}
  | {
      key: Category;
      label: string;
      icon: string;
    }
)[] = [
  {key: 'all', label: 'All Waters', icon: '📍'},
  {key: 'freshwater', label: 'Freshwater', icon: '🎣'},
  {key: 'coastal', label: 'Coastal', icon: '🌊'},
  {key: 'offshore', label: 'Offshore', icon: '🐟'},
];

const initialRegion: Region = {
  latitude: 34.8,
  longitude: -92.4,
  latitudeDelta: 34,
  longitudeDelta: 58,
};

const darkMapStyle = [
  {elementType: 'geometry', stylers: [{color: '#10203a'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#6f96c6'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#07101f'}]},
  {featureType: 'water', elementType: 'geometry', stylers: [{color: '#0b2344'}]},
  {featureType: 'road', elementType: 'geometry', stylers: [{color: '#132a4a'}]},
  {featureType: 'poi', stylers: [{visibility: 'off'}]},
];

export function MapScreen({navigation}: MainScreenProps): React.JSX.Element {
  const chrome = useChromeSpacing();
  const compactLayout = useCompactLayout();
  const mapRef = useRef<MapView>(null);
  const [filter, setFilter] = useState<'all' | Category>('all');
  const [mode, setMode] = useState<'map' | 'list'>('map');
  const [region, setRegion] = useState<Region>(initialRegion);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleLocations = useMemo(
    () =>
      locations.filter(location => filter === 'all' || location.category === filter),
    [filter],
  );
  const selected = selectedId
    ? visibleLocations.find(location => location.id === selectedId)
    : undefined;
  const topOverlayStyle = useMemo(
    () => ({top: chrome.top + 8}),
    [chrome.top],
  );
  const controlsStyle = useMemo(
    () => ({bottom: chrome.tabBottom + chrome.tabHeight + 20}),
    [chrome.tabBottom, chrome.tabHeight],
  );
  const legendStyle = useMemo(
    () => ({bottom: chrome.tabBottom + chrome.tabHeight + 24}),
    [chrome.tabBottom, chrome.tabHeight],
  );

  const fitMarkers = useCallback(() => {
    if (!visibleLocations.length) {
      return;
    }

    mapRef.current?.fitToCoordinates(
      visibleLocations.map(location => location.coordinates),
      {
        edgePadding: compactLayout
          ? {top: 145, right: 48, bottom: 130, left: 48}
          : {top: 190, right: 70, bottom: 170, left: 70},
        animated: true,
      },
    );
  }, [compactLayout, visibleLocations]);

  useEffect(() => {
    if (mode === 'map') {
      const timer = setTimeout(fitMarkers, 250);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [filter, fitMarkers, mode]);

  const applyFilter = (nextFilter: 'all' | Category) => {
    setFilter(nextFilter);
    setSelectedId(null);
  };

  const selectMarker = (location: FishingLocation) => {
    setSelectedId(location.id);
    const nextRegion = {
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
      latitudeDelta: Math.max(region.latitudeDelta * 0.65, 7),
      longitudeDelta: Math.max(region.longitudeDelta * 0.65, 10),
    };

    setRegion(nextRegion);
    mapRef.current?.animateToRegion(nextRegion, 350);
  };

  const zoom = (factor: number) => {
    const nextRegion = {
      ...region,
      latitudeDelta: Math.min(Math.max(region.latitudeDelta * factor, 2), 70),
      longitudeDelta: Math.min(Math.max(region.longitudeDelta * factor, 3), 90),
    };

    setRegion(nextRegion);
    mapRef.current?.animateToRegion(nextRegion, 250);
  };

  if (mode === 'map') {
    return (
      <View style={styles.fullMapRoot}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background}
          translucent
        />
        <MapView
          ref={mapRef}
          style={styles.fullMap}
          customMapStyle={darkMapStyle}
          initialRegion={initialRegion}
          onRegionChangeComplete={setRegion}>
          {visibleLocations.map(location => (
            <Marker
              key={location.id}
              coordinate={location.coordinates}
              pinColor={categoryTheme[location.category].color}
              onPress={() => selectMarker(location)}
            />
          ))}
        </MapView>
        <View
          style={[
            styles.topOverlay,
            compactLayout && styles.topOverlayCompact,
            topOverlayStyle,
          ]}>
          <Header
            mode={mode}
            onModeChange={setMode}
            count={locations.length}
            compact
          />
          <FilterRow filter={filter} onChange={applyFilter} compact />
        </View>
        <View style={[styles.mapControls, controlsStyle]}>
          <MapControl label="+" onPress={() => zoom(0.55)} />
          <MapControl label="−" onPress={() => zoom(1.8)} />
          <MapControl label="◎" onPress={fitMarkers} />
        </View>
        <View style={[styles.legend, legendStyle]}>
          {(['freshwater', 'coastal', 'offshore'] as Category[]).map(category => (
            <View key={category} style={styles.legendRow}>
              <View
                style={[
                  styles.legendDot,
                  {backgroundColor: categoryTheme[category].color},
                ]}
              />
              <Text style={styles.legendText}>
                {categoryTheme[category].shortLabel}
              </Text>
            </View>
          ))}
        </View>
        {selected ? (
          <View pointerEvents="box-none" style={styles.popupOverlay}>
            <View
              style={[
                styles.markerPopup,
                compactLayout && styles.markerPopupCompact,
              ]}>
              <Image
                source={selected.image}
                style={[
                  styles.popupImage,
                  compactLayout && styles.popupImageCompact,
                ]}
              />
              <View style={styles.popupTop}>
                <View
                  style={[
                    styles.popupBadge,
                    {backgroundColor: categoryTheme[selected.category].surface},
                  ]}>
                  <Text
                    style={[
                      styles.popupBadgeText,
                      {color: categoryTheme[selected.category].color},
                    ]}>
                    {categoryTheme[selected.category].label}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setSelectedId(null)}
                  style={styles.closeButton}>
                  <Text style={styles.closeText}>×</Text>
                </Pressable>
              </View>
              <Text style={styles.popupTitle}>{selected.name}</Text>
              <Text style={styles.popupMeta}>
                {selected.region} · {selected.difficulty}
              </Text>
              <Text style={styles.popupText} numberOfLines={2}>
                {selected.description}
              </Text>
              <View style={styles.popupActions}>
                <Button
                  label="Open"
                  icon="↗"
                  onPress={() =>
                    navigation.navigate('LocationDetail', {
                      locationId: selected.id,
                    })
                  }
                  style={styles.popupButton}
                />
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <Screen>
      <Header mode={mode} onModeChange={setMode} count={locations.length} />
      <FilterRow filter={filter} onChange={applyFilter} />
      <View style={styles.list}>
        {visibleLocations.map(location => (
          <LocationCard
            key={location.id}
            location={location}
            onPress={() =>
              navigation.navigate('LocationDetail', {locationId: location.id})
            }
          />
        ))}
      </View>
    </Screen>
  );
}

function Header({
  mode,
  onModeChange,
  count,
  compact,
}: {
  mode: 'map' | 'list';
  onModeChange: (mode: 'map' | 'list') => void;
  count: number;
  compact?: boolean;
}): React.JSX.Element {
  return (
    <View style={[styles.headerRow, compact && styles.headerRowCompact]}>
      <View style={styles.headerCopy}>
        <Text style={[styles.title, compact && styles.titleCompact]}>
          Fishing Map
        </Text>
        {compact ? (
          <Text style={styles.mapCount}>{count} locations</Text>
        ) : (
          <Text style={styles.subtitle}>{count} prime fishing locations</Text>
        )}
      </View>
      <View style={styles.segmented}>
        <Pressable
          onPress={() => onModeChange('map')}
          style={[styles.segment, mode === 'map' && styles.segmentActive]}>
          <Text
            style={[styles.segmentText, mode === 'map' && styles.segmentTextActive]}>
            Map
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onModeChange('list')}
          style={[styles.segment, mode === 'list' && styles.segmentActive]}>
          <Text
            style={[styles.segmentText, mode === 'list' && styles.segmentTextActive]}>
            List
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function FilterRow({
  filter,
  onChange,
  compact,
}: {
  filter: 'all' | Category;
  onChange: (filter: 'all' | Category) => void;
  compact?: boolean;
}): React.JSX.Element {
  return (
    <View style={styles.filters}>
      {filters.map(item => {
        const active = filter === item.key;
        const color =
          item.key === 'all' ? colors.primary : categoryTheme[item.key].color;

        const label =
          compact && item.key !== 'all'
            ? categoryTheme[item.key].shortLabel
            : compact
              ? 'All'
              : item.label;

        return (
          <Chip
            key={item.key}
            label={label}
            icon={item.icon}
            active={active}
            color={color}
            onPress={() => onChange(item.key)}
            style={[styles.filterChip, compact && styles.filterChipCompact]}
          />
        );
      })}
    </View>
  );
}

function MapControl({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}): React.JSX.Element {
  const compact = useCompactLayout();

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.mapControl,
        compact && styles.mapControlCompact,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.mapControlText, compact && styles.mapControlTextCompact]}>
        {label}
      </Text>
    </Pressable>
  );
}

function LocationCard({
  location,
  onPress,
}: {
  location: FishingLocation;
  onPress: () => void;
}): React.JSX.Element {
  const category = categoryTheme[location.category];

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.locationCard,
        {borderColor: category.color},
        pressed && styles.pressed,
      ]}>
      <View style={[styles.sideBar, {backgroundColor: category.color}]} />
      <View style={styles.locationBody}>
        <View style={[styles.smallBadge, {backgroundColor: category.surface}]}>
          <Text style={[styles.smallBadgeText, {color: category.color}]}>
            {category.label}
          </Text>
        </View>
        <Text style={styles.locationName}>{location.name}</Text>
        <Text style={styles.locationMeta}>
          {location.region} · {location.difficulty}
        </Text>
        <Text style={styles.locationDescription} numberOfLines={2}>
          {location.description}
        </Text>
        <Button
          label="Open"
          icon="↗"
          onPress={onPress}
          style={styles.locationOpenButton}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fullMapRoot: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fullMap: {
    ...StyleSheet.absoluteFillObject,
  },
  topOverlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(7, 16, 31, 0.86)',
    borderWidth: 1,
    borderColor: '#2b4773',
    padding: 10,
  },
  topOverlayCompact: {
    left: 10,
    right: 10,
    padding: 8,
    borderRadius: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  headerRowCompact: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headerCopy: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '900',
  },
  titleCompact: {
    fontSize: 21,
    lineHeight: 25,
  },
  mapCount: {
    color: '#7aa7db',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    marginTop: 1,
  },
  subtitle: {
    color: '#7aa7db',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 17,
    padding: 3,
    borderWidth: 1,
    borderColor: '#385b91',
  },
  segment: {
    minWidth: 48,
    minHeight: 30,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
  },
  segmentTextActive: {
    color: colors.text,
  },
  filters: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  filterChip: {
    minHeight: 38,
  },
  filterChipCompact: {
    minHeight: 30,
    paddingHorizontal: 10,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    gap: 10,
  },
  mapControl: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16243c',
    borderWidth: 2,
    borderColor: '#3d63a3',
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},
    elevation: 8,
  },
  mapControlCompact: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  mapControlText: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '900',
  },
  mapControlTextCompact: {
    fontSize: 24,
    lineHeight: 26,
  },
  legend: {
    position: 'absolute',
    left: 16,
    borderRadius: 15,
    backgroundColor: 'rgba(7, 14, 28, 0.88)',
    borderWidth: 1,
    borderColor: '#385b91',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    gap: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  legendText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '900',
  },
  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  markerPopup: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    backgroundColor: 'rgba(12, 21, 38, 0.96)',
    borderWidth: 1,
    borderColor: '#456aa5',
    padding: 18,
    shadowColor: colors.black,
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 10},
    elevation: 18,
  },
  markerPopupCompact: {
    maxWidth: 330,
    padding: 14,
    borderRadius: 18,
  },
  popupImage: {
    width: '100%',
    height: 135,
    borderRadius: 15,
    backgroundColor: colors.surfaceStrong,
    marginBottom: 14,
  },
  popupImageCompact: {
    height: 105,
    borderRadius: 13,
    marginBottom: 11,
  },
  popupTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  popupBadge: {
    minHeight: 26,
    borderRadius: 13,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  popupBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#243653',
    borderWidth: 1,
    borderColor: '#4c6fa7',
  },
  closeText: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
  },
  popupTitle: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
  },
  popupMeta: {
    color: '#6aa0e8',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
    marginTop: 4,
  },
  popupText: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
    marginTop: 12,
  },
  popupActions: {
    marginTop: 16,
  },
  popupButton: {
    minHeight: 44,
    borderRadius: 14,
  },
  list: {
    gap: 12,
  },
  locationCard: {
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  sideBar: {
    width: 6,
  },
  locationBody: {
    flex: 1,
    padding: 14,
  },
  smallBadge: {
    alignSelf: 'flex-start',
    minHeight: 26,
    borderRadius: 13,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  smallBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  locationName: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '900',
  },
  locationMeta: {
    color: '#5b91dc',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
    marginTop: 4,
  },
  locationDescription: {
    color: '#879bbb',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    marginTop: 8,
  },
  locationOpenButton: {
    alignSelf: 'flex-start',
    minHeight: 38,
    minWidth: 96,
    borderRadius: 13,
    marginTop: 12,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.82,
  },
});
