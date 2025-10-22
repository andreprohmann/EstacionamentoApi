import React, { useEffect, useMemo, useState } from 'react'
import { Veiculo, getVeiculos, createVeiculo, updateVeiculo, deleteVeiculo } from '../client'

function validarPlaca(p:string){ return p.trim().length >= 3 }

export default function Veiculos(){
  const [itens, setItens] = useState<Veiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // form
  const [idEdit, setIdEdit] = useState<number | null>(null)
  const [placa, setPlaca] = useState('')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [cor, setCor] = useState('')
  const [ano, setAno] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const isValid = useMemo(()=>{
    if(!validarPlaca(placa)) return false
    if(!marca.trim() || !modelo.trim()) return false
    if(ano && (Number.isNaN(Number(ano)) || Number(ano) < 1900)) return false
    return true
  },[placa, marca, modelo, ano])

  async function carregar(){
    setLoading(true); setErro(null)
    try{ setItens(await getVeiculos()) }catch(e:any){ setErro(e?.message || 'Erro ao carregar veículos') } finally { setLoading(false) }
  }
  useEffect(()=>{ carregar() },[])

  function reset(){ setIdEdit(null); setPlaca(''); setMarca(''); setModelo(''); setCor(''); setAno(''); setObservacoes('') }

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setErro(null)
    if(!isValid){ setErro('Preencha os campos obrigatórios corretamente.'); return }
    try{
      const payload = { placa:placa.trim(), marca:marca.trim(), modelo:modelo.trim(), cor:cor.trim()||undefined, ano: ano? Number(ano): undefined, observacoes:observacoes.trim()||undefined }
      if(idEdit==null){ await createVeiculo(payload) } else { await updateVeiculo(idEdit, payload) }
      await carregar(); reset()
    }catch(e:any){ setErro(e?.message || 'Falha ao salvar') }
  }

  function startEdit(v: Veiculo){ setIdEdit(v.id); setPlaca(v.placa); setMarca(v.marca); setModelo(v.modelo); setCor(v.cor||''); setAno(v.ano? String(v.ano):''); setObservacoes(v.observacoes||'') }
  async function remover(id:number){ if(!confirm('Confirma excluir este veículo?')) return; try{ await deleteVeiculo(id); await carregar(); if(idEdit===id) reset() } catch(e:any){ setErro(e?.message || 'Falha ao excluir') } }

  return (
    <section className="stack-lg">
      <form onSubmit={onSubmit} className="form">
        <div className="form-row-2">
          <div className="field">
            <label htmlFor="placa">Placa *</label>
            <input id="placa" className="input" value={placa} onChange={e=>setPlaca(e.target.value)} placeholder="ABC-1234" required/>
          </div>
          <div className="field">
            <label htmlFor="marca">Marca *</label>
            <input id="marca" className="input" value={marca} onChange={e=>setMarca(e.target.value)} placeholder="Ex.: Ford" required/>
          </div>
        </div>
        <div className="form-row-2">
          <div className="field">
            <label htmlFor="modelo">Modelo *</label>
            <input id="modelo" className="input" value={modelo} onChange={e=>setModelo(e.target.value)} placeholder="Ex.: Ka" required/>
          </div>
          <div className="field">
            <label htmlFor="cor">Cor</label>
            <input id="cor" className="input" value={cor} onChange={e=>setCor(e.target.value)} placeholder="Ex.: Prata"/>
          </div>
        </div>
        <div className="form-row-2">
          <div className="field">
            <label htmlFor="ano">Ano</label>
            <input id="ano" className="input" type="number" value={ano} onChange={e=>setAno(e.target.value)} placeholder="Ex.: 2020" min={1900} />
          </div>
          <div className="field">
            <label htmlFor="obs">Observações</label>
            <textarea id="obs" value={observacoes} onChange={e=>setObservacoes(e.target.value)} placeholder="Observações..." />
          </div>
        </div>
        {erro && <div className="alert error">{erro}</div>}
        <div className="actions">
          <button type="submit" className="btn primary" disabled={!isValid}>{idEdit==null? 'Cadastrar' : 'Salvar alterações'}</button>
          {idEdit!=null && <button type="button" className="btn ghost" onClick={reset}>Cancelar</button>}
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
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Cor</th>
                  <th>Ano</th>
                  <th className="col-actions">Ações</th>
                </tr>
              </thead>
              <tbody>
                {itens.length===0 ? (
                  <tr><td colSpan={7} className="empty">Nenhum veículo cadastrado.</td></tr>
                ) : itens.map(v => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.placa}</td>
                    <td>{v.marca}</td>
                    <td>{v.modelo}</td>
                    <td>{v.cor || '-'}</td>
                    <td>{v.ano || '-'}</td>
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
