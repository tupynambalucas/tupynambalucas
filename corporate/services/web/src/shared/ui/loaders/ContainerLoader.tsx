import React from 'react';

const loaderContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundColor: '#ffffff', // Fundo Branco
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '0.5rem',
  // Garante que fique acima de outros elementos se necessário,
  // mas dentro do fluxo da section
  zIndex: 10,
};

const spinnerStyle: React.CSSProperties = {
  border: '0.25rem solid rgba(76, 175, 80, 0.2)', // Verde claro transparente
  borderRadius: '50%',
  borderTop: '0.25rem solid #4CAF50', // Verde Enterprise
  width: '3.125rem',
  height: '3.125rem',
  animation: 'spin 1s linear infinite',
};

const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ContainerLoader = () => {
  return (
    <>
      <style>{spinAnimation}</style>
      <div style={loaderContainerStyle}>
        <div style={spinnerStyle}></div>
      </div>
    </>
  );
};

export default ContainerLoader;
