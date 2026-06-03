import React, {PropsWithChildren} from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, spacing} from '../theme';

export const TAB_BAR_HEIGHT = 72;

export function useCompactLayout() {
  const {width, height} = useWindowDimensions();

  return width <= 380 || height <= 700;
}

export function useChromeSpacing() {
  const insets = useSafeAreaInsets();
  const compact = useCompactLayout();
  const top = Platform.OS === 'android' ? 30 : Math.max(insets.top, 16);
  const bottom = Platform.OS === 'android' ? 30 : Math.max(insets.bottom, 20);

  return {
    top,
    bottom,
    tabBottom: bottom,
    tabHeight: compact ? 64 : TAB_BAR_HEIGHT,
  };
}

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  withTabs?: boolean;
  horizontalPadding?: number;
  topOffset?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}>;

export function Screen({
  children,
  scroll = true,
  withTabs = true,
  horizontalPadding,
  topOffset = 0,
  style,
  contentStyle,
}: ScreenProps): React.JSX.Element {
  const chrome = useChromeSpacing();
  const compact = useCompactLayout();
  const pagePadding = horizontalPadding ?? (compact ? 12 : spacing.pageX);
  const bottom = withTabs
    ? chrome.tabBottom + chrome.tabHeight + 18
    : chrome.bottom + 18;
  const content = [
    styles.content,
    {
      paddingTop: chrome.top + topOffset,
      paddingBottom: bottom,
      paddingHorizontal: pagePadding,
    },
    contentStyle,
  ];

  return (
    <View style={[styles.root, style]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
        translucent={Platform.OS === 'android'}
      />
      {scroll ? (
        <ScrollView
          style={styles.fill}
          contentContainerStyle={content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={content}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fill: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
