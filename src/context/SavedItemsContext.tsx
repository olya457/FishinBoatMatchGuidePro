import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {STORAGE_KEYS} from '../storage/keys';

type SavedItems = {
  boats: string[];
  locations: string[];
  articles: string[];
};

type SavedItemsContextValue = {
  saved: SavedItems;
  ready: boolean;
  isBoatSaved: (id: string) => boolean;
  isLocationSaved: (id: string) => boolean;
  isArticleSaved: (id: string) => boolean;
  toggleBoat: (id: string) => void;
  toggleLocation: (id: string) => void;
  toggleArticle: (id: string) => void;
  removeBoat: (id: string) => void;
  removeLocation: (id: string) => void;
};

const initialSaved: SavedItems = {
  boats: [],
  locations: [],
  articles: [],
};

const SavedItemsContext = createContext<SavedItemsContextValue | undefined>(
  undefined,
);

const normalizeSavedItems = (value: unknown): SavedItems => {
  if (!value || typeof value !== 'object') {
    return initialSaved;
  }

  const item = value as Partial<SavedItems>;

  return {
    boats: Array.isArray(item.boats) ? item.boats.filter(Boolean) : [],
    locations: Array.isArray(item.locations)
      ? item.locations.filter(Boolean)
      : [],
    articles: Array.isArray(item.articles) ? item.articles.filter(Boolean) : [],
  };
};

const toggleId = (ids: string[], id: string) =>
  ids.includes(id) ? ids.filter(item => item !== id) : [id, ...ids];

export function SavedItemsProvider({
  children,
}: PropsWithChildren): React.JSX.Element {
  const [saved, setSaved] = useState<SavedItems>(initialSaved);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(STORAGE_KEYS.savedItems)
      .then(raw => {
        if (!mounted || !raw) {
          return;
        }

        setSaved(normalizeSavedItems(JSON.parse(raw)));
      })
      .catch(() => undefined)
      .finally(() => {
        if (mounted) {
          setReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const commit = useCallback((next: SavedItems) => {
    setSaved(next);
    AsyncStorage.setItem(STORAGE_KEYS.savedItems, JSON.stringify(next)).catch(
      () => undefined,
    );
  }, []);

  const toggleBoat = useCallback(
    (id: string) => {
      commit({...saved, boats: toggleId(saved.boats, id)});
    },
    [commit, saved],
  );

  const toggleLocation = useCallback(
    (id: string) => {
      commit({...saved, locations: toggleId(saved.locations, id)});
    },
    [commit, saved],
  );

  const toggleArticle = useCallback(
    (id: string) => {
      commit({...saved, articles: toggleId(saved.articles, id)});
    },
    [commit, saved],
  );

  const removeBoat = useCallback(
    (id: string) => {
      commit({...saved, boats: saved.boats.filter(item => item !== id)});
    },
    [commit, saved],
  );

  const removeLocation = useCallback(
    (id: string) => {
      commit({
        ...saved,
        locations: saved.locations.filter(item => item !== id),
      });
    },
    [commit, saved],
  );

  const value = useMemo<SavedItemsContextValue>(
    () => ({
      saved,
      ready,
      isBoatSaved: id => saved.boats.includes(id),
      isLocationSaved: id => saved.locations.includes(id),
      isArticleSaved: id => saved.articles.includes(id),
      toggleBoat,
      toggleLocation,
      toggleArticle,
      removeBoat,
      removeLocation,
    }),
    [
      ready,
      removeBoat,
      removeLocation,
      saved,
      toggleArticle,
      toggleBoat,
      toggleLocation,
    ],
  );

  return (
    <SavedItemsContext.Provider value={value}>
      {children}
    </SavedItemsContext.Provider>
  );
}

export function useSavedItems(): SavedItemsContextValue {
  const value = useContext(SavedItemsContext);

  if (!value) {
    throw new Error('useSavedItems must be used inside SavedItemsProvider');
  }

  return value;
}
