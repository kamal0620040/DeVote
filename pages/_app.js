import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { NavBar, Footer } from '../components';

const App = ({ Component, pageProps }) => (
  <ThemeProvider attribute="class">
    <div className="dark:bg-vote-dark bg-white min-h-screen">
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    </div>
  </ThemeProvider>
);

export default App;
