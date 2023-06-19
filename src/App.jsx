import Footer from "./components/Footer"
import Calculator from "./components/Form"
import Header from "./components/Header"


function App() {


  return (
    <>
    <div className="h-screen bg-neutral-100">
      <div className="md:h-24 2xl:h-1/6 bg-neutral-100"><Header/></div>
      <div className="md:h-78  2xl:h-4/6 bg-neutral-100"><Calculator/></div>
      <div className=" md:h-48 2xl:h-1/6 bg-neutral-100 "><Footer/></div>
    </div>
    </>
  )
}

export default App
