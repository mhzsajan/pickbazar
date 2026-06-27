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
          <link
            href="https://cdn.jsdelivr.net/npm/@fontsource/google-sans-code@latest"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
