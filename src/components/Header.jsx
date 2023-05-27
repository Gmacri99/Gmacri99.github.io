import React, {useContext, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form'
import ThemeContext from '../context/ThemeContext';
import LanguageContext from '../context/LanguageContext';

const Header = ({namePokemon,nombre,pokemons}) => {
    const {register,reset,handleSubmit}= useForm();
    const [matches,setMatches]=useState([])
    const {theme,handleTheme,image}=useContext(ThemeContext)
    const {language,handleLanguage}=useContext(LanguageContext)

    const onSubmit=(data)=>{
        let expresion= /^[a-zA-Z-_]+$/;
        const result=pokemons.find(el=>el.name.includes(data.name.toLowerCase()) && expresion.test(el.name))
        console.log(result.name)
        if(result){        
            namePokemon(result.name)
            reset({name:result.name})
        }else{
            window.alert('no se encontro ningun pokemón')
        }

        return data.name
    }

    const OnChange=(name)=>{
        nombre=name.target.value
        let expresion= /^[a-zA-Z-_]+$/;
        const result=pokemons.filter(el=>el.name.includes(nombre.toLowerCase()) && expresion.test(el.name))
        if(nombre===''){
            setMatches(null)
        }else if(result.length <= 10){
            setMatches(result)
        }
        return nombre

    }

    function handleKeyUp(e) {
        const key=e.keyCode
        let data=e.target.value
        switch(key){
          case 13:
            let expresion= /^[a-zA-Z-_]+$/;
            const result=pokemons.find(el=>el.name.includes(data.toLowerCase()) && expresion.test(el.name))
            console.log(result)
            //namePokemon(data.toLowerCase())
            //setMatches(null)
            //reset({name:data})
            break
          default:
        } 
  }

    const handleClick=(e)=>{
        let data=e.target.innerText
        namePokemon(data.toLowerCase())
        setMatches(null)
        reset({name:data})
        return data
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

    return ( <>
        <div className={`py-5 grid grid-cols-5 fixed w-full h-20 ${theme} shadow`}>
            <div className='flex items-center justify-center'>
                <button className='px-4 py-2  rounded hover:opacity-50  text-center text-lg' onClick={handleLanguage}>{language.toUpperCase()}</button>
            </div>
            <div className='col-span-3 flex justify-center'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type='text' placeholder='Pokemon...' autoComplete='off' name='name' className={`w-60 h-10 outline-none rounded-md px-3 text-xl shadow-xl ${theme} `} {...register('name',{
                        required:true,
                        default:''
                    })}
                    onChange={OnChange}
                    onKeyDown={handleKeyUp}
                     />
                    {matches? <div className={`rounded-b-md max-h-28 max-w-60 overflow-y-scroll fixed ${theme}`}>
                    {matches?.map((el)=><div className={`w-64 h-14 flex items-center py-5 first:border  first:gap-px   hover:${theme} hover:opacity-90 last:rounded-b-md`} onClick={handleClick} key={el.id}>
                    <img className='w-10 h-10 mx-3 my-1' src={el.sprites.other.home.front_default}/><p className='pl-2 text-xl'>{capitalizeFirstLetter(el.name)}</p></div>)} </div> : null }
                </form>
            </div>    
            <div className=' flex items-center justify-center'>
                <button className='w-8 h-full ' onClick={handleTheme}><img src={image} alt='dark'/></button>
            </div>
            
        </div>
    </>);
}
 
export default Header;