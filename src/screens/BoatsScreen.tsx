import React, {useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Screen, useCompactLayout} from '../components/Screen';
import {Chip} from '../components/UI';
import {boats} from '../data/catalog';
import {categoryTheme, colors} from '../theme';
import type {Boat, Category} from '../types';
import type {MainScreenProps} from '../navigation/types';

const filters: ({key: 'all'; label: string; icon: string} | {
  key: Category;
  label: string;
  icon: string;
})[] = [
  {key: 'all', label: 'All Boats', icon: '⛵'},
  {key: 'freshwater', label: 'Freshwater', icon: '🎣'},
  {key: 'coastal', label: 'Coastal', icon: '🌊'},
  {key: 'offshore', label: 'Offshore', icon: '🐟'},
];

export function BoatsScreen({navigation}: MainScreenProps): React.JSX.Element {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | Category>('all');
  const compact = useCompactLayout();

  const visibleBoats = useMemo(() => {
    const value = query.trim().toLowerCase();

    return boats.filter(boat => {
      const matchesFilter = filter === 'all' || boat.category === filter;
      const matchesQuery =
        !value ||
        boat.name.toLowerCase().includes(value) ||
        boat.maker.toLowerCase().includes(value) ||
        boat.family.toLowerCase().includes(value);

      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <Screen>
      <Text style={[styles.title, compact && styles.titleCompact]}>
        Fishing Boats
      </Text>
      <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
        {boats.length} vessels across all categories
      </Text>
      <View style={[styles.search, compact && styles.searchCompact]}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search boats or brands..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          selectionColor={colors.primary}
        />
      </View>
      <View style={styles.filters}>
        {filters.map(item => {
          const active = filter === item.key;
          const color =
            item.key === 'all' ? colors.primary : categoryTheme[item.key].color;

          return (
            <Chip
              key={item.key}
              label={item.label}
              icon={item.icon}
              active={active}
              color={color}
              onPress={() => setFilter(item.key)}
            />
          );
        })}
      </View>
      <View style={styles.list}>
        {visibleBoats.map(boat => (
          <BoatCard
            key={boat.id}
            boat={boat}
            onPress={() => navigation.navigate('BoatDetail', {boatId: boat.id})}
          />
        ))}
      </View>
    </Screen>
  );
}

function BoatCard({
  boat,
  onPress,
}: {
  boat: Boat;
  onPress: () => void;
}): React.JSX.Element {
  const category = categoryTheme[boat.category];
  const compact = useCompactLayout();

  return (
    <Pressable onPress={onPress} style={({pressed}) => [styles.card, pressed && styles.cardPressed]}>
      <View style={[styles.imageWrap, compact && styles.imageWrapCompact]}>
        <Image source={boat.image} style={styles.image} />
        <View style={[styles.badge, {backgroundColor: category.surface}]}>
          <Text style={[styles.badgeText, {color: category.color}]}>
            {boat.family}
          </Text>
        </View>
      </View>
      <View style={[styles.cardBody, compact && styles.cardBodyCompact]}>
        <Text style={styles.maker}>{boat.maker}</Text>
        <Text style={[styles.cardTitle, compact && styles.cardTitleCompact]}>
          {boat.name}
        </Text>
        <Text style={styles.cardSummary}>{boat.summary}</Text>
        <View style={styles.specRow}>
          {boat.specs.slice(0, 3).map(spec => (
            <View key={spec.label} style={styles.specMini}>
              <Text style={styles.specLabel}>{spec.label}</Text>
              <Text style={styles.specValue}>{spec.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    marginTop: 4,
  },
  titleCompact: {
    fontSize: 25,
    lineHeight: 30,
  },
  subtitle: {
    color: '#72a4df',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 20,
  },
  subtitleCompact: {
    marginBottom: 14,
  },
  search: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  searchCompact: {
    minHeight: 48,
    borderRadius: 16,
    marginBottom: 12,
    paddingHorizontal: 13,
  },
  searchIcon: {
    color: '#51a0ff',
    fontSize: 25,
    marginRight: 8,
    marginTop: -2,
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  list: {
    gap: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111c34',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    opacity: 0.84,
  },
  imageWrap: {
    height: 182,
    backgroundColor: '#142852',
  },
  imageWrapCompact: {
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    left: 14,
    top: 14,
    minHeight: 32,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  cardBody: {
    padding: 16,
    gap: 4,
  },
  cardBodyCompact: {
    padding: 13,
  },
  maker: {
    color: '#6796dc',
    fontSize: 13,
    fontWeight: '700',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
  },
  cardTitleCompact: {
    fontSize: 18,
    lineHeight: 23,
  },
  cardSummary: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
  specRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  specMini: {
    flex: 1,
  },
  specLabel: {
    color: '#4f83cc',
    fontSize: 11,
    fontWeight: '800',
  },
  specValue: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
  },
});
