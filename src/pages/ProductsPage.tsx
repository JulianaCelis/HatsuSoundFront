import React from 'react';
import { ProductList } from '../components/products/ProductList';

export const ProductsPage: React.FC = () => {
  return (
    <div className="products-page">
      <ProductList />
    </div>
  );
};
