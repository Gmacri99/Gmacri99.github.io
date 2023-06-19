import React from 'react'
import unimar from './assets/Unimar.png'
const Footer = () => {
  return (
    <div className='grid grid-cols-3 2xl:grid 2xl:grid-cols-3 h-full bg-neutral-100 pt-12 mt-24'>
        <div className='h-32 flex justify-center items-center px-3 w-full'>
            <img src={unimar} className='sm:h-36 sm:w-36 2xl:h-48 2xl:w-48'/>
        </div>
        <div className='flex justify-start items-center text-lg'>
            <div className='grid'>
                <p className='font-bold'>Realizado por: </p>
                <div>
                    <p>Sebastian Perez C.I: 29.680.369 </p>
                    <p>Gianny Macri C.I: 26.887.744 </p>
                </div>
            </div>    
        </div>
        <div className='pt-1 text-sm px-2 2xl:flex 2xl:flex-col 2xl:justify-center 2xl:items-center lg:text-xl'>
            <div className='py-1'>
               <h2 className='font-bold'>Para mayor información:</h2> 
            </div>
            <div className='flex justify-start items-center'>
                <ul>
                    <li className='py-1'><a href='https://www.youtube.com/watch?v=t3x2KinUqAA' target='_blank'>¿Que plantea la teoría de las colas?</a></li>
                    <li className='py-1'><a href='https://www.youtube.com/watch?v=CsQFXSuS2o8' target='_blank'>Caracteristicas de la teoría de las colas</a></li>
                    <li className='py-1'><a href='https://www.youtube.com/watch?v=dqEGXm9eh8k' target='_blank'>Como simular la teoría de las colas en Excel</a></li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Footer