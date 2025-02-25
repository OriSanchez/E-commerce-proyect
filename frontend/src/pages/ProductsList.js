import React, { useEffect, useState } from 'react';
import productService from '../services/productServices';
import ProductCard from '../components/ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => {
        console.error('Error al obtener los productos', err);
      });
  }, []);

  return (
    <div>
      <h2>Productos</h2>
      <div>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
