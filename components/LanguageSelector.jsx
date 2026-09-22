import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

const LANGUAGES = [
  {code: 'en', name: 'English'},
  {code: 'te', name: 'Telugu'},
  {code: 'hi', name: 'Hindi'},
  {code: 'ta', name: 'Tamil'},
  {code: 'kn', name: 'Kannada'},
  {code: 'ml', name: 'Malayalam'},
  {code: 'bn', name: 'Bengali'},
  {code: 'mr', name: 'Marathi'},
  {code: 'gu', name: 'Gujarati'},
  {code: 'es', name: 'Spanish'},
  {code: 'fr', name: 'French'},
  {code: 'de', name: 'German'},
  {code: 'it', name: 'Italian'},
  {code: 'pt', name: 'Portuguese'},
  {code: 'ru', name: 'Russian'},
  {code: 'ar', name: 'Arabic'},
  {code: 'zh', name: 'Chinese'},
];


export default function LanguageSelector({
  onLanguageChange,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Select Language
      </Text>

      <View style={styles.languages}>
        {LANGUAGES.map((language) => (
          <Pressable
            key={language.code}
            style={styles.languageButton}
            onPress={() =>
              onLanguageChange(language.code)
            }
          >
            <Text style={styles.languageText}>
              {language.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },

  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },

  languages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  languageButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    margin: 5,
    backgroundColor: '#fff',
  },

  languageText: {
    fontSize: 15,
  },
});