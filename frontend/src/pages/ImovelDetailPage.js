import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getImoveis } from '../services/imovelService';
import { investInImovel } from '../services/investmentService';

export default function ImovelDetailPage() {
  const { id } = useParams();
  const [imovel, setImovel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getImoveis().then(res => {
      const found = res.data.find(i => i._id === id);
      setImovel(found);
    });
  }, [id]);

  if (!imovel) return <div>Imóvel não encontrado.</div>;

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>{imovel.title}</h2>
      {imovel.images && imovel.images.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {imovel.images.map((img, idx) => (
            <img key={idx} src={`http://localhost:5000${img}`} alt="foto" style={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 6 }} />
          ))}
        </div>
      )}
      <p><strong>Descrição:</strong> {imovel.description}</p>
      <p><strong>Preço:</strong> R$ {imovel.price}</p>
      <p><strong>Rendimento:</strong> {imovel.rentYield}%</p>
      <button
        style={{ marginTop: 16, padding: '10px 24px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}
        onClick={async () => {
          const token = localStorage.getItem('token');
          if (!token) return alert('Faça login para investir.');
          try {
            await investInImovel(imovel._id, token);
            alert('Investimento realizado com sucesso!');
          } catch (err) {
            if (err.response?.data?.error?.includes('Saldo insuficiente')) {
              alert('Saldo insuficiente para investir neste imóvel. Adicione saldo à sua carteira.');
            } else {
              alert('Erro ao investir: ' + (err.response?.data?.error || 'Tente novamente.'));
            }
          }
        }}
      >Investir no imóvel (R$ {imovel.price})</button>
      <button style={{ marginLeft: 16 }} onClick={() => navigate('/imoveis')}>Voltar</button>
    </div>
  );
}
