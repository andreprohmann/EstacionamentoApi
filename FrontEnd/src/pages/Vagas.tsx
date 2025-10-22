import React, { useEffect, useMemo, useState } from 'react'
import { Vaga, getVagas, createVaga, updateVaga, deleteVaga } from '../client'

function validarPlaca(p: string){ return p.trim().length >= 3 }

export default function Vagas(){
  const [vagas, setVagas] = useState<Vaga[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [idEdit, setIdEdit] = useState<number | null>(null)
  const [placa, setPlaca] = useState('')
  const [numeroVaga, setNumeroVaga] = useState('')
  const [ocupada, setOcupada] = useState(false)

  const isValid = useMemo(() => {
    if (!validarPlaca(placa)) return false
    const n = Number(numeroVaga)
    if (!numeroVaga || Number.isNaN(n) || n <= 0) return false
    return true
  }, [placa, numeroVaga])

  async function carregar(){
    setLoading(true); setErro(null)
    try{ setVagas(await getVagas()) } catch(e:any){ setErro(e?.message || 'Erro ao carregar vagas') } finally { setLoading(false) }
  }
  useEffect(()=>{ carregar() },[])

  function resetForm(){ setIdEdit(null); setPlaca(''); setNumeroVaga(''); setOcupada(false) }

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setErro(null)
    if(!isValid){ setErro('Preencha os campos corretamente.'); return }
    try{
      if(idEdit==null){ await createVaga({ placa:placa.trim(), numeroVaga:Number(numeroVaga), ocupada }) }
      else { await updateVaga(idEdit,{ placa:placa.trim(), numeroVaga:Number(numeroVaga), ocupada }) }
      await carregar(); resetForm()
    }catch(e:any){ setErro(e?.message || 'Falha ao salvar') }
  }

  function startEdit(v: Vaga){ setIdEdit(v.id); setPlaca(v.placa); setNumeroVaga(String(v.numeroVaga)); setOcupada(v.ocupada) }
  async function remover(id:number){ if(!confirm('Confirma excluir a vaga?')) return; try{ await deleteVaga(id); await carregar(); if(idEdit===id) resetForm() } catch(e:any){ setErro(e?.message || 'Falha ao excluir') } }

  return (
    <section className="stack-lg">
      <form onSubmit={onSubmit} className="form">
        <div className="form-row">
          <div className="field">
            <label htmlFor="placa">Placa</label>
            <input id="placa" className="input" type="text" value={placa} onChange={e=>setPlaca(e.target.value)} placeholder="ABC-1234" required/>
          </div>
          <div className="field">
            <label htmlFor="numero">Nº da Vaga</label>
            <input id="numero" className="input" type="number" value={numeroVaga} onChange={e=>setNumeroVaga(e.target.value)} min={1} required/>
          </div>
          <div className="field checkbox">
            <label className="checkbox-label">
              <input type="checkbox" checked={ocupada} onChange={e=>setOcupada(e.target.checked)} />
              <span>Ocupada</span>
            </label>
          </div>
        </div>
        {erro && <div className="alert error">{erro}</div>}
        <div className="actions">
          <button type="submit" className="btn primary" disabled={!isValid}>{idEdit==null? 'Criar' : 'Salvar alterações'}</button>
          {idEdit!=null && <button type="button" className="btn ghost" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      <div className="table-card">
        {loading ? (
          <div className="skeleton lg" aria-busy="true" aria-label="Carregando"></div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Placa</th>
                  <th>Nº Vaga</th>
                  <th>Ocupada</th>
                  <th className="col-actions">Ações</th>
                </tr>
              </thead>
              <tbody>
                {vagas.length===0 ? (
                  <tr><td colSpan={5} className="empty">Nenhuma vaga cadastrada.</td></tr>
                ) : vagas.map(v => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.placa}</td>
                    <td>{v.numeroVaga}</td>
                    <td>
                      <span className={`badge ${v.ocupada?'bad':'good'}`}>{v.ocupada? 'Sim' : 'Não'}</span>
                    </td>
                    <td className="row-actions">
                      <button type="button" className="btn small" onClick={()=>startEdit(v)}>Editar</button>
                      <button type="button" className="btn small danger" onClick={()=>remover(v.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
