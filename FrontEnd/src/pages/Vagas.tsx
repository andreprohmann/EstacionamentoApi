import { useEffect, useState } from 'react'
import api from '../api/client'
import type { Vaga } from '../types'

export default function Vagas(){
  const [vagas, setVagas] = useState<Vaga[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const [form, setForm] = useState<{numero: string, nivel?: string, ativa: boolean}>({ numero:'', nivel:'', ativa: true })
  const [editId, setEditId] = useState<number | null>(null)

  async function load(){
    setLoading(true)
    setError('')
    try {
      const data = await api.listVagas()
      setVagas(data)
    } catch (e:any){ setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  async function create(){
    if(!form.numero.trim()) { alert('Número é obrigatório'); return }
    try{
      await api.createVaga({ numero: form.numero.trim(), nivel: form.nivel || undefined, ativa: form.ativa })
      setForm({ numero:'', nivel:'', ativa:true })
      await load()
    }catch(e:any){ alert(e.message) }
  }

  async function startEdit(v: Vaga){
    setEditId(v.id)
    setForm({ numero: v.numero, nivel: v.nivel || '', ativa: v.ativa })
  }

  async function update(){
    if(editId==null) return
    try{
      await api.updateVaga(editId, { numero: form.numero, nivel: form.nivel, ativa: form.ativa })
      setEditId(null)
      setForm({ numero:'', nivel:'', ativa:true })
      await load()
    }catch(e:any){ alert(e.message) }
  }

  async function remove(id:number){
    if(!confirm('Excluir esta vaga?')) return
    try{ await api.deleteVaga(id); await load() }catch(e:any){ alert(e.message) }
  }

  return (
    <div className="panel">
      <h2 style={{marginTop:0}}>Vagas</h2>

      <div className="row">
        <div>
          <div className="field">
            <label>Número</label>
            <input value={form.numero} onChange={e=>setForm({...form, numero:e.target.value.toUpperCase()})} placeholder="Ex: A-01" />
          </div>
          <div className="field">
            <label>Nível</label>
            <input value={form.nivel} onChange={e=>setForm({...form, nivel:e.target.value})} placeholder="Ex: Térreo, -1..." />
          </div>
          <div className="field">
            <label>
              <input type="checkbox" checked={form.ativa} onChange={e=>setForm({...form, ativa:e.target.checked})}/> Ativa
            </label>
          </div>
          {editId==null ? (
            <button className="btn primary" onClick={create}>Criar vaga</button>
          ) : (
            <div className="flex">
              <button className="btn ok" onClick={update}>Salvar</button>
              <button className="btn" onClick={()=>{ setEditId(null); setForm({numero:'', nivel:'', ativa:true}) }}>Cancelar</button>
            </div>
          )}
        </div>
        <div>
          {loading ? <p>Carregando...</p> : error ? <p style={{color:'#fca5a5'}}>{error}</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Número</th>
                  <th>Nível</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {vagas.map(v => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.numero}</td>
                    <td>{v.nivel || '-'}</td>
                    <td>
                      {v.ativa ? <span className="status ok">Ativa</span> : <span className="status bad">Inativa</span>}
                    </td>
                    <td>
                      <button className="btn" onClick={()=>startEdit(v)}>Editar</button>
                      <button className="btn danger" onClick={()=>remove(v.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
