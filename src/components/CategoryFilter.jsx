import React from 'react';

// Componente del filtro de categorías
export const CategoryFilter = ({ setSelectedCategory, startGame }) => {
  const categories = [
    { label: 'Geografía 🌎', value: 'geography' },
    { label: 'Arte y Literatura 📚', value: 'arts%26literature' },
    { label: 'Entretenimiento 🎮', value: 'entertainment' },
    { label: 'Ciencia y Naturaleza 🧪', value: 'science%26nature' },
    { label: 'Deportes y Ocio 🏈', value: 'sports%26leisure' },
    { label: 'Historia 🇰🇬', value: 'history' },
    { label: 'Para Pro 💪🏆', value: 'pro' } 
  ];

  // Estilos para los botones
  const buttonStyle = {
    color: 'black', // Color de la fuente negro por defecto
    backgroundColor: '#f0f0f0', // Fondo gris claro para los botones
    border: '1px solid #ccc', // Borde gris
    borderRadius: '5px', // Bordes redondeados
    cursor: 'pointer', // Cambiar el cursor al pasar por encima
    margin: '10px 0', // Margen vertical entre botones
    padding: '10px 20px', // Espaciado interno
    fontSize: '16px', // Tamaño de la fuente
    width: '100%', // Hacer que el botón ocupe el ancho completo
    textAlign: 'center' // Centrar el texto dentro del botón
  };

  const containerStyle = {
    display: 'flex', // Usar flexbox para alinear los botones
    flexDirection: 'column', // Alinear en columna
    alignItems: 'center', // Centrar horizontalmente
    marginTop: '20px', // Margen superior para separar del encabezado
    width: '100%' // Hacer que el contenedor ocupe el ancho completo
  };

  return (
    <div className="category-filter" style={containerStyle}>
      <h2>Selecciona una categoría:</h2>
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => {
            setSelectedCategory(category.value);
            startGame(); // Iniciar el juego al seleccionar la categoría
          }}
          style={buttonStyle} // Aplicar estilos en línea
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};
