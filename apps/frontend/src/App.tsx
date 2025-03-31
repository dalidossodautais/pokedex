import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Provider } from "react-redux";
import { theme } from "./styles/theme";
import { store } from "./store";
import Home from "./pages/Home";
import PokemonPage from "./pages/Pokemon";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:id" element={<PokemonPage />} />
        </Routes>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
