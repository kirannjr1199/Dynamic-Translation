import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: '1mb',
  })
);

const PORT = process.env.PORT || 5000;

const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL ||  'http://localhost:5001';

app.get(
  '/api/health',
  (req, res) => {
    res.json({
      success: true,
      message:
        'Translation server is running',
    });
  }
);

app.post(
  '/api/translate',
  async (req, res) => {
    try {
      const {
        texts,
        source = 'en',
        target,
      } = req.body;

      if (
        !Array.isArray(texts)
      ) {
        return res
          .status(400)
          .json({
            error:
              'texts must be an array',
          });
      }

      if (!target) {
        return res
          .status(400)
          .json({
            error:
              'target language is required',
          });
      }

      if (
        source === target
      ) {
        return res.json({
          translations: texts,
        });
      }

      console.log(
        `Translating ${texts.length} texts: ${source} → ${target}`
      );

      const response =
        await fetch(
          `${LIBRETRANSLATE_URL}/translate`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              q: texts,
              source,
              target,
              format: 'text',
            }),
          }
        );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          'LibreTranslate error:',
          errorText
        );

        return res
          .status(response.status)
          .json({
            error:
              errorText ||
              'LibreTranslate request failed',
          });
      }

      const data =
        await response.json();

      const translations =
        Array.isArray(
          data.translatedText
        )
          ? data.translatedText
          : [data.translatedText];

      return res.json({
        translations,
      });
    } catch (error) {
      console.error(
        'Translation error:',
        error
      );

      return res
        .status(500)
        .json({
          error:
            error.message ||
            'Translation server error',
        });
    }
  }
);

app.listen(
  PORT,
  () => {
    console.log(
      `Translation server running on http://localhost:${PORT}`
    );

    console.log(
      `LibreTranslate: ${LIBRETRANSLATE_URL}`
    );
  }
);