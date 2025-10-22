import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Vagas from './pages/Vagas'
import Veiculos from './pages/Veiculos'

export default function App(){
  return (
    <div className="container">
      <header className="header">
        <div className="brand">Estacionamento</div>
        <nav className="nav">
          <NavLink to="/" end className={({isActive})=>`nav-link ${isActive?'active':''}`}>Home</NavLink>
          <NavLink to="/vagas" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Vagas</NavLink>
          <NavLink to="/veiculos" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Veículos</NavLink>
        </nav>
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/vagas" element={<Vagas/>} />
          <Route path="/veiculos" element={<Veiculos/>} />
        </Routes>
      </main>
      <footer className="footer">© {new Date().getFullYear()} Estacionamento</footer>
    </div>
  )
}
