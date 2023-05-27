import { createContext, useState } from "react";

const LanguageContext = createContext();

const initialTheme='en'

const LanguageProvider=({children})=>{

    const [language,setLanguage]=useState(initialTheme)

    const handleLanguage = (e)=>{
        if(language==='en'){
            setLanguage('es')
        } else {
            setLanguage('en')
        }
    }

    const data={language,handleLanguage}

    return(
        <LanguageContext.Provider value={data}>{children}</LanguageContext.Provider>
    )

}
export {LanguageProvider}
export default LanguageContext