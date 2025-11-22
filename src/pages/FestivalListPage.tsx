import { useState } from 'react';
import Header from '@/components/layout/Header';
import Tab from '@/components/common/Tab';
import FestivalListSection from '@/components/festival/FestivalListSection';
import { regions } from '@/utils/map';
import Nav from '@/components/layout/Nav';

export default function FestivalListPage() {
  const [region, setRegion] = useState<string>('SEOUL');

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
              onSelect={setRegion}
            />
          </div>
          <FestivalListSection region={region} />
        </div>
      </div>
      <Nav />
    </>
  )
}
