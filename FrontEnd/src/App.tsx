import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Vagas from './pages/Vagas'
import Veiculos from './pages/Veiculos'

export default function App(){
  return (
    <div>
      <header>
        <div className="container" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <h1 style={{fontSize:18, margin:0}}>🚗 Estacionamento</h1>
          <nav>
            <NavLink to="/" end>Início</NavLink>
            <NavLink to="/vagas">Vagas</NavLink>
            <NavLink to="/veiculos">Veículos</NavLink>
          </nav>
        </div>
      </header>
      <main>
        <div className="container" style={{paddingTop:20}}>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/vagas" element={<Vagas/>}/>
            <Route path="/veiculos" element={<Veiculos/>}/>
            <Route path="*" element={<Navigate to="/"/>}/>
          </Routes>
        </div>
      </main>
    </div>
  )
}
