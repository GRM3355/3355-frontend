import { useState } from 'react';
import Header from '@/components/layout/Header';
import Tab from '@/components/common/Tab';
import FestivalListSection from '@/components/festival/FestivalListSection';
import { regions } from '@/utils/map';
import Nav from '@/components/layout/Nav';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FestivalListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialRegion = searchParams.get('region') || 'SEOUL';
  const [region, setRegion] = useState<string>(initialRegion);

  const handleSelectRegion = (newRegion: string) => {
    setRegion(newRegion);
    navigate(`?region=${newRegion}`, { replace: true });
  };

  return (
    <>
      <Header showLogo={true} showUser={true} showSearch={true} />
      <div className='flex-1 w-full h-full relative overflow-hidden'>
        <div className='flex flex-col h-full '>
          <div className='flex-1'>
            {/* 지역 필터링 */}
            <Tab
              items={regions}
              selected={region}
              onSelect={handleSelectRegion}
            />
          </div>
          <FestivalListSection region={region} />
        </div>
      </div>
      <Nav />
    </>
  )
}
