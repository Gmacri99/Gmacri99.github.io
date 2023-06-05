import React, { useEffect, useState } from 'react';
import cola from './assets/imagen.png'

function Calculator() {
  const [arrivalTime, setArrivalTime] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [limit, setLimit] = useState(0);
  const [showNumberInput, setShowNumberInput] = useState(false);
  const [datos,setDatos]=useState({})

                                //FUNCIONES PARA SERVIDOR SIN LIMITE//

// Ro
  const averageUsageOfTheSystem = (arrivalTime, responseTime ) => {
    return (arrivalTime / responseTime)
  }

// Ls  
  const averageNumberOfClientsOnTheSystem = ( arrivalTime, responseTime ) => {
    return (arrivalTime / (responseTime - arrivalTime));
  }

// Lq  
  const averageNumberOfClientsOnTheQueue = ( arrivalTime, responseTime ) => {
    return ((arrivalTime ** 2) / (responseTime * (responseTime - arrivalTime)));
  }

// Ws
  const averageTimeOnSystem = ( arrivalTime, responseTime ) => {
    return (1 / (responseTime - arrivalTime))
}

// Wq
  const averageTimeOnQueue = ( arrivalTime, responseTime ) => {
      return averageNumberOfClientsOnTheQueue( arrivalTime, responseTime ) / arrivalTime
    }

// Po
const chanceTheSystemIsEmpty = ( {usageOfTheSystem} ) => {
    return 1 - usageOfTheSystem;
  }
  
// Pn
  const chanceTheyAreOnSystem = ( {clientsAmount, usageOfTheSystem }) => {
  
    return ((1 - usageOfTheSystem) * (usageOfTheSystem ** clientsAmount))
  }
  
// n + Pn + Pn Accumulated 
  const chanceTheyAreOnSystemDetails = ( {clientsAmount = 100, usageOfTheSystem} ) => {
    const result = []
    let counter = 0;
    let accumulated = 0;
    while (counter < clientsAmount) {
      const chance = chanceTheyAreOnSystem( {clientsAmount: counter, usageOfTheSystem })
      accumulated += chance;
      result.push({ n: counter, Pn: chance.toFixed(4), PnAccumulated: accumulated.toFixed(4) });
      counter++;
  
      if (Number(chance.toFixed(4)) === 0) break;
    }
  
    return result;
  }
  
                                        //FUNCIONES PARA SERVIDOR CON LIMITE//

// Wq con limite
const averageTimeOnQueueWithLimit = ( {usageOfTheSystem, limit, arrivalTime, responseTime }) => {

    return (averageNumberOfClientsOnTheQueueWithLimit ( {usageOfTheSystem, limit, arrivalTime, responseTime} ) / chanceToEnterTheSystem( {arrivalTime, usageOfTheSystem, limit} ))
  }

// Ws con limite
const averageTimeOnSystemWithLimit = ( {usageOfTheSystem, limit, arrivalTime, responseTime} ) => {
    return (averageTimeOnQueueWithLimit ( {usageOfTheSystem, limit, arrivalTime, responseTime }) + (1 / responseTime));
  }

// Lq con limite
const averageNumberOfClientsOnTheQueueWithLimit = ( {usageOfTheSystem, limit, arrivalTime, responseTime} ) => {
  return (averageNumberOfClientsOnTheSystemWithLimit( {usageOfTheSystem, limit }) - (chanceToEnterTheSystem( {arrivalTime, usageOfTheSystem, limit:limit+1 }) / responseTime));
}


// λef
const chanceToEnterTheSystem = ({ arrivalTime, usageOfTheSystem, limit }) => {

  return (arrivalTime * (1 - chanceTheyAreOnSystemWithLimit({ clientsAmount: limit, usageOfTheSystem, limit })));
}


// Ls con limite
const averageNumberOfClientsOnTheSystemWithLimit = ( {usageOfTheSystem, limit }) => {
  limit+=1
  if (usageOfTheSystem !== 1) {
    return ((usageOfTheSystem * (1 - ((limit + 1) * (usageOfTheSystem ** limit)) + (limit * (usageOfTheSystem ** (limit + 1))))) / ((1 - usageOfTheSystem) * (1 - (usageOfTheSystem ** (limit + 1)))))
  }

  return (limit / 2);
}


// Po con limite
const chanceTheSystemIsEmptyWithLimit  = ({ usageOfTheSystem, limit }) => {

    if (usageOfTheSystem !== 1) {
      return ((1 - usageOfTheSystem) / (1 - (usageOfTheSystem ** (limit + 1))));
    }
  
    return (1 / (limit + 1));
  }
  
  // Pn con limite
  const chanceTheyAreOnSystemWithLimit  = ({ clientsAmount, usageOfTheSystem, limit }) => {

    if (clientsAmount <= limit) {
      const chanceIsEmpty = chanceTheSystemIsEmptyWithLimit ({ usageOfTheSystem, limit });
  
      return ((usageOfTheSystem ** clientsAmount) * chanceIsEmpty);
    }
  
    return 0;
  }
  
  // n + Pn + Pn Accumulated  con limite
  const chanceTheyAreOnSystemDetailsWithLimit = ({ usageOfTheSystem, limit }) => {
    const result = []
  
  
    if (usageOfTheSystem !== 1) {
      let counter = 0;
      let accumulated = 0;
      while (counter <= limit+1) {
        const chance = chanceTheyAreOnSystemWithLimit({ clientsAmount: counter, usageOfTheSystem, limit });
        accumulated += chance;
        result.push({ n: counter, Pn: chance.toFixed(4), PnAccumulated: accumulated.toFixed(4) });
        counter++;
      }
    } else {
      const chance = (1 / (limit + 1));
      result.push({ n: 1, Pn: chance, PnAccumulated: chance });
    }
  
    return result;
  }
  

  
const WithLimit=()=>{
    const usageOfTheSystem = averageUsageOfTheSystem( arrivalTime, responseTime );
    const numberOfClientsOnTheSystem = averageNumberOfClientsOnTheSystemWithLimit({usageOfTheSystem, limit });
    const timeOnSystem = averageTimeOnSystemWithLimit( {usageOfTheSystem, limit, arrivalTime, responseTime} );
    const numberOfClientsOnTheQueue = averageNumberOfClientsOnTheQueueWithLimit({usageOfTheSystem, limit, arrivalTime, responseTime });
    const timeOnQueue = averageTimeOnQueueWithLimit({usageOfTheSystem, limit, arrivalTime, responseTime });
    const chanceTheyAre = chanceTheyAreOnSystemDetailsWithLimit({ usageOfTheSystem, limit });
    const vacio=chanceTheSystemIsEmptyWithLimit({usageOfTheSystem,limit})
    setDatos({
        ...datos,
        ρ: usageOfTheSystem.toFixed(4),
        Ls: numberOfClientsOnTheSystem.toFixed(4),
        Lq: numberOfClientsOnTheQueue.toFixed(4),
        Ws: timeOnSystem.toFixed(4),
        Wq: timeOnQueue.toFixed(4),
        Acumulado:chanceTheyAre,
        Vacio:vacio.toFixed(4)
    })
}  


  const WithinLimit=()=>{
    const usageOfTheSystem=averageUsageOfTheSystem(arrivalTime, responseTime)
    const numberOfClientsOnTheSystem=averageNumberOfClientsOnTheSystem( arrivalTime, responseTime );
    const numberOfClientsOnTheQueue = averageNumberOfClientsOnTheQueue( arrivalTime, responseTime );
    const timeOnSystem = averageTimeOnSystem( arrivalTime, responseTime );
    const timeOnQueue = averageTimeOnQueue( arrivalTime, responseTime );
    const chanceTheyAre = chanceTheyAreOnSystemDetails({usageOfTheSystem});
    const vacio=chanceTheSystemIsEmpty({usageOfTheSystem})
    setDatos({
        ...datos,
        ρ: usageOfTheSystem.toFixed(4),
        Ls: numberOfClientsOnTheSystem.toFixed(4),
        Lq: numberOfClientsOnTheQueue.toFixed(4),
        Ws: timeOnSystem.toFixed(4),
        Wq: timeOnQueue.toFixed(4),
        Acumulado:chanceTheyAre,
        Vacio:vacio.toFixed(4)
    })
  }



  const handleClick=(e)=>{
    e.preventDefault()
    if(arrivalTime===0 || responseTime===0 ){
        window.alert("Debe ingresar los respectivos valores de λ y μ")
    }else if(arrivalTime===0 || responseTime===0 ||  showNumberInput){
        limit<1 ? window.alert("Debe ingresar los respectivos valores de λ, μ y el limite de cola") :  WithLimit()
        
    } else{
        !showNumberInput ? WithinLimit() : WithLimit()
        console.log(arrivalTime,responseTime)
    }
  }
  
  function handleNum1Change(event) {
    setArrivalTime(Number(event.target.value));
  }

  function handleNum2Change(event) {
    setResponseTime(Number(event.target.value));
  }

  function handleNum3Change(event) {
    setLimit(Number(event.target.value));
  }

  function handleCheckboxChange(event) {
    setShowNumberInput(event.target.checked);
  }

  useEffect(() => {
  }, [datos])


  return (
    <>
    <div className='h-full pt-3'>
    <div className='grid md:grid md:grid-cols-2 lg:grid lg:grid-cols-5 bg-neutral-100 sm:px-3'>

        <div className='bg-slate-100 flex flex-col lg:col-span-2 rounded mb-3 shadow-xl sm:ml-2'>
        <div className='bg-sky-800 text-center text-lg py-2 rounded text-white tracking-wider'>
            <h2> Un Solo servidor</h2>
        </div>
            <form>
                <div className='grid justify-center py-1 '>
                <label className='px-4 text-center py-2'>Tiempo de Llegada ( λ ):</label>
                <input type="number" value={arrivalTime} onChange={handleNum1Change} step="0" min={1} placeholder='λ...' className='rounded sm:w-72 sm:pl-2 text-lg outline-none' required/>
                </div>
                <div className='grid justify-center py-1'>
                <label className='px-4 text-center py-2'>Tiempo de Atención ( μ ):</label>
                <input type="number" value={responseTime} onChange={handleNum2Change} min={1} placeholder='μ...' className='rounded sm:w-72 sm:pl-2 text-lg outline-none' required/>
                </div>
                <div className='grid justify-center py-3'>
                <div className=' flex items-center text-center w-full'>
                    <label className='px-3'>Posee limite la cola?</label>
                    <input type='checkbox' checked={showNumberInput} onChange={handleCheckboxChange} />
                </div>
                {showNumberInput && (
                    <div className='grid justify-center py-1'>
                        <label className='px-4 text-center py-2'>Limite de espera:</label>
                        <input type="number" value={limit} onChange={handleNum3Change} min={1} className='rounded W-64 sm:w-72 text-center text-lg outline-none' />
                    </div>
                )}
                <br/>
                </div>
                <div className='pt-2 pb-2 w-full flex justify-center'>
                <button onClick={handleClick} className='bg-sky-800 px-5 py-2 rounded-lg text-white text-lg font-medium tracking-widest'>Calcular</button>
                </div>
            </form>    
        </div>

        <div className='lg:col-span-1 flex justify-center'>
                <div className='py-3 px-2'>
                    <div className='grid grid-cols-4 border border-black w-48 rounded'>
                        <p className='border-r border-black text-center bg-orange-200 text-lg font-bold px-2'>ρ:</p> 
                        <p className='px-2'>{datos.ρ}</p>
                    </div>
                    <div className='grid grid-cols-4 border border-black my-4 w-48 rounded'>
                        <p className='border-r border-black text-center bg-yellow-200 text-lg font-bold px-2'>Ls:</p> 
                        <p className='px-2'>{datos.Ls}</p>
                    </div>
                    <div className='grid grid-cols-4 border border-black my-4 w-48 rounded'>
                        <p className='border-r border-black text-center bg-red-200 text-lg font-bold px-2'>Lq:</p> 
                        <p className='px-2'>{datos.Lq}</p>
                    </div>
                    <div className='grid grid-cols-4 border border-black my-4 w-48 rounded'>
                        <p className='border-r border-black text-center bg-green-200 text-lg font-bold px-2'>Ws:</p> 
                        <p className='px-2'>{datos.Ws}</p>
                    </div>
                    <div className='grid grid-cols-4 border border-black my-4 w-48 rounded'>
                        <p className='border-r border-black text-center bg-blue-200 text-lg font-bold px-2'>Wq:</p> 
                        <p className='px-2'>{datos.Wq}</p>
                    </div>
                    <div className='grid grid-cols-4 border border-black mt-4 w-48 rounded'>
                        <p className='border-r border-black text-center bg-slate-200 text-lg font-bold px-2'>Po:</p> 
                        <p className='px-2'>{datos.Vacio}</p>
                    </div>
                </div>
        </div>
            
        <div className='col-span-1 md:col-span-2 lg:col-span-2 pt-3 h-96 overflow-y-scroll sm:pr-5 '>
                <div className='grid grid-cols-5 w-full bg-green-200 text-center border border-black'>
                    <p className='border-x col-span-1 border-black'>N</p>
                    <p className='border-x col-span-2 border-black'>Pn</p>
                    <p className='col-span-2'>Acumulado</p>
                </div>
                <div className='flex flex-col w-full border border-black '>
                    {datos.Acumulado?.map((el)=><div key={el.n} className=' text-sm grid grid-cols-5 text-center border-b border-black'><p className='border-x col-span-1 border-black'>{el.n}</p> <p className='border-x col-span-2 overflow-hidden px-1 border-black'>{el.Pn}</p> <p className='col-span-2 overflow-hidden px-1'>{el.PnAccumulated}</p></div>)}
                </div>
        </div>


    </div>
    <div className=' md:grid lg:grid lg:grid-cols-2 bg-neutral-100'>
        <div className='flex justify-center w-full items-center text-center tracking-wider leading-4 px-5 '>
            <p className='sm:text-sm md:text-lg 2xl:text-2xl'>La teoría de colas es una herramienta matemática que se utiliza para estudiar las colas y las líneas de espera. 
                Esta teoría se utiliza para resolver problemas de la vida real, como el tráfico. 
                La teoría de colas permite estudiar de manera científica el tiempo que los clientes deben esperar cuando solicitan un servicio.</p>
        </div>
        <div className='flex w-full justify-center'>
            <img src={cola}/> 
        </div>   
    </div>
    </div>
    </>
  );
}

export default Calculator;