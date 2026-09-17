import  { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";
import i18n from "./Translate";

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language || "en"); // Initialize with the detected/default language

  const switchLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang); // Update language globally in i18n
  };

  return (
    <TranslationContext.Provider value={{ language, switchLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Prop validation
TranslationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTranslationContext = () => useContext(TranslationContext);
