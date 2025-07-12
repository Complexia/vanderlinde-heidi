import Scribing from '@/components/scribing/scribing';
import Sidebar from '@/components/ui/sidebar';

const ScribingPage = () => {
  return (
    <div className=" flex h-screen w-full">
        <Sidebar />
      <Scribing />
    </div>
  );
};

export default ScribingPage;
