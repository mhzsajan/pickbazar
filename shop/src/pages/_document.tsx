import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';

export default class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return Document.getInitialProps(ctx);
  }
  render() {
    // const { locale } = this.props.__NEXT_DATA__;
    // const dir = getDirection(locale);
    return (
      // <Html dir={dir}>
      <Html>
        <Head>
          {/* <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=optional"
            rel="stylesheet"
          /> */}
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var theme = localStorage.getItem('pickbazar-theme');
                    if (theme === 'light') {
                      document.documentElement.classList.remove('dark');
                    } else {
                      document.documentElement.classList.add('dark');
                    }
                  } catch(e) {}
                })();
              `,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
