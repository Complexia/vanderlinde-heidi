import Consultation from '@/components/consultation/consultation';
import Sidebar from '@/components/ui/sidebar';

interface ConsultationPageProps {
  params: {
    id: string;
  };
}

const ConsultationPage: React.FC<ConsultationPageProps> = ({ params }) => {

  return (
    <main className="flex">
        <Sidebar />
        <Consultation id={params.id} />
    </main>
  )
};

export default ConsultationPage;
