import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ThemeContext from '../context/ThemeContext';
import LanguageContext from '../context/LanguageContext';

const Card = ({id,name,img,type1,type2,count,weakness,description,height,weight,base_experience,stats}) => {

    const [weak,setWeak]=useState(weakness)
    const [color,setColor]=useState('')
    const [tipos,setTipos]=useState([])
    const {theme}=useContext(ThemeContext)
    const {language}=useContext(LanguageContext)

    const pokemonTypes = [
        { english: "Steel", spanish: "Acero" },
        { english: "Water", spanish: "Agua" },
        { english: "Bug", spanish: "Bicho" },
        { english: "Dragon", spanish: "Dragón" },
        { english: "Electric", spanish: "Eléctrico" },
        { english: "Ghost", spanish: "Fantasma" },
        { english: "Fire", spanish: "Fuego" },
        { english: "Fairy", spanish: "Hada" },
        { english: "Ice", spanish: "Hielo" },
        { english: "Fighting", spanish: "Lucha" },
        { english: "Normal", spanish: "Normal" },
        { english: "Grass", spanish: "Planta" },
        { english: "Psychic", spanish: "Psíquico" },
        { english: "Rock", spanish: "Roca" },
        { english: "Dark", spanish: "Siniestro" },
        { english: "Ground", spanish: "Tierra" },
        { english: "Poison", spanish: "Veneno" },
        { english: "Flying", spanish: "Volador" }
];

/*
    const traducir=(e)=>{
        const weaks=[]
        for (const type of e) {
            let datos=pokemonTypes.find(entry => entry.english.toLowerCase() === type.name)
            weaks.push(datos.spanish)
        }
        return setWeak(weaks)
    }

    */

    const type=(e,i=null)=>{
        const types=[e,i]
        const typos=[]
        types.forEach(type => {
            let datos=pokemonTypes.find(entry => entry.english.toLowerCase() === type)
            datos ? typos.push(datos.spanish) : null
        });     
        return setTipos(typos)
    }

    const background=(type,type2)=>{
            if(type=='water'){                
            setColor('bg-gradient-to-tr from-water-50 via-water-0 to-water-100');
            }else if(type=='fire'){                
                setColor('bg-gradient-to-t from-fire-100 via-fire-0 to-fire-100');
            }else if(type=='grass'){                
                setColor('bg-gradient-to-t from-grass-100 via-grass-0 to-grass-100');
            }else if(type=='flying'){                
                setColor('bg-gradient-to-t from-flying-100 via-flying-0 to-flying-100');
            }else if(type2=='flying' && type=='normal' ){                
                setColor('bg-gradient-to-t from-flying-100 via-flying-0 to-flying-100');
            }else if(type=='normal'){                
                setColor('bg-gradient-to-t from-normal-100 via-normal-0 to-normal-100');
            }else if(type=='bug'){                
                setColor('bg-gradient-to-t from-bug-100 via-bug-0 to-bug-100');
            }else if(type=='dragon'){                
                setColor('bg-gradient-to-t from-dragon-100 via-dragon-0 to-dragon-100');
            }else if(type=='ghost'){                
                setColor('bg-gradient-to-t from-ghost-100 via-ghost-50 to-ghost-100');
            }else if(type=='ice'){                
                setColor('bg-gradient-to-r from-ice-50 via-ice-0 to-ice-50');
            }else if(type=='dark'){                
                setColor('bg-gradient-to-t from-dark-0 via-dark-50 to-dark-0');
            }else if(type=='electric'){                
                setColor('bg-gradient-to-t from-electric-100 via-electric-0 to-electric-0');
            }else if(type=='fairy'){                
                setColor('bg-gradient-to-t from-fairy-0 via-fairy-50 to-fairy-0');
            }else if(type=='fighting'){                
                setColor('bg-gradient-to-t from-fighting-0 via-fighting-50 to-fighting-0');
            }else if(type=='ground'){                
                setColor('bg-gradient-to-t from-ground-0 via-ground-50 to-ground-0');
            }else if(type=='poison'){                
                setColor('bg-gradient-to-t from-poison-0 via-poison-50 to-poison-0');
            }else if(type=='psychic'){                
                setColor('bg-gradient-to-t from-psychic-0 via-psychic-50 to-psychic-0');
            }else if(type=='rock'){                
                setColor('bg-gradient-to-t from-rock-0 via-rock-50 to-rock-0');
            }else if(type=='steel'){                
                setColor('bg-gradient-to-t from-steel-0 via-steel-50 to-steel-0');
            }
        
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }  

function setNumeral(id){
    if(id < 9 ){
        id=`#00${id}`
    } else if (id > 9 && id < 99){
        id=`#0${id}`
    } else{
        id=`#${id}`
    }
    return id
}

useEffect(()=>{
    background(type1,type2)
},[type1])

useEffect(()=>{
    language==='es' ? type1 ?   type(type1,type2) : null :null
}, [language])

useEffect(()=>{
    type1 ? type(type1,type2) : null 
}, [name])




    return ( <>
        <motion.div key={count} initial={{ opacity: 0.1, scale: 1, border:0}} animate={{ opacity: 1, scale: 1, border:0}} transition={{duration: 3,delay: 0.01,ease: [0, 0.6, 0.2, 1.01]}} className={`${color} h-full`}>
            <div className='h-2/5 flex flex-col'>
                <div className='flex items-start justify-between'>
                    <div>
                    <p className='text-3xl pt-1 px-3 font-medium text-slate-950 letter tracking-wider '>{name}</p>
                        <span className={`text-2xl pl-5 italic font-bold text-neutral-600`}>{language==='en' ? capitalizeFirstLetter(type1) : tipos[0] }</span>
                       {language==='en' ? type2 ? <span className={`text-2xl pl-2 italic font-bold text-neutral-600`}>{capitalizeFirstLetter(type2)}</span> : null : <span className={`text-2xl pl-2 italic font-bold text-neutral-600`}>{tipos[1]}</span>}
                    </div>
                    <div>
                        <p className='text-3xl pt-2 px-2 italic text-slate-950'>{setNumeral(id)}</p>
                    </div>
                </div>
                <div className='grid items-center justify-center'>
                    <img src={img} alt={name} className='h-72 w-72'/>
                </div>
            </div>
            <div className={`h-3/5 rounded-none rounded-t-3xl shadow-lg ${theme}`}>
                <div className='pt-5'>
                    <div className='pt-4 pb-2 px-4 w-full font-medium  text-center text-lg letter tracking-wide'>
                        <p>{description}</p>
                    </div>
                    <div className='pt-1 text-center'>
                        <p className='pb-1 text-lg font-medium italic'>{stats[0].base_stat} HP</p>
                        <div className='grid items-center justify-center'>
                            <span className='w-72 border border-dark-theme bg-gradient-to-t from-grass-100 via-grass-0 to-grass-100 rounded h-2 flex justify-center items-center m-0'></span>
                        </div>
                    </div>
                    <div className='pt-2 w-100 grid items-center justify-center'>
                        <div className='grid grid-cols-1 w-80 py-1 rounded   shadow-2xl'>
                            <div className='text-center'>
                                <h2 className='font-bold  text-center text-lg letter tracking-wide pb-1 text-neutral-400 border-b inline-block space-y-10 border-slate-300'>{language==='en' ? 'Atributtes' : 'Atributos'}</h2>
                            <div className='flex justify-between px-3 pt-2'>
                                <h2 className='text-lg italic font-medium w-1/2'>{language==='en' ? 'Height' : 'Altura'}</h2>
                                <p className='text-lg italic font-medium w-1/2'>{height/10} M</p>
                            </div>
                            <div className='flex justify-between px-3 pt-1'>
                                <h2 className='text-lg italic font-medium w-1/2 ' >{language==='en' ? 'Weight' : 'Peso'}</h2>
                                <p className='text-lg italic font-medium w-1/2'>{weight/10} Kg</p>
                            </div>
                            <div className='flex justify-between px-3 pt-1'>
                                <h2 className='text-lg italic font-medium w-1/2'>Base</h2>
                                <p className='text-lg italic font-medium w-1/2'>{base_experience} XP</p>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <ul className='pt-6 font-medium italic text-md'>
                            <li className='flex items-center justify-around '><p className='w-1/2 text-center'>{language==='en' ? 'Attack' : 'Ataque'} {stats[1].base_stat}</p>  <span className='mr-3 w-56 border border-dark-theme bg-gradient-to-t from-fire-100 via-fire-0 to-fire-100 rounded h-2 flex justify-start items-center'></span></li>
                            <li className='flex items-center justify-around'><p className='w-1/2 text-center'>{language==='en' ? 'Defense' : 'Defensa'} {stats[2].base_stat} </p>  <span className='mr-3 w-56 border border-dark-theme bg-gradient-to-t from-water-100 via-water-0 to-water-100 rounded h-2 flex justify-start items-center'></span></li>
                            <li className='flex items-center justify-around'><p className='w-1/2 text-center'>{language==='en' ? 'Special-Attack' : 'Ataque-Especial'} {stats[3].base_stat}</p>  <span className='mr-3 w-56 border border-dark-theme bg-gradient-to-t from-fighting-100 via-fighting-0 to-fighting-100 rounded h-2 flex justify-start items-center'></span></li>
                            <li className='flex items-center justify-around'><p className='w-1/2 text-center'>{language==='en' ? 'Special-Defense' : 'Defensa-Especial'} {stats[4].base_stat}</p>  <span className='mr-3 w-56 border border-dark-theme bg-gradient-to-t from-ice-100 via-ice-0 to-ice-100 rounded h-2 flex justify-start items-center'></span></li>
                            <li className='flex items-center justify-around'><p className='w-1/2 text-center'>{language==='en' ? 'Speed' : 'Velocidad'} {stats[5].base_stat} </p>  <span className='mr-3 w-56 border border-dark-theme bg-gradient-to-t from-electric-100 via-electric-0 to-electric-100 rounded h-2 flex justify-start items-center'></span></li>
                        </ul>
                    </div>
                </div>
                
            </div>

        </motion.div>
    </> );
}
 
export default Card;