import Cinema from './cinema';
import Chapters from './chapters';
import ForkBand from '@/components/home/ForkBand';

export default function Portfolio() {
  return (
    <>
      <Cinema />
      <div className="marquee" aria-hidden="true">
        <div>
          {Array.from({ length: 4 }, (_, index) => (
            <span className="marquee-group" key={index}>BUILD <b>✦</b> MAKE <b>✿</b> BREAK <b>✦</b> REPEAT <b>✿</b></span>
          ))}
        </div>
      </div>
      <ForkBand />
      <Chapters />
    </>
  );
}
