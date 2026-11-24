import Cinema from './cinema';
import ChapterNav from './chapter-nav';
import Chapters from './chapters';
import './chapters.css';

export default function Portfolio() {
  return (
    <>
      <a className="skip-link" href="#about">Skip to portfolio</a>
      <ChapterNav />
      <main>
        <Cinema />
        <div className="marquee" aria-hidden="true">
          <div>
            {Array.from({ length: 4 }, (_, index) => (
              <span className="marquee-group" key={index}>BUILD <b>✦</b> MAKE <b>✿</b> BREAK <b>✦</b> REPEAT <b>✿</b></span>
            ))}
          </div>
        </div>
        <Chapters />
      </main>
    </>
  );
}
