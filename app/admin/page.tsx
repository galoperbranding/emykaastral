"use client";
import React, { useState, useEffect } from 'react';

type Order = {
  id: number;
  full_name: string;
  service_type: string;
  email: string;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    // Refresh
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data);
  };

  if (loading) return <div className="p-10 text-white">Cargando Emyka CRM...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-luxury">Emyka CRM <span className="text-sm bg-emyka/20 px-2 py-1 rounded text-emyka ml-2">Admin</span></h1>
          <div className="text-sm text-gray-500">Pedidos Totales: {orders.length}</div>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Servicio</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-500">#{order.id}</td>
                  <td className="p-4 font-medium">{order.full_name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs border ${
                      order.service_type === 'Manual Personal' ? 'bg-purple-900/30 border-purple-500/50 text-purple-300' :
                      order.service_type === 'Carta Astral' ? 'bg-blue-900/30 border-blue-500/50 text-blue-300' :
                      'bg-orange-900/30 border-orange-500/50 text-orange-300'
                    }`}>
                      {order.service_type}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    <div>{order.email}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                       order.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' :
                       order.status === 'completed' ? 'bg-green-400/10 text-green-400' :
                       'bg-gray-400/10 text-gray-400'
                    }`}>
                       <span className={`w-1.5 h-1.5 rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-400' :
                          order.status === 'completed' ? 'bg-green-400' :
                          'bg-gray-400'
                       }`}></span>
                       {order.status === 'pending' ? 'Pendiente' : 
                        order.status === 'completed' ? 'Completado' : order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {order.status !== 'completed' && (
                       <button 
                         onClick={() => updateStatus(order.id, 'completed')}
                         className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
                       >
                         Marcar Listo
                       </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No hay pedidos aún.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
