import React, { useState, useEffect,useCallback  } from 'react'
import Head from './Component/Head/Head'
import "./App.css"
import Total_value from './Component/Total_value/Total_value'
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";



// import Particles from "react-particles";
// import Particles from "react-particles";


// import Navbar from "../components/Navbar"
// import Movies from "../components/Movies"
// import ModalMovie from "../components/ModalMovie"
// import {getMovies} from "../api"
// import StarfieldAnimation from 'react-starfield-animation'





import 'react-toastify/dist/ReactToastify.css';
import NftStaking from './Component/nftStaking/NftStaking';
import { Route, Routes } from 'react-router-dom';
import Main_home_page from './Component/Main_home_page/Main_home_page';
import { Footer } from 'antd/es/layout/layout';
import Footer_up from './Component/Footer_up/Footer_up';

function App() {
  const [showw, setShoww] = useState(false);
  const handleClosee = () => setShoww(false);
  const handleShoww = () => setShoww(true);
  let { provider, acc, providerType, web3 } = useSelector(
    (state) => state.connectWallet
  );

  const particlesInit = useCallback(async engine => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
}, []);

const particlesLoaded = useCallback(async container => {
    await console.log(container);
}, []);

  return (
    <div className='' >
      <div className='back'>
    
    

        
        <ToastContainer />
        <Head handleClosee={handleClosee} handleShoww={handleShoww} setShoww={setShoww} showw={showw} />
        <Routes>
          <Route path='/' element={<Main_home_page/>} />
          {/* <Route path='/Nft_Staking' element={<NftStaking setShoww={setShoww} />} /> */}
        </Routes>
        <Footer_up/>



      </div>
    </div>
  )
}

export default App
