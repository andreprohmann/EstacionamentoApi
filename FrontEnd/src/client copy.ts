
export interface Vaga {
    id: number;
    numero: string;
    ocupada: boolean;
}

export interface Veiculo {
    id: number;
    placa: string;
    modelo: string;
    vagaId: number;
    vaga?: Vaga;
}

const API_VAGAS = '/api/vagas';
const API_VEICULOS = '/api/veiculos';

export async function getVagas(): Promise<Vaga[]> {
    const res = await fetch(API_VAGAS);
    if (!res.ok) throw new Error('Erro ao buscar vagas');
    return await res.json();
}

export async function createVaga(vaga: Vaga): Promise<void> {
    const res = await fetch(API_VAGAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vaga)
    });
    if (!res.ok) throw new Error('Erro ao criar vaga');
}

export async function updateVaga(vaga: Vaga): Promise<void> {
    const res = await fetch(`${API_VAGAS}/${vaga.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vaga)
    });
    if (!res.ok) throw new Error('Erro ao atualizar vaga');
}

export async function deleteVaga(id: number): Promise<void> {
    const res = await fetch(`${API_VAGAS}/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Erro ao excluir vaga');
}

export async function getVeiculos(): Promise<Veiculo[]> {
    const res = await fetch(API_VEICULOS);
    if (!res.ok) throw new Error('Erro ao buscar veículos');
    return await res.json();
}

export async function createVeiculo(veiculo: Veiculo): Promise<void> {
    const res = await fetch(API_VEICULOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(veiculo)
    });
    if (!res.ok) throw new Error('Erro ao criar veículo');
}

export async function updateVeiculo(veiculo: Veiculo): Promise<void> {
    const res = await fetch(`${API_VEICULOS}/${veiculo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(veiculo)
    });
    if (!res.ok) throw new Error('Erro ao atualizar veículo');
}

export async function deleteVeiculo(id: number): Promise<void> {
    const res = await fetch(`${API_VEICULOS}/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Erro ao excluir veículo');
}
