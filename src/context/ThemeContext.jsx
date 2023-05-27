import { createContext, useState } from "react";
import light from '../assets/light.png'
import dark from '../assets/dark.png'

const ThemeContext = createContext();

const initialTheme='bg-dark-theme text-light-theme'
const initialImage=dark
const initialText='dark'

const ThemeProvider=({children})=>{

    const [theme,setTheme]=useState(initialTheme)
    const [image,setImage]=useState(initialImage)
    const [text,setText]=useState(initialText)

    const handleTheme = (e)=>{
        if(text==='dark'){
            setTheme("bg-light-theme text-dark-theme ")
            setImage(light)
            setText('light')
        } else {
            setTheme("bg-dark-theme text-light-theme")
            setImage(dark)
            setText('dark')
        }
    }

    const data={theme,handleTheme,image}

    return(
        <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>
    )

}
export {ThemeProvider}
export default ThemeContext