import React, { useEffect, useState } from 'react'
import { getVagas, getVeiculos } from '../client'
import { Link } from 'react-router-dom'

export default function Home(){
  const [kpis, setKpis] = useState<{vagas:number; veiculos:number}>({vagas:0, veiculos:0})
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let alive = true
    async function load(){
      setLoading(true)
      try{
        const [v, ve] = await Promise.allSettled([getVagas(), getVeiculos()])
        const vagas = v.status==='fulfilled' ? v.value.length : 0
        const veiculos = ve.status==='fulfilled' ? ve.value.length : 0
        if(alive) setKpis({ vagas, veiculos })
      } finally { if(alive) setLoading(false) }
    }
    load();
    return ()=>{ alive = false }
  },[])

  return (
    <section className="stack-lg">
      <div className="hero">
        <div className="hero-left">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Bem-vindo 👋</h1>
              <p className="card-subtitle">Gerencie o pátio com rapidez: cadastre veículos e controle as vagas.</p>
            </div>
            <div className="card-body">
              <div className="kpi-grid">
                <div className="kpi">
                  <div className="label">Vagas cadastradas</div>
                  {loading ? <div className="skeleton sm"/> : <div className="value">{kpis.vagas}</div>}
                </div>
                <div className="kpi">
                  <div className="label">Veículos cadastrados</div>
                  {loading ? <div className="skeleton sm"/> : <div className="value">{kpis.veiculos}</div>}
                </div>
                <div className="kpi">
                  <div className="label">Ocupação (estimada)</div>
                  {loading ? <div className="skeleton sm"/> : <div className="value">{Math.min(kpis.veiculos, kpis.vagas)}</div>}
                </div>
              </div>
              <div className="quick-actions" style={{marginTop:12}}>
                <Link to="/veiculos" className="btn primary">Cadastrar veículo</Link>
                <Link to="/vagas" className="btn">Ver vagas</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Ações rápidas</h2>
              <p className="card-subtitle">Comece pelo que precisa agora</p>
            </div>
            <div className="card-body" style={{display:'grid', gap:8}}>
              <Link to="/veiculos" className="btn">+ Novo veículo</Link>
              <Link to="/vagas" className="btn">+ Nova vaga</Link>
              <Link to="/vagas" className="btn ghost">Relatórios (em breve)</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
