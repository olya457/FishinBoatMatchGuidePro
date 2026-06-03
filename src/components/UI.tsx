import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useCompactLayout} from './Screen';
import {colors} from '../theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  tone?: 'primary' | 'ghost' | 'danger' | 'success';
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  icon,
  disabled,
  loading,
  tone = 'primary',
  style,
}: ButtonProps): React.JSX.Element {
  const compact = useCompactLayout();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({pressed}) => [
        styles.button,
        compact && styles.buttonCompact,
        tone === 'ghost' && styles.buttonGhost,
        tone === 'danger' && styles.buttonDanger,
        tone === 'success' && styles.buttonSuccess,
        (disabled || loading) && styles.buttonDisabled,
        pressed && !disabled && !loading && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <>
          {icon ? <Text style={styles.buttonIcon}>{icon}</Text> : null}
          <Text
            style={[
              styles.buttonText,
              compact && styles.buttonTextCompact,
              tone === 'ghost' && styles.ghostText,
            ]}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

type IconButtonProps = {
  icon: string;
  onPress: () => void;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  icon,
  onPress,
  active,
  style,
}: IconButtonProps): React.JSX.Element {
  const compact = useCompactLayout();

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.iconButton,
        compact && styles.iconButtonCompact,
        active && styles.iconButtonActive,
        pressed && styles.pressed,
        style,
      ]}>
      <Text style={[styles.iconText, compact && styles.iconTextCompact]}>
        {icon}
      </Text>
    </Pressable>
  );
}

type ChipProps = {
  label: string;
  icon?: string;
  active?: boolean;
  color?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Chip({
  label,
  icon,
  active,
  color = colors.primary,
  onPress,
  style,
  textStyle,
}: ChipProps): React.JSX.Element {
  const compact = useCompactLayout();

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.chip,
        compact && styles.chipCompact,
        active && {backgroundColor: color, borderColor: color},
        pressed && styles.pressed,
        style,
      ]}>
      {icon ? <Text style={styles.chipIcon}>{icon}</Text> : null}
      <Text
        style={[
          styles.chipText,
          compact && styles.chipTextCompact,
          active && styles.chipTextActive,
          textStyle,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function EmptyState({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}): React.JSX.Element {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>{icon}</Text>
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

export function SectionTitle({label}: {label: string}): React.JSX.Element {
  return <Text style={styles.sectionTitle}>{label}</Text>;
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    shadowColor: colors.primary,
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 8,
  },
  buttonCompact: {
    minHeight: 48,
    borderRadius: 14,
    gap: 8,
    paddingHorizontal: 14,
  },
  buttonGhost: {
    backgroundColor: '#16243c',
    borderWidth: 1,
    borderColor: '#385b91',
  },
  buttonDanger: {
    backgroundColor: 'rgba(255, 79, 94, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 79, 94, 0.45)',
  },
  buttonSuccess: {
    backgroundColor: 'rgba(0, 213, 139, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(0, 213, 139, 0.45)',
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  buttonTextCompact: {
    fontSize: 14,
  },
  ghostText: {
    color: colors.text,
  },
  buttonIcon: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16243c',
    borderWidth: 2,
    borderColor: '#395987',
    shadowColor: colors.primary,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},
    elevation: 7,
  },
  iconButtonCompact: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  iconButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  iconText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  iconTextCompact: {
    fontSize: 20,
  },
  chip: {
    minHeight: 34,
    borderRadius: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipCompact: {
    minHeight: 30,
    borderRadius: 15,
    paddingHorizontal: 10,
    gap: 4,
  },
  chipText: {
    color: colors.textMuted,
    fontWeight: '700',
    fontSize: 13,
  },
  chipTextCompact: {
    fontSize: 12,
  },
  chipTextActive: {
    color: colors.text,
  },
  chipIcon: {
    fontSize: 13,
  },
  pressed: {
    opacity: 0.78,
  },
  empty: {
    flex: 1,
    minHeight: 420,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyIcon: {
    width: 78,
    height: 78,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  emptyIconText: {
    fontSize: 36,
  },
  emptyTitle: {
    color: colors.textSoft,
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 14,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
});
