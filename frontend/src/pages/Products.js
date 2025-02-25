import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { getCategories, getProductsByCategory } from "../services/productServices";
import "../styles/Products.css";

// Importar imágenes manualmente
import ropaImg from "../styles/categorias/ropa.jpg";
import zapatosImg from "../styles/categorias/zapatos.jpg";
import accesoriosImg from "../styles/categorias/accesorios.jpg";

const categoryImages = {
  "Ropa": ropaImg,
  "Calzados": zapatosImg,  
  "Accesorios": accesoriosImg, 
};

function Products() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error al obtener las categorías", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    try {
      const data = await getProductsByCategory(categoryId);
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener los productos de la categoría", error);
    }
  };

  const handleResetView = () => {
    setSelectedCategory(null);
    setProducts([]);
  };

  return (
    <div className="products-container">
      {!selectedCategory ? (
        <>
          <h2>Categorías</h2>
          <div className="categories-list">
            {categories.map(category => (
              <div key={category.id} className="category-item" onClick={() => handleCategoryClick(category.id)}>
                <img 
                  src={categoryImages[category.name] || ropaImg} 
                  alt={category.name} 
                  className="category-image" 
                />
                <p>{category.name}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button onClick={handleResetView} className="reset-button">
            Volver a categorías
          </button>
          <h2>Productos</h2>
          <div className="products-list">
            {products.length > 0 ? (
              products.map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <p>{product.name}</p>
                  <p>{product.price}€</p>
                  <button onClick={() => addToCart(product)}>Agregar al carrito</button>
                </div>
              ))
            ) : (
              <p>No hay productos en esta categoría.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Products;





