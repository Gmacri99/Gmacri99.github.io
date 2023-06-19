import React, { useEffect, useState } from 'react';
import cola from './assets/imagen.png'
import Pdf from './Pdf';
import { pdf } from '@react-pdf/renderer';


function Calculator() {
  const [arrivalTime, setArrivalTime] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [servers, setServers] = useState(0);
  const[lambdaEfectivo,setLambdaEfectivo]= useState(0)
  const [limit, setLimit] = useState(0);
  const [showNumberInput, setShowNumberInput] = useState(false);
  const [datos,setDatos]=useState({})

                                //FUNCIONES PARA SERVIDOR SIN LIMITE//

const factorial = n => n ? (n * factorial(n - 1)) : 1;


// Ro
  const averageUsageOfTheSystem = (arrivalTime, responseTime ) => {
    return (arrivalTime / responseTime)
  }



// Lq
const averageNumberOfClientsOnTheQueue = ({ arrivalTime, responseTime, usageOfTheSystem, servers }) => {
  return (((servers * usageOfTheSystem) / ((servers - usageOfTheSystem) ** 2)) * chanceTheyAreOnTheSystem({ clientsAmount: servers, arrivalTime, responseTime, usageOfTheSystem, servers }))
}

// Ls
const averageNumberOfClientsOnTheSystem = ({ arrivalTime, responseTime, usageOfTheSystem, servers }) => {
  return (averageNumberOfClientsOnTheQueue({ arrivalTime, responseTime, usageOfTheSystem, servers }) + usageOfTheSystem)
}

// Ws
const averageTimeOnSystem = ( {arrivalTime, responseTime, usageOfTheSystem, servers} ) => {
  return (averageTimeOnQueue( {arrivalTime, responseTime, usageOfTheSystem, servers} ) + (1 / responseTime));
}

// Wq
const averageTimeOnQueue = ( {arrivalTime, responseTime, usageOfTheSystem, servers} ) => {
  return (averageNumberOfClientsOnTheQueue( {arrivalTime, responseTime, usageOfTheSystem, servers} ) / arrivalTime)
}


// Po
const chanceTheSystemIsEmpty = ({usageOfTheSystem, servers }) => {
  let counter = 0;
  const CONSTANT_CHANCE = (((usageOfTheSystem ** servers) / (factorial(servers) * (1 - (usageOfTheSystem / servers)))));
  let totalSumChance = 0;
  while (counter < servers) {
    totalSumChance += ((usageOfTheSystem ** counter) / factorial(counter));
    counter++;
  }

  const result = (totalSumChance + CONSTANT_CHANCE) ** -1;
  return result;
}
// Pn
const chanceTheyAreOnTheSystem = ({ clientsAmount, arrivalTime, responseTime, usageOfTheSystem, servers }) => {

  if (clientsAmount > servers) {
    return (((usageOfTheSystem ** clientsAmount)) / ((servers ** (clientsAmount - servers)) * factorial(servers)) * chanceTheSystemIsEmpty({ arrivalTime, responseTime, usageOfTheSystem, servers }))
  }

  return (((usageOfTheSystem ** clientsAmount)) / (factorial(clientsAmount)) * chanceTheSystemIsEmpty({ arrivalTime, responseTime, usageOfTheSystem, servers }))

}

// n + Pn + Pn Accumulated 
const chanceTheyAreOnSystemDetails = ({ clientsAmount = 100, arrivalTime, responseTime, usageOfTheSystem, servers }) => {
  const result = []
  let counter = 0;
  let accumulated = 0;
  while (counter < clientsAmount) {
    const chance = chanceTheyAreOnTheSystem({ clientsAmount: counter, arrivalTime, responseTime, usageOfTheSystem, servers })
    accumulated += chance;
    result.push({ n: counter, Pn: chance, PnAccumulated: accumulated });
    counter++;

    if (Number(chance.toFixed(4)) === 0){
      setLambdaEfectivo(arrivalTime*(1-chance))
      break;
    } 
  }

  return result;
}
                                        //FUNCIONES PARA SERVIDOR CON LIMITE//

// Wq con limite
const averageTimeOnQueueWithLimit = ({ arrivalTime, responseTime, usageOfTheSystem, servers, limit }) => {
  return (averageNumberOfClientsOnTheQueueWithLimit({ arrivalTime, responseTime, servers, limit, usageOfTheSystem }) / arrivalTime);
}

// Ws con limite
const averageTimeOnSystemWithLimit = ({ arrivalTime, responseTime, usageOfTheSystem, servers, limit }) => {
  return (averageTimeOnQueueWithLimit({ arrivalTime, responseTime, servers, limit, usageOfTheSystem }) + (1 / responseTime));
}

// Lq con limite
const averageNumberOfClientsOnTheQueueWithLimit = ({ arrivalTime, responseTime, usageOfTheSystem, servers, limit }) => {
  if (usageOfTheSystem / servers === 1) {
    return (chanceTheSystemIsEmptyWithLimit({ arrivalTime, responseTime, servers, limit, usageOfTheSystem }) * (((usageOfTheSystem ** servers) * (limit - servers) * (limit - servers + 1)) / (2 * factorial(servers))))
  }

  return (chanceTheSystemIsEmptyWithLimit({ arrivalTime, responseTime, servers, limit, usageOfTheSystem }) * ((usageOfTheSystem ** (servers + 1)) / (factorial(servers - 1) * ((servers - usageOfTheSystem) ** 2))))
}

// Ls con limite
const averageNumberOfClientsOnTheSystemWithLimit = ({ arrivalTime, responseTime, usageOfTheSystem, servers, limit }) => {
  return (averageNumberOfClientsOnTheQueueWithLimit({ arrivalTime, responseTime, servers, limit, usageOfTheSystem }) + (chanceToEnterTheSystem({ arrivalTime, responseTime, servers, limit, usageOfTheSystem }) / responseTime))
}





// Po
const chanceTheSystemIsEmptyWithLimit = ({usageOfTheSystem, servers, limit }) => {
  let CONSTANT_CHANCE = 0;
  if (usageOfTheSystem / servers === 1) {
    CONSTANT_CHANCE = (((usageOfTheSystem ** servers) / factorial(servers)) * (limit - servers + 1));
  } else {
    CONSTANT_CHANCE = (((usageOfTheSystem ** servers) * ((1 - (usageOfTheSystem / servers) ** (limit - servers + 1))) / (factorial(servers) * (1 - (usageOfTheSystem / servers)))))
  }

  let counter = 0;
  let totalSumChance = 0;
  while (counter < servers) {
    totalSumChance += ((usageOfTheSystem ** counter) / factorial(counter))
    counter++;
  }

  return (totalSumChance + CONSTANT_CHANCE) ** -1;
}

// Pn

const chanceTheyAreOnTheSystemWithLimit = ({ clientsAmount, arrivalTime, responseTime, usageOfTheSystem, servers, limit }) => {
  if (clientsAmount > 0 && clientsAmount <= servers) {
    return (((usageOfTheSystem ** clientsAmount) / (factorial(clientsAmount))) * chanceTheSystemIsEmptyWithLimit({ arrivalTime, responseTime, usageOfTheSystem, servers, limit }))
  } else {
    return (((usageOfTheSystem ** clientsAmount) / ((factorial(servers)) * (servers ** (clientsAmount - servers)))) * chanceTheSystemIsEmptyWithLimit({ arrivalTime, responseTime, usageOfTheSystem, servers, limit }))
  }
}

// λef
const chanceToEnterTheSystem = ({ arrivalTime, responseTime, usageOfTheSystem, servers, limit }) => {
  return (arrivalTime * (1 - (chanceTheyAreOnTheSystemWithLimit({ arrivalTime, responseTime, servers, limit, usageOfTheSystem, clientsAmount: limit }))))
}


// Pw
const chanceToWaitOutside = ({ arrivalTime, responseTime, usageOfTheSystem, servers, limit }) => {
  return ((1 / factorial(servers)) * (usageOfTheSystem ** servers) * (servers / (servers - usageOfTheSystem)) * chanceTheSystemIsEmptyWithLimit({ arrivalTime, responseTime, usageOfTheSystem, servers, limit }))
}


// n + Pn + Pn Accumulated 
const chanceTheyAreOnSystemDetailsWithLimit = ({ clientsAmount = 100, arrivalTime, responseTime, usageOfTheSystem, servers, limit }) => {
  const result = []
  let counter = 0;
  let accumulated = 0;
  while (counter <= clientsAmount) {
    const chance = chanceTheyAreOnTheSystemWithLimit({ clientsAmount: counter, arrivalTime, responseTime, usageOfTheSystem, servers, limit })
    accumulated += chance;
    result.push({ n: counter, Pn: chance, PnAccumulated: accumulated });
    counter++;

    // if (Number(chance.toFixed(4)) === 0) break;
  }

  return result;
}

  
const WithLimit=()=>{
    const usageOfTheSystem = averageUsageOfTheSystem( arrivalTime, responseTime );
    const timeOnSystem = averageTimeOnSystemWithLimit({ arrivalTime, responseTime, usageOfTheSystem, servers, limit} );
    const numberOfClientsOnTheQueue = averageNumberOfClientsOnTheQueueWithLimit( {arrivalTime, responseTime, usageOfTheSystem, servers, limit} );
    const timeOnQueue = averageTimeOnQueueWithLimit( {arrivalTime, responseTime, usageOfTheSystem, servers, limit} );
    const numberOfClientsOnTheSystem = averageNumberOfClientsOnTheSystemWithLimit( {arrivalTime, responseTime, usageOfTheSystem, servers, limit} );
    const chanceTheyAreOnDetails = chanceTheyAreOnSystemDetailsWithLimit({ clientsAmount: limit, arrivalTime, responseTime, usageOfTheSystem, servers, limit });
    const chanceToWait = chanceToWaitOutside({ arrivalTime, responseTime, usageOfTheSystem, servers, limit });
    const vacio=chanceTheSystemIsEmptyWithLimit({usageOfTheSystem, servers, limit });
    const landaEfectivo=chanceToEnterTheSystem({arrivalTime, responseTime, usageOfTheSystem, servers, limit})
    setDatos({
        ...datos,
        ρ: usageOfTheSystem.toFixed(4),
        Ls: numberOfClientsOnTheSystem.toFixed(4),
        Lq: numberOfClientsOnTheQueue.toFixed(4),
        Ws: timeOnSystem.toFixed(4),
        Wq: timeOnQueue.toFixed(4),
        Acumulado:chanceTheyAreOnDetails,
        Pw:chanceToWait.toFixed(4),
        Vacio:vacio.toFixed(4),
        λef:landaEfectivo.toFixed(4)
    })
}  


  const WithinLimit=()=>{
    const usageOfTheSystem = averageUsageOfTheSystem( arrivalTime, responseTime );
    const timeOnSystem = averageTimeOnSystem({ arrivalTime, responseTime, usageOfTheSystem, servers });
    const numberOfClientsOnTheQueue = averageNumberOfClientsOnTheQueue({ arrivalTime, responseTime, usageOfTheSystem, servers });
    const timeOnQueue = averageTimeOnQueue({ arrivalTime, responseTime, usageOfTheSystem, servers });
    const numberOfClientsOnTheSystem = averageNumberOfClientsOnTheSystem({ arrivalTime, responseTime, usageOfTheSystem, servers });
    const chanceTheyAreOnDetails = chanceTheyAreOnSystemDetails({ arrivalTime, responseTime, usageOfTheSystem, servers });
    const vacio=chanceTheSystemIsEmpty({usageOfTheSystem,servers})
    setDatos({
        ...datos,
        ρ: usageOfTheSystem.toFixed(4),
        Ls: numberOfClientsOnTheSystem.toFixed(4),
        Lq: numberOfClientsOnTheQueue.toFixed(4),
        Ws: timeOnSystem.toFixed(4),
        Wq: timeOnQueue.toFixed(4),
        Acumulado:chanceTheyAreOnDetails,
        Vacio:vacio.toFixed(4),
        λef:0
      
    })
    setLimit(0)
  }



  const handleClick=(e)=>{
    e.preventDefault()
    if(arrivalTime===0 || responseTime===0 || servers===0){
        window.alert("Debe ingresar los respectivos valores de λ, μ, C")
    }else if(arrivalTime===0 || responseTime===0 ||servers===0 ||  showNumberInput){
        limit<1 ? window.alert("Debe ingresar los respectivos valores de λ, μ, C y el limite de cola") :  WithLimit()
    } else if(arrivalTime===responseTime){
      window.alert("λ no puede ser igual a μ") 
  } else if(arrivalTime>responseTime*servers){
    window.alert("λ no puede ser mayor a μ * C") 
} 
    else{
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

  function handleNum4Change(event) {
    setServers(Number(event.target.value));
  }

  function handleNum3Change(event) {
    setLimit(Number(event.target.value));
  }

  const downloadPdf = async () => {
    const blob = await pdf(<Pdf limit={limit===0 ? "No" : limit} acumulado={datos.Acumulado} C={servers} miu={responseTime} λef={limit===0 ?'': 'Lambdaef: '+datos.λef  }  lambda={arrivalTime} rho={datos.ρ} ls={datos.Ls} lq={datos.Lq} ws={datos.Ws} wq={datos.Wq}/>).toBlob();
    const pdfURL = URL.createObjectURL(blob);
    window.open(pdfURL, '_blank');
  };


  const handleClick2=(e)=>{
    e.preventDefault()
    downloadPdf() 
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
            <h2> Multiples Servidores</h2>
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
                <div className='grid justify-center py-1'>
                <label className='px-4 text-center py-2'>Nro Servidores:</label>
                <input type="number" value={servers} onChange={handleNum4Change} min={1} placeholder='0' className='rounded sm:w-72 sm:pl-2 text-lg outline-none' required/>
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
                {datos.ρ ? 
                <button onClick={handleClick2} className='bg-sky-800 px-5 py-2 rounded-lg text-white text-lg font-medium tracking-widest ml-2'>Descargar PDF</button>: null} 
    
                </div>
            </form>    
        </div>

        <div className='lg:col-span-1 flex justify-center'>
                <div className='py-3 px-2'>
                    <div className='grid grid-cols-4 border border-black w-48 rounded'>
                        <p className='border-r border-black text-center bg-orange-200 text-lg font-bold px-2'>ρ</p> 
                        <p className='px-2'>{datos.ρ}</p>
                    </div>
                    <div className='grid grid-cols-4 border border-black my-4 w-48 rounded'>
                        <p className='border-r border-black text-center bg-yellow-200 text-lg font-bold px-2'>Ls</p> 
                        <p className='px-2'>{datos.Ls}</p>
                    </div>
                    <div className='grid grid-cols-4 border border-black my-4 w-48 rounded'>
                        <p className='border-r border-black text-center bg-red-200 text-lg font-bold px-2'>Lq</p> 
                        <p className='px-2'>{datos.Lq}</p>
                    </div>
                    <div className='grid grid-cols-4 border border-black my-4 w-48 rounded'>
                        <p className='border-r border-black text-center bg-green-200 text-lg font-bold px-2'>Ws</p> 
                        <p className='px-2'>{datos.Ws}</p>
                    </div>
                    <div className='grid grid-cols-4 border border-black my-4 w-48 rounded'>
                        <p className='border-r border-black text-center bg-blue-200 text-lg font-bold px-2'>Wq</p> 
                        <p className='px-2'>{datos.Wq}</p>
                    </div>
                    <div className='grid grid-cols-4 border border-black mt-4 w-48 rounded'>
                        <p className='border-r border-black text-center bg-slate-200 text-lg font-bold px-2'>Po</p> 
                        <p className='px-2'>{datos.Vacio}</p>
                    </div>
                    {showNumberInput ? 
                    <div className='grid grid-cols-4 border border-black mt-4 w-48 rounded'>
                        <p className='border-r border-black text-center bg-neutral-200 text-lg font-bold px-2'>λef</p> 
                        <p className='px-2'>{datos.λef}</p>
                    </div> : null}

                </div>
        </div>
        <div className='col-span-1 md:col-span-2 lg:col-span-2 pt-3 h-96 overflow-y-scroll sm:pr-5 '>
                <div className='grid grid-cols-5 w-full bg-green-200 text-center border border-black'>
                    <p className='border-x col-span-1 border-black'>N</p>
                    <p className='border-x col-span-2 border-black'>Pn</p>
                    <p className='col-span-2'>Acumulado</p>
                </div>
                <div className='flex flex-col w-full border border-black '>
                    {datos.Acumulado?.map((el)=><div key={el.n} className=' text-sm grid grid-cols-5 text-center border-b border-black'><p className='border-x col-span-1 border-black'>{el.n}</p> <p className='border-x col-span-2 overflow-hidden px-1 border-black'>{el.Pn.toFixed(4)}</p> <p className='col-span-2 overflow-hidden px-1'>{el.PnAccumulated.toFixed(4)}</p></div>)}
                </div>
                
        </div>


    </div>
    <div className='pt-4 md:grid lg:grid lg:grid-cols-2 bg-neutral-100'>
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

