const API_URL =
  process.env.REACT_NATIVE_WEB_API_URL ||
  'http://localhost:5000/api/translate';

export async function translateTexts(
  texts,
  sourceLanguage,
  targetLanguage
) {
  if (!texts || texts.length === 0) {
    return [];
  }

  if (sourceLanguage === targetLanguage) {
    return texts;
  }

  const response = await fetch(API_URL, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      texts,
      source: sourceLanguage,
      target: targetLanguage,
    }),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(error);
  }

  const data = await response.json();

  return data.translations;
}