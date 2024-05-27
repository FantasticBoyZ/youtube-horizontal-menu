import { Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import Image from 'next/image';
import styles from './styles.module.css';

type Props = {
  className?: string | undefined;
  today: string;
  date: string;
  daysInWeek: string;
  selectedDate: string;
  setSelectedDate: Dispatch<SetStateAction<string>>;
};

const dateArrMock = [
  { date: '19', daysInWeek: 'Fri' },
  { date: '20', daysInWeek: 'Sat' },
  { date: '21', daysInWeek: 'Sun' },
  { date: '22', daysInWeek: 'Mon' },
  { date: '23', daysInWeek: 'Tue' },
  { date: '24', daysInWeek: 'Wed' },
  { date: '25', daysInWeek: 'Thurs' },
  { date: '26', daysInWeek: 'Fri' },
  { date: '27', daysInWeek: 'Sat' },
  { date: '28', daysInWeek: 'Sun' },
  { date: '29', daysInWeek: 'Mon' },
  { date: '30', daysInWeek: 'Tue' },
  { date: '5/1', daysInWeek: 'Wed' },
  { date: '2', daysInWeek: 'Thurs' },
  { date: '3', daysInWeek: 'Fri' },
  { date: '4', daysInWeek: 'Sat' },
  { date: '5', daysInWeek: 'Sun' },
  { date: '6', daysInWeek: 'Mon' },
  { date: '7', daysInWeek: 'Tue' },
  { date: '8', daysInWeek: 'Wed' },
  { date: '9', daysInWeek: 'Thurs' },
  { date: '10', daysInWeek: 'Fri' },
  { date: '11', daysInWeek: 'Sat' },
];

const CalendarItem = ({ date, today, daysInWeek, selectedDate, setSelectedDate }: Props) => {
  return (
    <div
      className={clsx(styles.dateItem, selectedDate === date ? styles.selected : '')}
      onClick={() => setSelectedDate(date)}
    >
      <p className={styles.date}>
        {date === today ? 'Today' : date}
      </p>
      <p
        className={clsx(
          styles.daysInWeek,
          daysInWeek === 'Sat' ? styles.saturday : daysInWeek === 'Sun' ? styles.sunday : ''
        )}
      >
        {daysInWeek}
      </p>
    </div>
  );
};

export const YoutubeHorizontalMenu = () => {
  const [selectedDate, setSelectedDate] = useState('23');
  const [dateArr, setDateArr] = useState([...dateArrMock.slice(0, 14)]);

  const today = new Date().getDate().toString();

  const [showArrowPrev, setShowArrowPrev] = useState(true);
  const [showArrowNext, setShowArrowNext] = useState(true);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dateListComponent, setDateListComponent] = useState<HTMLDivElement>();
  const dateList = useRef<HTMLDivElement>(null);

  const dateListRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setDateListComponent(node)
    }
  }, [])

  const handleOnMouseDown = (e: { pageX: number }) => {
    if (!dateListComponent) return;
    setIsMouseDown(true);
    setStartX(e.pageX - -dateListComponent?.offsetLeft);
    setScrollLeft(dateListComponent?.scrollLeft);
  };

  const handleOnMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleOnMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleOnMouseMove = (e: { preventDefault: () => void; pageX: number }) => {
    if (!isMouseDown || !dateListComponent) return;
    e.preventDefault();
    const x = e.pageX - dateListComponent?.offsetLeft;
    const walk = x - startX; // ajust the speed
    dateListComponent.scrollLeft = scrollLeft - walk;
    handleShowArrow();
  };

  const handleScrollByButton = (offset: number) => {
    if (dateListComponent) dateListComponent.scrollLeft += offset;
    console.log(
      'Before setState -',
      'showArrowPrev: ',
      showArrowPrev,
      'showArrowNext: ',
      showArrowNext
    );
    handleShowArrow();
  };

  const handleShowArrow = () => {
    if (!dateListComponent) return;
    console.log(
      'showArrowPrev: (dateListComponent.scrollLeft > 10)',
      dateListComponent.scrollLeft > 10
    );
    if (dateListComponent.scrollLeft > 10) {
      setShowArrowPrev(true);
    } else {
      setShowArrowPrev(false);
    }

    console.log(
      'showArrowNext: (dateListComponent.scrollLeft < dateListComponent.scrollWidth - dateListComponent.clientWidth)',
      dateListComponent.scrollLeft < dateListComponent.scrollWidth - dateListComponent.clientWidth
    );
    // TODO: fix bug click not show arrow
    if (dateListComponent.scrollLeft < dateListComponent.scrollWidth - dateListComponent.clientWidth) {
      setShowArrowNext(true);
    } else {
      setShowArrowNext(false);
    }
    console.log(
      'After setState -',
      'showArrowPrev: ',
      showArrowPrev,
      'showArrowNext: ',
      showArrowNext
    );
    console.log('dateListComponent.scrollLeft', dateListComponent.scrollLeft, '\n');
    
  };

  useEffect(() => {
    handleShowArrow();
  }, []);

  return (
    <div className={styles.module}>
      {dateListComponent && showArrowPrev && (
        <button
          className={styles.arrow}
          onClick={() => handleScrollByButton(-200)}
          aria-label={``}
          id="left-arrow"
        >
          <Image src={require('./assets/icon_area.svg')} alt="" />
        </button>
      )}
      <div
        className={clsx(styles.dateContainer, !isMouseDown ? styles.notDragging : '')}
        id="date-list"
        ref={dateListRef}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
        onMouseMove={handleOnMouseMove}
      >
        {dateArrMock.map((dateItem, index) => (
          <CalendarItem
            key={index}
            today={today}
            date={dateItem.date}
            daysInWeek={dateItem.daysInWeek}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        ))}
      </div>
      {dateListComponent && showArrowNext && (
        <button
          className={clsx(styles.arrow, styles.arrowNext)}
          onClick={() => handleScrollByButton(200)}
          aria-label={``}
          id="right-arrow"
        >
          <Image src={require('./assets/icon_area.svg')} alt="" />
        </button>
      )}
    </div>
  );
};
