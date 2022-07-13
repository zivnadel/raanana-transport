import type { NextPage } from 'next';
import LinkButton from '../components/ui/buttons/LinkButton';

const Home: NextPage = () => {
  return (
    <div className="align-center flex h-screen flex-col items-center p-5 text-center">
      <h1 className="mb-10 mt-36 text-5xl font-semibold text-primary md:mt-64">
        דיווח על עדכון ושינוי שעות ההסעה
      </h1>
      <p className="mb-2 text-2xl">
        .אנא הקפידו על הכנסת שם מלא ופרטים מדויקים
      </p>
      <p className="text-2xl">
        .לחצו על הכפתור למטה או על הכפתור בתפריט למעבר לטופס הדיווח
      </p>
      <LinkButton text="דיווח שעות" href="/report-hours" chevron={true} />
    </div>
  );
};

export default Home;
