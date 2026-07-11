import { type FC } from 'react';
import { AdminContainer } from '../../components';
import { faUsers } from '@tupynambalucas-studio/design/icons';

const CustomersView: FC = () => {
  return (
    <AdminContainer title="Clientes" icon={faUsers}>
      <p>Gerenciamento de clientes em breve.</p>
    </AdminContainer>
  );
};

export default CustomersView;
