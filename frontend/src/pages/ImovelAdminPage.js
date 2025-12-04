import React, { useState, useEffect } from 'react';
import { addImovel, getImoveis, editImovel, deleteImovel } from '../services/imovelService';

export default function ImovelAdminPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [rentYield, setRentYield] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [imoveis, setImoveis] = useState([]);
  const [editId, setEditId] = useState(null);
  const [images, setImages] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    getImoveis().then(res => setImoveis(res.data));
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title || !description || !price || !rentYield) {
      setError('Preencha todos os campos');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('rentYield', rentYield);
      images.forEach(img => formData.append('images', img));
      if (editId) {
        await editImovel(editId, formData, token);
        setSuccess('Imóvel editado com sucesso!');
      } else {
        await addImovel(formData, token);
        setSuccess('Imóvel cadastrado com sucesso!');
      }
      setTitle('');
      setDescription('');
      setPrice('');
      setRentYield('');
      setImages([]);
      setEditId(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar/editar imóvel');
    }
  };

  const handleEdit = (imovel) => {
    setEditId(imovel._id);
    setTitle(imovel.title);
    setDescription(imovel.description);
    setPrice(imovel.price);
    setRentYield(imovel.rentYield);
    setImages([]); // Limpa seleção de novas imagens
    setCurrentImages(imovel.images || []);
  };
  const [currentImages, setCurrentImages] = useState([]);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel?')) {
      try {
        await deleteImovel(id, token);
        setSuccess('Imóvel excluído com sucesso!');
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao excluir imóvel');
      }
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>{editId ? 'Editar Imóvel' : 'Cadastro de Imóvel (Admin)'}</h2>
  <form onSubmit={handleSubmit} encType="multipart/form-data">
        {editId && currentImages.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {currentImages.map((img, idx) => (
              <img key={idx} src={`http://localhost:5000${img}`} alt="foto" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }} />
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={e => setImages(Array.from(e.target.files))}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
        />
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
          required
        />
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
          required
        />
        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={e => setPrice(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
          required
        />
        <input
          type="number"
          placeholder="Rendimento (%)"
          value={rentYield}
          onChange={e => setRentYield(e.target.value)}
          style={{ width: '100%', marginBottom: 12, padding: 8 }}
          required
        />
        <button type="submit" style={{ width: '100%', padding: 10 }}>{editId ? 'Salvar Edição' : 'Cadastrar Imóvel'}</button>
        {editId && (
          <button type="button" style={{ width: '100%', marginTop: 8, padding: 10, background: '#eee' }} onClick={() => { setEditId(null); setTitle(''); setDescription(''); setPrice(''); setRentYield(''); }}>Cancelar</button>
        )}
      </form>
      {success && <p style={{ color: 'green', marginTop: 12 }}>{success}</p>}
      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}

      <h3 style={{ marginTop: 32 }}>Imóveis cadastrados</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {imoveis.map(imovel => (
          <li key={imovel._id} style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}>
            <strong>{imovel.title}</strong> - R$ {imovel.price} - {imovel.rentYield}%<br />
            <span>{imovel.description}</span><br />
            <button style={{ marginRight: 8 }} onClick={() => handleEdit(imovel)}>Editar</button>
            <button style={{ background: '#e57373', color: '#fff' }} onClick={() => handleDelete(imovel._id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
