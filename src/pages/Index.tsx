
import { EditProvider } from '@/contexts/EditContext';
import LandingPage from '@/components/LandingPage';

const Index = () => {
  return (
    <EditProvider>
      <LandingPage />
    </EditProvider>
  );
};

export default Index;
