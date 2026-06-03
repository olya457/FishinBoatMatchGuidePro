import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useChromeSpacing, useCompactLayout} from '../components/Screen';
import {colors} from '../theme';
import type {MainTabKey} from './types';

const tabs: {key: MainTabKey; label: string; icon: string}[] = [
  {key: 'boats', label: 'Boats', icon: '⛵'},
  {key: 'blog', label: 'Blog', icon: '📖'},
  {key: 'tips', label: 'Tips', icon: '💡'},
  {key: 'map', label: 'Map', icon: '🗺️'},
  {key: 'saved', label: 'Saved', icon: '🔖'},
  {key: 'quiz', label: 'Quiz', icon: '❔'},
];

type FloatingTabBarProps = {
  activeTab: MainTabKey;
  onChange: (tab: MainTabKey) => void;
};

export function FloatingTabBar({
  activeTab,
  onChange,
}: FloatingTabBarProps): React.JSX.Element {
  const chrome = useChromeSpacing();
  const compact = useCompactLayout();

  return (
    <View
      style={[
        styles.wrap,
        compact && styles.wrapCompact,
        {bottom: chrome.tabBottom, height: chrome.tabHeight},
      ]}>
      {tabs.map(tab => {
        const active = activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={({pressed}) => [
              styles.item,
              compact && styles.itemCompact,
              active && styles.itemActive,
              pressed && styles.itemPressed,
            ]}>
            <View
              style={[
                styles.iconWrap,
                compact && styles.iconWrapCompact,
                active && styles.iconWrapActive,
              ]}>
              <Text
                style={[
                  styles.icon,
                  compact && styles.iconCompact,
                  active && styles.iconActive,
                ]}>
                {tab.icon}
              </Text>
            </View>
            <Text
              style={[
                styles.label,
                compact && styles.labelCompact,
                active && styles.labelActive,
              ]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 14,
    right: 14,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(7, 14, 28, 0.96)',
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
    elevation: 16,
  },
  wrapCompact: {
    left: 10,
    right: 10,
    borderRadius: 19,
    paddingHorizontal: 6,
  },
  item: {
    flex: 1,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  itemCompact: {
    height: 52,
    borderRadius: 16,
  },
  itemActive: {
    backgroundColor: 'rgba(47, 109, 246, 0.12)',
  },
  itemPressed: {
    opacity: 0.75,
  },
  iconWrap: {
    minWidth: 30,
    minHeight: 26,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(47, 109, 246, 0.22)',
  },
  iconWrapCompact: {
    minWidth: 27,
    minHeight: 23,
    marginBottom: 2,
  },
  icon: {
    fontSize: 17,
    opacity: 0.55,
  },
  iconCompact: {
    fontSize: 15,
  },
  iconActive: {
    opacity: 1,
  },
  labelCompact: {
    fontSize: 9,
  },
  label: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
  },
  labelActive: {
    color: colors.primary,
  },
});
