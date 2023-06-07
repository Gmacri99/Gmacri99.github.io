import Footer from "./components/Footer"
import Calculator from "./components/Form"
import Header from "./components/Header"


function App() {


  return (
    <>
    <div className="h-screen bg-neutral-100">
      <div className="md:h-24 2xl:h-1/6"><Header/></div>
      <div className="md:h-78 2xl:h-4/6"><Calculator/></div>
      <div className=" md:h-64 2xl:h-1/6  "><Footer/></div>
    </div>
    </>
  )
}

export default App
