import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Image, Share, StyleSheet, Text, View} from 'react-native';
import {IconButton, Button} from '../components/UI';
import {Screen, useCompactLayout} from '../components/Screen';
import {useSavedItems} from '../context/SavedItemsContext';
import {findArticle} from '../data/catalog';
import type {RootStackParamList} from '../navigation/types';
import {categoryTheme, colors} from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ArticleDetail'>;

export function ArticleDetailScreen({
  navigation,
  route,
}: Props): React.JSX.Element {
  const article = findArticle(route.params.articleId);
  const savedItems = useSavedItems();
  const compact = useCompactLayout();

  if (!article) {
    return (
      <Screen withTabs={false} topOffset={10}>
        <IconButton icon="‹" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Article not found</Text>
      </Screen>
    );
  }

  const category = categoryTheme[article.category];
  const saved = savedItems.isArticleSaved(article.id);

  const shareArticle = () => {
    Share.share({
      title: article.title,
      message: `${article.title}\n\n${article.excerpt}`,
    }).catch(() => undefined);
  };

  return (
    <Screen withTabs={false} topOffset={10}>
      <View style={[styles.topActions, compact && styles.topActionsCompact]}>
        <IconButton icon="‹" onPress={() => navigation.goBack()} />
        <View style={[styles.actionGroup, compact && styles.actionGroupCompact]}>
          <IconButton icon={saved ? '♥' : '♡'} active={saved} onPress={() => savedItems.toggleArticle(article.id)} />
          <IconButton icon="↗" onPress={shareArticle} />
        </View>
      </View>
      <View style={[styles.badge, {backgroundColor: category.surface}]}>
        <Text style={[styles.badgeText, {color: category.color}]}>
          {category.label}
        </Text>
      </View>
      <Text style={[styles.title, compact && styles.titleCompact]}>
        {article.title}
      </Text>
      <View style={[styles.heroFrame, compact && styles.heroFrameCompact]}>
        <Image source={article.hero} style={styles.heroImage} resizeMode="cover" />
      </View>
      <View style={[styles.authorRow, compact && styles.authorRowCompact]}>
        <View>
          <Text style={styles.author}>{article.author}</Text>
          <Text style={styles.meta}>{article.date}   ⏱ {article.readTime}</Text>
        </View>
      </View>
      <View style={[styles.quote, compact && styles.quoteCompact]}>
        <Text style={[styles.quoteText, compact && styles.quoteTextCompact]}>
          {article.excerpt}
        </Text>
      </View>
      {article.body.map(paragraph => (
        <Text
          key={paragraph}
          style={[styles.paragraph, compact && styles.paragraphCompact]}>
          {paragraph}
        </Text>
      ))}
      <Button
        label={saved ? 'Remove from Favorites' : 'Add to Favorites'}
        icon={saved ? '♥' : '♡'}
        tone={saved ? 'danger' : 'ghost'}
        onPress={() => savedItems.toggleArticle(article.id)}
        style={styles.bottomButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  topActionsCompact: {
    marginBottom: 14,
  },
  actionGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  actionGroupCompact: {
    gap: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    minHeight: 26,
    borderRadius: 13,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
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
  heroFrame: {
    width: '100%',
    height: 230,
    borderRadius: 18,
    backgroundColor: '#14244a',
    borderWidth: 1,
    borderColor: '#2f4f82',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 18,
  },
  heroFrameCompact: {
    height: 176,
    borderRadius: 16,
    marginTop: 14,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
    marginBottom: 18,
  },
  authorRowCompact: {
    marginTop: 14,
    marginBottom: 14,
  },
  author: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  meta: {
    color: '#4f83ca',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },
  quote: {
    borderLeftWidth: 3,
    borderLeftColor: colors.teal,
    backgroundColor: 'rgba(19, 210, 161, 0.07)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  quoteCompact: {
    padding: 13,
    marginBottom: 16,
  },
  quoteText: {
    color: colors.textSoft,
    fontSize: 15,
    lineHeight: 23,
    fontStyle: 'italic',
    fontWeight: '700',
  },
  quoteTextCompact: {
    fontSize: 14,
    lineHeight: 21,
  },
  paragraph: {
    color: colors.textSoft,
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '600',
    marginBottom: 18,
  },
  paragraphCompact: {
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 15,
  },
  bottomButton: {
    marginTop: 4,
  },
});
