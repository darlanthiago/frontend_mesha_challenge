import { BrowserRouter } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";

//routes
import Routes from "./routes";

//global styles
import GlobalStyles from "./styles/global";

//CSS and JS
import "react-toastify/dist/ReactToastify.css";

import AppProvider from "./contexts/hooks/index";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes />
        <GlobalStyles />
        <ToastContainer autoClose={5000} transition={Slide} />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
