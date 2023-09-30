import { ThemeProvider } from 'next-themes';
import { VoteProvider } from '../context/VotingContext';

import '../styles/globals.css';
import { NavBar, Footer } from '../components';

const App = ({ Component, pageProps }) => (
  <VoteProvider>
    <ThemeProvider attribute="class">
      <div className="dark:bg-vote-dark bg-white min-h-screen">
        <NavBar />
        <Component {...pageProps} />
        {/* <Footer /> */}
      </div>
    </ThemeProvider>
  </VoteProvider>
);

export default App;
