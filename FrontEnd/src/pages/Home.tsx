export default function Home(){
  return (
    <div className="panel">
      <h2 style={{marginTop:0}}>Bem-vindo 👋</h2>
      <p>Este é um frontend simples para gerenciar <strong>Vagas</strong> e <strong>Veículos</strong>.</p>
      <ul>
        <li>Vá até <strong>Vagas</strong> para criar e gerenciar as vagas ativas.</li>
        <li>Em <strong>Veículos</strong>, crie veículos, mova-os para uma vaga ou libere a vaga.</li>
      </ul>
      <p style={{color:'#9ca3af'}}>A URL da API usada está em <code>VITE_API_BASE_URL</code>.</p>
    </div>
  )
}
