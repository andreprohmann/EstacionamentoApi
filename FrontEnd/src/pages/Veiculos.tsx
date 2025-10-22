
import React, { useEffect, useMemo, useState } from 'react'
import { getVeiculos, createVeiculo, updateVeiculo, deleteVeiculo } from '../client'

interface VeiculoInput {
    id: number;
    placa: string;
    modelo: string;
    vagaId: number;
}

export default function Veiculos() {
    const [veiculos, setVeiculos] = useState<VeiculoInput[]>([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [idEdit, setIdEdit] = useState<number | null>(null)
    const [placa, setPlaca] = useState('')
    const [modelo, setModelo] = useState('')
    const [vagaId, setVagaId] = useState<number | null>(null)

    const isValid = useMemo(() => {
        return placa.trim().length >= 3 && modelo.trim().length >= 2 && vagaId !== null && vagaId > 0
    }, [placa, modelo, vagaId])

    async function carregar() {
        setLoading(true); setErro(null)
        try {
            const dados = await getVeiculos()
            console.log('Dados recebidos da API:', dados)
            // trata dados como any para evitar erro de 'never' e normaliza para um array
            const lista = Array.isArray(dados)
                ? dados
                : (dados && ((dados as any).data ?? (dados as any).items)) ?? []
            setVeiculos(Array.isArray(lista) ? lista : [])
        } catch (e: any) {
            setErro(e?.message || 'Erro ao carregar veículos')
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => { carregar() }, [])

    function resetForm() { setIdEdit(null); setPlaca(''); setModelo(''); setVagaId(null) }

    function startEdit(v: VeiculoInput) {
        setIdEdit(v.id ?? null)
        setPlaca(v.placa)
        setModelo(v.modelo)
        setVagaId(v.vagaId)
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault(); setErro(null)
        if (!isValid) { setErro('Preencha os campos corretamente.'); return }
        const veiculo: VeiculoInput = { id: idEdit ?? 0, placa, modelo, vagaId: vagaId! }
        try {
            if (idEdit === null) {
                await createVeiculo(veiculo)
            } else {
                await updateVeiculo(veiculo)
            }
            await carregar(); resetForm()
        } catch (e: any) { setErro(e?.message || 'Falha ao salvar') }
    }

    async function remover(id: number) {
        if (!confirm('Confirma excluir o veículo?')) return
        try {
            await deleteVeiculo(id)
            await carregar()
            if (idEdit === id) resetForm()
        } catch (e: any) {
            setErro(e?.message || 'Falha ao excluir')
        }
    }

    return (
        <section className="stack-lg">
            <form onSubmit={onSubmit} className="form">
                <div className="form-row">
                    <div className="field">
                        <label htmlFor="placa">Placa</label>
                        <input id="placa" className="input" value={placa} onChange={e => setPlaca(e.target.value)} required />
                    </div>
                    <div className="field">
                        <label htmlFor="modelo">Modelo</label>
                        <input id="modelo" className="input" value={modelo} onChange={e => setModelo(e.target.value)} required />
                    </div>
                    <div className="field">
                        <label htmlFor="vagaId">ID da Vaga</label>
                        <input id="vagaId" className="input" type="number" value={vagaId ?? ''} onChange={e => {
                            const value = e.target.value
                            setVagaId(value ? Number(value) : null)
                        }} min={1} required />
                    </div>
                </div>
                {erro && <div className="alert error">{erro}</div>}
                <div className="actions">
                    <button type="submit" className="btn primary" disabled={!isValid}>{idEdit == null ? 'Criar' : 'Salvar alterações'}</button>
                    {idEdit != null && <button type="button" className="btn ghost" onClick={resetForm}>Cancelar</button>}
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
                                    <th>Modelo</th>
                                    <th>ID Vaga</th>
                                    <th className="col-actions">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(veiculos) && veiculos.length === 0 ? (
                                    <tr><td colSpan={5} className="empty">Nenhum veículo cadastrado.</td></tr>
                                ) : veiculos.map(v => (
                                    <tr key={v.id}>
                                        <td>{v.id}</td>
                                        <td>{v.placa}</td>
                                        <td>{v.modelo}</td>
                                        <td>{isNaN(Number(v.vagaId)) ? '' : v.vagaId}</td>
                                        <td className="row-actions">
                                            <button type="button" className="btn small" onClick={() => startEdit(v)}>Editar</button>
                                            <button type="button" className="btn small danger" onClick={() => remover(v.id)}>Excluir</button>
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
