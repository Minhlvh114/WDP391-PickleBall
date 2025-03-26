import {Toaster} from "react-hot-toast";
import Router from './routes';
import ScrollToTop from './components/scroll-to-top';
import ThemeProvider from './theme';


function App() {
  return (
    <ThemeProvider>
      <div><Toaster/></div>
      <ScrollToTop/>
      <Router/>
    </ThemeProvider>
  );
}

export default App;
