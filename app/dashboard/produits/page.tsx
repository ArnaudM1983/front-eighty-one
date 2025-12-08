"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { CornerRightDown, DollarSign, Package, TrendingUp, X, ChevronUp, ChevronDown, Edit3 } from 'lucide-react';

// --- Types pour la démo ---
type Product = {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
  isFeatured: boolean;
  imageUrl: string;
};

// --- Données d'Exemple (Augmentées pour le tableau) ---
const generateMockProducts = (count: number): Product[] => {
  const products: Product[] = [];
  const names = ["Aérosol", "Marqueur", "Carnet", "Feutre", "Stylo", "Toile", "Pinceau", "Crayon"];
  const colors = ["Noir", "Blanc", "Rouge", "Bleu", "Vert", "Jaune", "Gris", "Or"];

  for (let i = 1; i <= count; i++) {
    const nameIndex = i % names.length;
    const colorIndex = Math.floor(i / names.length) % colors.length;
    const stock = Math.floor(Math.random() * 500) + 1;
    const price = parseFloat((Math.random() * 50 + 1).toFixed(2));

    products.push({
      id: i,
      name: `${names[nameIndex]} ${colors[colorIndex]}`,
      sku: `SKU-${String(i).padStart(4, '0')}`,
      stock: stock,
      price: price,
      isFeatured: i % 10 === 0, // Un produit sur 10 est mis en avant
      imageUrl: `https://placehold.co/100x100/${Math.floor(Math.random() * 0xffffff).toString(16)}/ffffff?text=P${i}`,
    });
  }
  return products;
};

const INITIAL_PRODUCT_COUNT = 150; // Nombre initial de lignes pour la démo

/**
 * Hook pour simuler la récupération et la mise à jour des produits depuis/vers une API.
 */
const useProductData = (initialCount: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulation de la récupération des données
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProducts(generateMockProducts(initialCount));
      setLoading(false);
    }, 500);
  }, [initialCount]);

  /**
   * Simule la mise à jour du statut 'isFeatured' d'un produit.
   * @param id ID du produit.
   * @param isFeatured Nouvelle valeur.
   */
  const updateFeaturedStatus = useCallback(async (id: number, isFeatured: boolean) => {
    // Optimistic UI update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isFeatured } : p));
    
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 300)); 
      
      const productName = products.find(p => p.id === id)?.name || `ID ${id}`;
      toast.success(`Statut "Mis en avant" de "${productName}" mis à jour.`);
      
    } catch (error) {
      toast.error("Erreur de mise à jour. Tentative d'annulation.");
      // Annulation de la mise à jour optimiste
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !isFeatured } : p));
    }
  }, [products]);

  /**
   * Simule la mise à jour de la quantité en stock.
   * @param id ID du produit.
   * @param newStock Nouvelle quantité en stock.
   */
  const updateStock = useCallback(async (id: number, newStock: number) => {
    const originalProduct = products.find(p => p.id === id);
    if (!originalProduct) return;

    const originalStock = originalProduct.stock;

    // Optimistic UI update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));

    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 300)); 

      const productName = originalProduct.name;
      toast.success(`Stock de "${productName}" mis à jour à ${newStock}.`);
    } catch (error) {
      toast.error("Erreur de mise à jour du stock. Tentative d'annulation.");
      // Annulation de la mise à jour optimiste
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: originalStock } : p));
    }
  }, [products]);

  return { products, loading, updateFeaturedStatus, updateStock };
};

/**
 * Composant réutilisable pour le basculement (toggle) "Mis en avant".
 */
const FeaturedToggle = ({ product, onFeatureToggle }: { product: Product, onFeatureToggle: (id: number, isFeatured: boolean) => Promise<void> }) => {
  return (
    <button
      onClick={() => onFeatureToggle(product.id, !product.isFeatured)}
      className={`p-2 rounded-full transition duration-200 ${
        product.isFeatured
          ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700'
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      }`}
      title={product.isFeatured ? 'Retirer des produits mis en avant' : 'Mettre en avant'}
    >
      <TrendingUp className="w-4 h-4" />
    </button>
  );
};

/**
 * Composant pour l'édition de stock en ligne.
 */
const StockCell = ({ productId, initialStock, onUpdate }: { productId: number, initialStock: number, onUpdate: (id: number, stock: number) => Promise<void> }) => {
  const [stock, setStock] = useState(initialStock);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setStock(initialStock);
  }, [initialStock]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setStock(value);
    }
  };

  const handleBlur = () => {
    if (stock !== initialStock) {
      onUpdate(productId, stock);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setStock(initialStock);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center">
      {isEditing ? (
        <input
          type="number"
          value={stock}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-20 border border-indigo-300 rounded-md p-1 text-sm text-center focus:ring-2 focus:ring-indigo-500 transition duration-150"
          min="0"
        />
      ) : (
        <span 
          className={`font-medium cursor-pointer p-1 rounded-md transition duration-150 flex items-center group ${initialStock < 20 ? 'text-red-600 bg-red-50' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setIsEditing(true)}
        >
          {initialStock}
          <Edit3 className="w-3 h-3 ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition duration-200" />
        </span>
      )}
    </div>
  );
};

// --- Composant Principal : Tableau de Bord Admin ---
export default function ProductManagementDashboard() {
  const { products: initialProducts, loading, updateFeaturedStatus, updateStock } = useProductData(INITIAL_PRODUCT_COUNT);
  const [products, setProducts] = useState(initialProducts);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product, direction: 'ascending' | 'descending' } | null>(null);

  // Synchroniser les produits après le chargement initial
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Fonction de tri (tri en mémoire, car plus efficace pour l'UI que des requêtes Firestore/API triées)
  const sortedProducts = React.useMemo(() => {
    let sortableItems = [...products];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [products, sortConfig]);

  const requestSort = (key: keyof Product) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name: keyof Product) => {
    if (!sortConfig) return;
    return sortConfig.key === name ? (sortConfig.direction === 'ascending' ? 'text-indigo-600' : 'text-indigo-600') : 'text-gray-500';
  };

  const getSortIcon = (name: keyof Product) => {
    if (!sortConfig || sortConfig.key !== name) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />;
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-xl text-gray-600">Chargement des {INITIAL_PRODUCT_COUNT} produits...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Gestion des Produits
        </h1>
        <p className="text-gray-500 mt-2 flex items-center">
          <CornerRightDown className="w-4 h-4 mr-1" />
          {products.length} articles actifs en base de données.
        </p>
      </header>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Image */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                
                {/* Nom du produit (Triable) */}
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                  onClick={() => requestSort('name')}
                >
                  <div className={`flex items-center ${getClassNamesFor('name')}`}>
                    Nom du Produit
                    {getSortIcon('name')}
                  </div>
                </th>
                
                {/* SKU */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                
                {/* Prix (Triable) */}
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                  onClick={() => requestSort('price')}
                >
                  <div className={`flex items-center ${getClassNamesFor('price')}`}>
                    Prix
                    {getSortIcon('price')}
                  </div>
                </th>
                
                {/* Stock (Triable & Éditable) */}
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                  onClick={() => requestSort('stock')}
                >
                  <div className={`flex items-center ${getClassNamesFor('stock')}`}>
                    Stock
                    {getSortIcon('stock')}
                  </div>
                </th>
                
                {/* Mis en avant (Éditable) */}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mis en avant
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-indigo-50/50 transition duration-150">
                  {/* Colonne Image */}
                  <td className="p-4 whitespace-nowrap">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-md border border-gray-200"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/e5e7eb/4b5563?text=N/A' }}
                    />
                  </td>
                  
                  {/* Colonne Nom */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {product.name}
                  </td>
                  
                  {/* Colonne SKU */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {product.sku}
                  </td>
                  
                  {/* Colonne Prix */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {product.price.toFixed(2)} €
                  </td>
                  
                  {/* Colonne Stock (Édition en ligne) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StockCell
                      productId={product.id}
                      initialStock={product.stock}
                      onUpdate={updateStock}
                    />
                  </td>

                  {/* Colonne Featured (Toggle) */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <FeaturedToggle
                      product={product}
                      onFeatureToggle={updateFeaturedStatus}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl shadow-inner border border-dashed border-gray-300 mt-10">
          <X className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-xl font-medium text-gray-900">Aucun produit trouvé</h3>
          <p className="mt-1 text-gray-500">Ajoutez de nouveaux produits pour commencer la gestion.</p>
        </div>
      )}
    </div>
  );
}