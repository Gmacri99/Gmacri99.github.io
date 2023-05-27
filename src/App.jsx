import { } from 'react';
import './App.css'
import MainPokedex from './components/Main';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
      <ThemeProvider> 
        <LanguageProvider>
          <MainPokedex/>
        </LanguageProvider>
      </ThemeProvider>
  )
}

export default App
