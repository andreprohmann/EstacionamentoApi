import { useEffect, useMemo, useState } from 'react'
import api from '../api/client'
import type { Veiculo, Vaga } from '../types'

export default function Veiculos(){
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [vagas, setVagas] = useState<Vaga[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const [form, setForm] = useState<{placa: string, modelo?: string, cor?: string, ano?: number | '', vagaId?: number | ''}>({ placa:'', modelo:'', cor:'', ano:'', vagaId:'' })
  const [editId, setEditId] = useState<number | null>(null)

  async function load(){
    setLoading(true)
    setError('')
    try {
      const [veics, vags] = await Promise.all([
        api.listVeiculos(),
        api.listVagas()
      ])
      setVeiculos(veics)
      setVagas(vags)
    } catch (e:any){ setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  const vagasDisponiveis = useMemo(()=>{
    const ocupadas = new Set(veiculos.filter(v=>v.vagaId!=null).map(v=>v.vagaId!))
    return vagas.filter(v=>v.ativa && !ocupadas.has(v.id))
  }, [vagas, veiculos])

  async function create(){
    if(!form.placa.trim()) { alert('Placa é obrigatória'); return }
    try{
      await api.createVeiculo({
        placa: form.placa.trim().toUpperCase(),
        modelo: form.modelo || undefined,
        cor: form.cor || undefined,
        ano: form.ano === '' ? undefined : Number(form.ano),
        vagaId: form.vagaId === '' ? undefined : Number(form.vagaId)
      })
      setForm({ placa:'', modelo:'', cor:'', ano:'', vagaId:'' })
      await load()
    }catch(e:any){ alert(e.message) }
  }

  function startEdit(v: Veiculo){
    setEditId(v.id)
    setForm({
      placa: v.placa,
      modelo: v.modelo || '',
      cor: v.cor || '',
      ano: v.ano ?? '',
      vagaId: v.vagaId ?? ''
    })
  }

  async function update(){
    if(editId==null) return
    try{
      // Enviar placa/modelo/cor/ano normalmente
      const dto: any = {
        placa: form.placa.trim().toUpperCase(),
        modelo: form.modelo || undefined,
        cor: form.cor || undefined,
        ano: form.ano === '' ? undefined : Number(form.ano)
      }
      // Controle de vaga: precisamos indicar explicitamente se vamos alterar ou não
      dto.vagaIdHasValue = true
      dto.vagaId = form.vagaId === '' ? null : Number(form.vagaId)

      await api.updateVeiculo(editId, dto)
      setEditId(null)
      setForm({ placa:'', modelo:'', cor:'', ano:'', vagaId:'' })
      await load()
    }catch(e:any){ alert(e.message) }
  }

  async function remove(id:number){
    if(!confirm('Excluir este veículo?')) return
    try{ await api.deleteVeiculo(id); await load() }catch(e:any){ alert(e.message) }
  }

  async function ocupar(id:number){
    const vagaIdStr = prompt('Informe o ID da vaga a ocupar:')
    if(!vagaIdStr) return
    const vagaId = Number(vagaIdStr)
    if(Number.isNaN(vagaId)) { alert('ID inválido'); return }
    try{ await api.ocupar(id, vagaId); await load() }catch(e:any){ alert(e.message) }
  }

  async function liberar(id:number){
    try{ await api.liberar(id); await load() }catch(e:any){ alert(e.message) }
  }

  return (
    <div className="panel">
      <h2 style={{marginTop:0}}>Veículos</h2>

      <div className="row">
        <div>
          <div className="field">
            <label>Placa</label>
            <input value={form.placa} onChange={e=>setForm({...form, placa:e.target.value.toUpperCase()})} placeholder="ABC1D23" />
          </div>
          <div className="field">
            <label>Modelo</label>
            <input value={form.modelo} onChange={e=>setForm({...form, modelo:e.target.value})} placeholder="Ex: Onix" />
          </div>
          <div className="field">
            <label>Cor</label>
            <input value={form.cor} onChange={e=>setForm({...form, cor:e.target.value})} placeholder="Ex: Preto" />
          </div>
          <div className="field">
            <label>Ano</label>
            <input value={form.ano as any} onChange={e=>{
              const val = e.target.value
              setForm({...form, ano: val === '' ? '' : Number(val)})
            }} placeholder="Ex: 2022" />
          </div>
          <div className="field">
            <label>Vaga (opcional)</label>
            <select value={form.vagaId as any} onChange={e=>setForm({...form, vagaId: e.target.value === '' ? '' : Number(e.target.value)})}>
              <option value="">Sem vaga</option>
              {vagasDisponiveis.map(v => (
                <option key={v.id} value={v.id}>{v.numero} (id {v.id})</option>
              ))}
              {/* se estiver editando e ocupando uma vaga já atribuída, manter visível */}
              {editId!=null && form.vagaId!=='' && !vagasDisponiveis.some(v=>v.id===form.vagaId) && (
                <option value={form.vagaId as number}>Manter vaga id {form.vagaId}</option>
              )}
            </select>
          </div>
          {editId==null ? (
            <button className="btn primary" onClick={create}>Criar veículo</button>
          ) : (
            <div className="flex">
              <button className="btn ok" onClick={update}>Salvar</button>
              <button className="btn" onClick={()=>{ setEditId(null); setForm({placa:'', modelo:'', cor:'', ano:'', vagaId:''}) }}>Cancelar</button>
            </div>
          )}
        </div>
        <div>
          {loading ? <p>Carregando...</p> : error ? <p style={{color:'#fca5a5'}}>{error}</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Placa</th>
                  <th>Modelo</th>
                  <th>Cor</th>
                  <th>Ano</th>
                  <th>Vaga</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {veiculos.map(v => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.placa}</td>
                    <td>{v.modelo || '-'}</td>
                    <td>{v.cor || '-'}</td>
                    <td>{v.ano || '-'}</td>
                    <td>{v.vaga ? `${v.vaga.numero} (id ${v.vaga.id})` : '-'}</td>
                    <td>
                      <button className="btn" onClick={()=>startEdit(v)}>Editar</button>
                      <button className="btn danger" onClick={()=>remove(v.id)}>Excluir</button>
                      {v.vagaId == null ? (
                        <button className="btn" onClick={()=>ocupar(v.id)}>Ocupar</button>
                      ) : (
                        <button className="btn" onClick={()=>liberar(v.id)}>Liberar</button>
                      )}
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
