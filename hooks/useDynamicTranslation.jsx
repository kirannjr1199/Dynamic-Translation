import {
  useCallback,
  useRef,
} from 'react';

import {
  translateTexts,
} from '../services/translationService';

function getTextNodes(root = document.body) {
  const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;

          if (!parent) {
            return NodeFilter.FILTER_REJECT;
          }

          const tag = parent.tagName.toLowerCase();

          const ignoredTags = [
            'script',
            'style',
            'noscript',
            'textarea',
            'input',
            'select',
            'option',
          ];

          if (ignoredTags.includes(tag)) {
            return NodeFilter.FILTER_REJECT;
          }

          const text = node.nodeValue?.trim();

          if (!text) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

  const nodes = [];

  let node;

  while (
    (node = walker.nextNode())
  ) {
    nodes.push(node);
  }

  return nodes;
}

function normalizeText(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim();
}

function createCacheKey(
  text,
  source,
  target
) {
  return (
    `${source}|||` +
    `${target}|||` +
    `${normalizeText(text)}`
  );
}

export default function useDynamicTranslation() {
  const cacheRef =
    useRef(new Map());

  const originalTextsRef =
    useRef(new WeakMap());

  const activeRequestIdRef =
    useRef(0);

  const translatePage = useCallback(
    async (
      targetLanguage,
      sourceLanguage = 'en'
    ) => {
      if (
        typeof document === 'undefined' ||
        !document.body
      ) {
        return;
      }

      const requestId =
        ++activeRequestIdRef.current;

      const nodes =
        getTextNodes();

      if (nodes.length === 0) {
        return;
      }

      const texts = [];

      for (const node of nodes) {
        if (
          !originalTextsRef.current.has(
            node
          )
        ) {
          originalTextsRef.current.set(
            node,
            node.nodeValue
          );
        }

        const originalText =
          originalTextsRef.current.get(
            node
          );

        if (
          originalText &&
          originalText.trim()
        ) {
          texts.push(
            normalizeText(
              originalText
            )
          );
        }
      }

      if (
        sourceLanguage ===
        targetLanguage
      ) {
        restoreOriginalPage();
        return;
      }

      const uniqueTexts =
        [...new Set(texts)];

      const textsToTranslate = [];

      uniqueTexts.forEach((text) => {
        const key =
          createCacheKey(
            text,
            sourceLanguage,
            targetLanguage
          );

        if (
          !cacheRef.current.has(key)
        ) {
          textsToTranslate.push(text);
        }
      });

      if (
        textsToTranslate.length > 0
      ) {
        const translations =
          await translateTexts(
            textsToTranslate,
            sourceLanguage,
            targetLanguage
          );

        if (
          requestId !==
          activeRequestIdRef.current
        ) {
          return;
        }

        translations.forEach(
          (translation, index) => {
            const original =
              textsToTranslate[index];

            const key =
              createCacheKey(
                original,
                sourceLanguage,
                targetLanguage
              );

            cacheRef.current.set(
              key,
              translation
            );
          }
        );
      }

      if (
        requestId !==
        activeRequestIdRef.current
      ) {
        return;
      }

      nodes.forEach((node) => {
        const original =
          originalTextsRef.current.get(
            node
          );

        if (!original) {
          return;
        }

        const normalized =
          normalizeText(original);

        const key =
          createCacheKey(
            normalized,
            sourceLanguage,
            targetLanguage
          );

        const translated =
          cacheRef.current.get(key);

        if (translated) {
          const leading =
            original.match(/^\s*/)?.[0] ||
            '';

          const trailing =
            original.match(/\s*$/)?.[0] ||
            '';

          node.nodeValue =
            leading +
            translated +
            trailing;
        }
      });
    },
    []
  );

  const restoreOriginalPage =
    useCallback(() => {
      if (
        typeof document === 'undefined'
      ) {
        return;
      }

      activeRequestIdRef.current++;

      const nodes =
        getTextNodes();

      nodes.forEach((node) => {
        const original =
          originalTextsRef.current.get(
            node
          );

        if (original !== undefined) {
          node.nodeValue = original;
        }
      });
    }, []);

  return {
    translatePage,
    restoreOriginalPage,
  };
}