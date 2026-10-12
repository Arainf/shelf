import { useEffect, useState } from 'react';
import { api, type Product, type Unit } from './api/client';
export function CatalogPage() {
    const [units, setUnits] = useState<Unit[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [unitName, setUnitName] = useState('');
    const [unitSymbol, setUnitSymbol] = useState('');
    // New product form
    const [prodName, setProdName] = useState('');
    const [variantName, setVariantName] = useState('Standard');
    const [selectedUnitId, setSelectedUnitId] = useState('');
    const [price, setPrice] = useState('10');
    const loadData = async () => {
        const [u, p] = await Promise.all([api.getUnits(), api.getProducts()]);
        setUnits(u);
        setProducts(p);
        if (u.length > 0 && !selectedUnitId) setSelectedUnitId(u[0].id);
    };
    useEffect(() => {
        loadData();
    }, []);
    const handleCreateUnit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!unitName || !unitSymbol) return;
        await api.createUnit({ name: unitName, symbol: unitSymbol });
        setUnitName('');
        setUnitSymbol('');
        loadData();
    };
    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prodName || !selectedUnitId) return;
        await api.createProduct({
            name: prodName,
            variants: [
                {
                    name: variantName,
                    units: [
                        {
                            unitId: selectedUnitId,
                            conversionFactor: 1,
                            isBase: true,
                            price: parseFloat(price),
                        },
                    ],
                },
            ],
        });
        setProdName('');
        loadData();
    };
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-8 space-y-8">
            <h1 className="text-3xl font-bold">Catalog: Units & Products</h1>
            {/* 1. Add Unit */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-xl">
                <h2 className="text-xl font-semibold mb-4">1. Create Measurement Unit</h2>
                <form onSubmit={handleCreateUnit} className="flex gap-3">
                    <input
                        placeholder="Unit Name (e.g. Piece)"
                        value={unitName}
                        onChange={(e) => setUnitName(e.target.value)}
                        className="px-3 py-2 bg-slate-900 border border-slate-700 rounded w-1/2"
                    />
                    <input
                        placeholder="Symbol (e.g. pc)"
                        value={unitSymbol}
                        onChange={(e) => setUnitSymbol(e.target.value)}
                        className="px-3 py-2 bg-slate-900 border border-slate-700 rounded w-1/4"
                    />
                    <button className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded font-medium">Add</button>
                </form>
                <div className="mt-3 flex gap-2 flex-wrap">
                    {units.map((u) => (
                        <span key={u.id} className="bg-slate-700 text-xs px-2.5 py-1 rounded-full">
              {u.name} ({u.symbol})
            </span>
                    ))}
                </div>
            </div>
            {/* 2. Add Product */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-xl">
                <h2 className="text-xl font-semibold mb-4">2. Create Product with Variant & Unit Price</h2>
                <form onSubmit={handleCreateProduct} className="space-y-3">
                    <input
                        placeholder="Product Name (e.g. Coca-Cola)"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded"
                    />
                    <div className="flex gap-3">
                        <input
                            placeholder="Variant (e.g. 330ml Can)"
                            value={variantName}
                            onChange={(e) => setVariantName(e.target.value)}
                            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded w-1/2"
                        />
                        <select
                            value={selectedUnitId}
                            onChange={(e) => setSelectedUnitId(e.target.value)}
                            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded w-1/4"
                        >
                            {units.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.symbol}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded w-1/4"
                        />
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-500 w-full py-2 rounded font-medium">
                        Save Product
                    </button>
                </form>
            </div>
            {/* 3. Products List */}
            <div className="space-y-4 max-w-4xl">
                <h2 className="text-xl font-semibold">Catalog List ({products.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((p) => (
                        <div key={p.id} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                            <h3 className="font-bold text-lg text-white">{p.name}</h3>
                            <div className="mt-3 space-y-2">
                                {p.variants.map((v) => (
                                    <div key={v.id} className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                                        <div className="text-sm font-medium text-slate-300">{v.name}</div>
                                        <div className="mt-1 flex gap-2">
                                            {v.units.map((u) => (
                                                <span key={u.id} className="text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
                          {u.unit?.symbol}: ₱{u.price} (x{u.conversionFactor})
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}