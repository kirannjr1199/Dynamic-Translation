import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';

import LanguageSelector from './components/LanguageSelector';
import useDynamicTranslation from './hooks/useDynamicTranslation';

export default function App() {
  const {
    translatePage,
    restoreOriginalPage,
  } = useDynamicTranslation();

  const handleLanguageChange = async (language) => {
    if (language === 'en') {
      restoreOriginalPage();
      return;
    }

    try {
      await translatePage(language, 'en');
    } catch (error) {
      console.error('Translation failed:', error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Welcome to My Website
        </Text>

        <Text style={styles.subtitle}>
          Dynamic React Native Web Translation
        </Text>

        <LanguageSelector
          onLanguageChange={handleLanguageChange}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>
          About Our Website
        </Text>

        <Text style={styles.paragraph}>
          This is a React Native Web application.
        </Text>

        <Text style={styles.paragraph}>
          The webpage can be translated dynamically
          without predefined translation JSON files.
        </Text>

        <Text style={styles.paragraph}>
          Select a language above to translate the
          content of this webpage.
        </Text>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>
            Get Started
          </Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>
          Dynamic Translation
        </Text>

        <Text style={styles.paragraph}>
          Text is discovered from the rendered
          webpage and sent to the translation service.
        </Text>

        <Text style={styles.paragraph}>
          Previously translated text is cached to
          reduce unnecessary translation requests.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Thank you for visiting our website.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 30,
    alignItems: 'center',
  },

  header: {
    width: '100%',
    maxWidth: 900,
    alignItems: 'center',
    marginBottom: 30,
  },

  title: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 25,
  },

  card: {
    width: '100%',
    maxWidth: 900,
    backgroundColor: '#ffffff',
    padding: 30,
    marginBottom: 20,
    borderRadius: 12,
  },

  heading: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 15,
  },

  paragraph: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 15,
  },

  button: {
    alignSelf: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#222',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  footer: {
    marginTop: 20,
    marginBottom: 20,
  },

  footerText: {
    fontSize: 15,
  },
});