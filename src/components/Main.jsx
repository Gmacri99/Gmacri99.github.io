import { useState,useEffect, useRef, useContext } from 'react';
import Card from './Card';
import Header from './Header';
import { Loader } from './loader';
import LanguageContext from '../context/LanguageContext';

function MainPokedex() {
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [contador,setContador]=useState(1)
  const [pokemon, setPokemon]=useState(null)
  const [pokemonDescripcion, setPokemonDescripcion]=useState(null)
  const [pokemonDamage, setpokemonDamage]=useState(null)
  const [allpokemon, setAllPokemon]=useState([])
  const {language}=useContext(LanguageContext)
  const contentRef=useRef(null)

  const  GetPokemons=async()=>{
    let res= await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`);
    let data= await res.json()

    data.results.forEach( async(el) => {
      let res= await fetch(`https://pokeapi.co/api/v2/pokemon/${el.name}`);
      let data= await res.json()
      setAllPokemon(currentList=> [...currentList, data])
      await allpokemon.sort((a, b) => a.id - b.id)

  });

  }

  const descripcion=async(url,language)=>{
    let res= await fetch(url);
    let data= await res.json()
    let datos=data.flavor_text_entries.find(entry => entry.version.name === 'x' && entry.language.name === language).flavor_text
    setPokemonDescripcion(datos)
  }

const types=async(url)=>{
  let res= await fetch(url);
  let data= await res.json()
  let datos=data.damage_relations
  setpokemonDamage(datos)
}

  const Search=(name)=>{

    const data=allpokemon.filter(pokemon=> pokemon.name==name)
      setPokemon(data[0])
      setContador(data[0].id)
  }

  const Pokemon=async(id)=>{
    const data=allpokemon?.filter(pokemon=> pokemon.id==id)
    setPokemon(data[0])
    pokemon ? descripcion(pokemon.species.url, language) : null
    pokemon ? types(pokemon.types[0].type.url) : null
  }

  const namePokemon=(datoshijo)=>{
    Search(datoshijo)
  }

  function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

  function handleKeyUp(e) {
      const key=e.keyCode
      switch(key){
        case 37:
          if(contador > 1){
            setContador(contador-1)
          }
          break;
        case 39:
          if(contador < allpokemon.length){
            setContador(contador+1)
          }
          break;
        default:
      } 
}

// the required distance between touchStart and touchEnd to be detected as a swipe
const minSwipeDistance = 50 

const onTouchStart = (e) => {
  setTouchEnd(null) 
  setTouchStart(e.targetTouches[0].clientX)
}
const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

const onTouchEnd = () => {
  if (!touchStart || !touchEnd) return
  const distance = touchStart - touchEnd
  const isLeftSwipe = distance > minSwipeDistance
  const isRightSwipe = distance < -minSwipeDistance
  if (isLeftSwipe || isRightSwipe){ 
    if(isLeftSwipe){
      if(contador < allpokemon.length){
      setContador(contador+1)
    }
    }else{ 
      if(contador > 1){
      setContador(contador-1)
    }
    }
  }
}

  useEffect(()=>{
      GetPokemons()
  },[])

  useEffect(()=>{
    Pokemon(contador)
    pokemon ? descripcion(pokemon.species.url,language) : null
  },[allpokemon])

  useEffect(()=>{
    Pokemon(contador)
    pokemon ? descripcion(pokemon.species.url,language) : null
  },[contador])

  useEffect(()=>{
    Pokemon(contador)
    pokemon ? descripcion(pokemon.species.url,language) : null
  },[pokemon])

  useEffect(()=>{
    Pokemon(contador)
    pokemon ? descripcion(pokemon.species.url,language) : null
  },[language])


  return (
    <div className='grid h-screen relative'>
    <Header namePokemon={namePokemon} pokemons={allpokemon} />
          <div ref={contentRef} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}  onKeyDown={handleKeyUp} tabIndex="0" className='mt-20 w-full screen'>
              {pokemon ? <Card name={capitalizeFirstLetter(pokemon.name)} stats={pokemon.stats} id={pokemon.id} count={contador}  height={pokemon.height} weight={pokemon.weight} base_experience={pokemon.base_experience} weakness={pokemonDamage ? pokemonDamage.double_damage_from : null} img={pokemon.sprites.other.home.front_default} type1={pokemon.types[0].type.name} type2={pokemon?.types.length > 1 ? pokemon.types[1].type.name : null} description={pokemonDescripcion}/>  : <div><Loader/> </div>}
          </div>
    </div>
  )
}

export default MainPokedex
