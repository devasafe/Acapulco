import React, { useState, useEffect, useCallback } from 'react';
import AdminShell from '../components/admin/AdminShell';
import {
  getAllCryptosAdmin,
  createCrypto,
  updateCrypto,
  deleteCrypto,
  toggleCryptoStatus,
} from '../services/apiService';
import { getToken } from '../utils/auth';

const ASSET_BASE = 'http://localhost:5000';
const BRL = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function imageUrl(image) {
  if (!image || !image.trim || !image.trim()) return null;
  if (/^data:|^https?:\/\//.test(image)) return image;
  return `${ASSET_BASE}${image.startsWith('/') ? image : '/' + image}`;
}

const EMPTY = {
  name: '', symbol: '', price: '', description: '',
  plans: [{ period: '', yieldPercentage: '' }], image: null, imagePreview: null,
};

export default function CryptoAdminPage() {
  const token = getToken();
  const [cryptos, setCryptos] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY);

  const loadCryptos = useCallback(async () => {
    try {
      const data = await getAllCryptosAdmin(token);
      setCryptos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => { loadCryptos(); }, [loadCryptos]);

  const handleAddClick = () => {
    setEditingId(null);
    setFormData(EMPTY);
    setDialogOpen(true);
  };

  const handleEditClick = (c) => {
    setEditingId(c._id);
    setFormData({
      name: c.name, symbol: c.symbol, price: c.price || '', description: c.description || '',
      plans: c.plans && c.plans.length > 0 ? c.plans.map((p) => ({ ...p })) : [{ period: '', yieldPercentage: '' }],
      image: null, imagePreview: c.image || null,
    });
    setDialogOpen(true);
  };

  const handleAddPlan = () => setFormData((f) => ({ ...f, plans: [...f.plans, { period: '', yieldPercentage: '' }] }));

  const handleRemovePlan = (index) => {
    if (formData.plans.length === 1) { alert('Você deve ter pelo menos um plano!'); return; }
    setFormData((f) => ({ ...f, plans: f.plans.filter((_, i) => i !== index) }));
  };

  const handlePlanChange = (index, field, value) => {
    setFormData((f) => {
      const plans = f.plans.map((p, i) => (i === index ? { ...p, [field]: value } : p));
      return { ...f, plans };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormData((f) => ({ ...f, image: file, imagePreview: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.symbol) { alert('Nome e símbolo são obrigatórios'); return; }
    const priceNum = Number(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum < 0) { alert('Preço é obrigatório e deve ser um número válido (>= 0)'); return; }
    for (let i = 0; i < formData.plans.length; i++) {
      const p = formData.plans[i];
      const period = Number(p.period);
      const yield_ = Number(p.yieldPercentage);
      if (!p.period || !p.yieldPercentage || isNaN(period) || isNaN(yield_) || period <= 0 || yield_ < 0) {
        alert(`Plano ${i + 1} inválido: período (> 0) e rendimento (>= 0) são obrigatórios`);
        return;
      }
    }
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('symbol', formData.symbol);
      submitData.append('price', formData.price);
      submitData.append('description', formData.description);
      submitData.append('plans', JSON.stringify(formData.plans));
      if (formData.image) submitData.append('image', formData.image);
      if (editingId) await updateCrypto(editingId, submitData, token);
      else await createCrypto(submitData, token);
      setDialogOpen(false);
      loadCryptos();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao salvar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar?')) return;
    try { await deleteCrypto(id, token); loadCryptos(); }
    catch (err) { alert(err.response?.data?.error || 'Erro ao deletar'); }
  };

  const handleToggleActive = async (id) => {
    try { await toggleCryptoStatus(id, token); loadCryptos(); }
    catch (err) { alert(err.response?.data?.error || 'Erro ao alternar status'); }
  };

  const addBtn = (
    <button onClick={handleAddClick} className="bg-primary-container text-white px-4 py-2.5 rounded-lg font-label-caps uppercase hover:opacity-90 inline-flex items-center gap-2">
      <span className="material-symbols-outlined text-[18px]">add</span> Nova cripto
    </button>
  );

  const inputCls = 'w-full bg-surface-container-low border border-outline-variant text-on-surface px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container/20';

  return (
    <AdminShell title="Gerenciar criptomoedas" subtitle="Crie, edite e controle os criptoativos e seus planos." actions={addBtn}>
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
        {cryptos.length === 0 ? (
          <p className="text-on-surface-variant text-center py-12">Nenhuma criptomoeda cadastrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[720px]">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant/30 text-label-caps text-on-surface-variant">
                  <th className="px-6 py-4">ATIVO</th>
                  <th className="px-6 py-4 text-right">PREÇO</th>
                  <th className="px-6 py-4">PLANOS</th>
                  <th className="px-6 py-4 text-center">STATUS</th>
                  <th className="px-6 py-4 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {cryptos.map((c) => {
                  const url = imageUrl(c.image);
                  return (
                    <tr key={c._id} className="hover:bg-surface-container/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {url ? (
                            <img src={url} alt={c.symbol} className="w-9 h-9 rounded-full object-cover bg-surface-container" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-secondary-container/40 text-on-secondary-container grid place-items-center font-bold text-[11px]">
                              {(c.symbol || c.name || '?').slice(0, 3).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-on-surface">{c.name}</p>
                            <p className="text-body-sm text-on-surface-variant uppercase">{c.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium tabular-nums">{BRL(c.price)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(c.plans || []).map((p, idx) => (
                            <span key={idx} className="bg-success/15 text-success text-[12px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                              {p.period}d / {p.yieldPercentage}%
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleActive(c._id)}
                          className={`text-[12px] font-semibold px-3 py-1 rounded-full border transition-colors ${
                            c.isActive
                              ? 'border-success/40 text-success hover:bg-success/10'
                              : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                          }`}
                        >
                          {c.isActive ? '● Ativa' : '○ Inativa'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button onClick={() => handleEditClick(c)} className="text-primary font-label-caps uppercase hover:opacity-80 mr-4">Editar</button>
                        <button onClick={() => handleDelete(c._id)} className="text-danger font-label-caps uppercase hover:opacity-80">Deletar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDialogOpen(false)}>
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 sticky top-0 bg-surface-container-lowest">
              <h2 className="font-headline-md text-[18px]">{editingId ? 'Editar cripto' : 'Nova cripto'}</h2>
              <button onClick={() => setDialogOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-label-caps text-on-surface-variant">NOME</label>
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label-caps text-on-surface-variant">SÍMBOLO</label>
                  <input value={formData.symbol} onChange={(e) => setFormData({ ...formData, symbol: e.target.value })} className={inputCls} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-label-caps text-on-surface-variant">PREÇO (R$)</label>
                <input type="number" step="0.01" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className={inputCls} />
              </div>

              <div className="space-y-1.5">
                <label className="text-label-caps text-on-surface-variant">DESCRIÇÃO</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${inputCls} resize-none`} />
              </div>

              {/* Imagem */}
              <div className="space-y-2">
                <label className="text-label-caps text-on-surface-variant">IMAGEM</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-surface-container grid place-items-center overflow-hidden shrink-0">
                    {imageUrl(formData.imagePreview) ? (
                      <img src={imageUrl(formData.imagePreview)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-on-surface-variant">image</span>
                    )}
                  </div>
                  <label className="cursor-pointer bg-surface-container-low border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-caps uppercase hover:bg-surface-container">
                    Selecionar imagem
                    <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              {/* Planos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-headline-md text-[15px]">Planos de investimento</label>
                  <button onClick={handleAddPlan} className="text-primary font-label-caps uppercase hover:opacity-80 inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">add</span> Adicionar
                  </button>
                </div>
                {formData.plans.map((plan, index) => (
                  <div key={index} className="flex items-end gap-3 bg-surface-container-low border border-outline-variant/40 rounded-lg p-3">
                    <div className="flex-1 space-y-1">
                      <label className="text-label-caps text-on-surface-variant">PERÍODO (DIAS)</label>
                      <input type="number" value={plan.period} onChange={(e) => handlePlanChange(index, 'period', e.target.value)} className={inputCls} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="text-label-caps text-on-surface-variant">RENDIMENTO (%)</label>
                      <input type="number" step="0.1" value={plan.yieldPercentage} onChange={(e) => handlePlanChange(index, 'yieldPercentage', e.target.value)} className={inputCls} />
                    </div>
                    <button onClick={() => handleRemovePlan(index)} className="text-danger hover:opacity-80 p-2.5">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-outline-variant/30 sticky bottom-0 bg-surface-container-lowest">
              <button onClick={() => setDialogOpen(false)} className="text-on-surface-variant font-label-caps uppercase px-4 py-2 hover:text-on-surface">Cancelar</button>
              <button onClick={handleSave} className="bg-primary-container text-white px-5 py-2 rounded-lg font-label-caps uppercase hover:opacity-90">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
