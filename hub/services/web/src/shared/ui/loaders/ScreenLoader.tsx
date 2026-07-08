import React from 'react';

// Os estilos são definidos aqui para garantir que sejam aplicados
// sem depender de um arquivo CSS externo que pode carregar depois.
const loaderStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'var(--color-identity-tertiary)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const spinnerStyle: React.CSSProperties = {
  border: '0.25rem solid color-mix(in srgb, var(--color-background-light) 30%, transparent)',
  borderRadius: '50%',
  borderTop: '0.25rem solid var(--color-background-light)',
  width: '3.125rem',
  height: '3.125rem',
  animation: 'spin 1s linear infinite',
};

// A keyframes de animação precisa ser global.
// Podemos injetá-la com um componente <style>.
const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Loader = () => {
  return (
    <>
      <style>{spinAnimation}</style>
      <div style={loaderStyle}>
        <div style={spinnerStyle}></div>
      </div>
    </>
  );
};

export default Loader;
