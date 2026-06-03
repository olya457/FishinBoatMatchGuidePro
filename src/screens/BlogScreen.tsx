import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Screen, useCompactLayout} from '../components/Screen';
import {Button, IconButton, SectionTitle} from '../components/UI';
import {useSavedItems} from '../context/SavedItemsContext';
import {articles} from '../data/catalog';
import type {MainScreenProps} from '../navigation/types';
import {categoryTheme, colors} from '../theme';
import type {Article} from '../types';

export function BlogScreen({navigation}: MainScreenProps): React.JSX.Element {
  const savedItems = useSavedItems();
  const compact = useCompactLayout();
  const favorites = articles.filter(article =>
    savedItems.isArticleSaved(article.id),
  );

  return (
    <Screen>
      <Text style={[styles.title, compact && styles.titleCompact]}>
        Expert Articles
      </Text>
      <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
        Fishing knowledge from seasoned professionals
      </Text>
      {favorites.length > 0 ? (
        <View style={styles.favoriteBlock}>
          <SectionTitle label="♥ Favorites" />
          {favorites.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              compact
              saved={savedItems.isArticleSaved(article.id)}
              onPress={() =>
                navigation.navigate('ArticleDetail', {articleId: article.id})
              }
              onToggle={() => savedItems.toggleArticle(article.id)}
            />
          ))}
        </View>
      ) : null}
      <View style={styles.list}>
        {articles.map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            saved={savedItems.isArticleSaved(article.id)}
            onPress={() =>
              navigation.navigate('ArticleDetail', {articleId: article.id})
            }
            onToggle={() => savedItems.toggleArticle(article.id)}
          />
        ))}
      </View>
    </Screen>
  );
}

function ArticleCard({
  article,
  compact,
  saved,
  onPress,
  onToggle,
}: {
  article: Article;
  compact?: boolean;
  saved: boolean;
  onPress: () => void;
  onToggle: () => void;
}): React.JSX.Element {
  const category = categoryTheme[article.category];
  const compactLayout = useCompactLayout();

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.card,
        compactLayout && styles.cardSmallScreen,
        compact && styles.cardCompact,
        {borderColor: saved ? category.color : colors.border},
        pressed && styles.pressed,
      ]}>
      <View style={styles.cardTop}>
        <View style={[styles.badge, {backgroundColor: category.surface}]}>
          <Text style={[styles.badgeText, {color: category.color}]}>
            {category.label}
          </Text>
        </View>
        <IconButton
          icon={saved ? '♥' : '♡'}
          active={saved}
          onPress={onToggle}
          style={styles.heartButton}
        />
      </View>
      <View style={styles.articleCopy}>
        <Text
          style={[
            styles.cardTitle,
            compactLayout && styles.cardTitleSmallScreen,
          ]}>
          {article.title}
        </Text>
        <Text style={styles.excerpt} numberOfLines={compact ? 2 : 3}>
          {article.excerpt}
        </Text>
        <View style={styles.cardBottom}>
          <Text style={styles.meta}>
            {article.author}   ⏱ {article.readTime}
          </Text>
          <Button
            label="Open"
            icon="↗"
            onPress={onPress}
            style={styles.openButton}
          />
        </View>
      </View>
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
  favoriteBlock: {
    marginBottom: 18,
  },
  list: {
    gap: 12,
  },
  card: {
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  cardSmallScreen: {
    padding: 12,
    gap: 8,
  },
  cardCompact: {
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.82,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  heartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  articleCopy: {
    gap: 8,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },
  cardTitleSmallScreen: {
    fontSize: 15,
    lineHeight: 20,
  },
  excerpt: {
    color: '#7690b3',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    fontWeight: '600',
  },
  meta: {
    color: '#4f83ca',
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  openButton: {
    minHeight: 38,
    minWidth: 92,
    borderRadius: 13,
    paddingHorizontal: 12,
  },
});
