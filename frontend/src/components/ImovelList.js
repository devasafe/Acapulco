import React, { useEffect, useState } from 'react';
import { getImoveis } from '../services/imovelService';

export default function ImovelList({ onInvest, onImovelClick }) {
  const [imoveis, setImoveis] = useState([]);

  useEffect(() => {
    getImoveis().then(res => setImoveis(res.data));
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Lista de Imóveis</h2>
      {imoveis.length === 0 ? (
        <p>Nenhum imóvel disponível.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {imoveis.map((imovel) => (
            <li key={imovel._id} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8, cursor: 'pointer' }} onClick={() => onImovelClick && onImovelClick(imovel)}>
              <strong>{imovel.title}</strong><br />
              {imovel.images && imovel.images.length > 0 && (
                <div style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
                  {imovel.images.map((img, idx) => (
                    <img key={idx} src={`http://localhost:5000${img}`} alt="foto" style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 4 }} />
                  ))}
                </div>
              )}
              <span>{imovel.description}</span><br />
              Preço: R$ {imovel.price}<br />
              Rendimento: {imovel.rentYield}%<br />
              <button onClick={() => onInvest && onInvest(imovel)} style={{ marginTop: 8 }}>Investir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
