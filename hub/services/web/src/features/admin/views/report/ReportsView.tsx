import { type FC } from 'react';
import { AdminContainer } from '../../components';
import { faChartSimple } from '@tupynambalucas-studio/design/icons';

const ReportsView: FC = () => {
  return (
    <AdminContainer title="Relatórios" icon={faChartSimple}>
      <p>Módulo de relatórios em breve.</p>
    </AdminContainer>
  );
};

export default ReportsView;
