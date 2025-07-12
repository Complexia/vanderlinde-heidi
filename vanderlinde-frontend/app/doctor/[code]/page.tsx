import DoctorDisplay from '@/components/doctor-display/doctor-display';

interface PageProps {
  params: {
    code: string;
  };
}

export default function DoctorViewPage({ params }: PageProps) {
  const { code } = params;

  return (
    <main>
      <DoctorDisplay sharingCode={code} />
    </main>
  );
}
