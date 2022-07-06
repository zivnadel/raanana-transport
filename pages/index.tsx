import type { NextPage } from 'next'
import LinkButton from '../components/ui/buttons/LinkButton'

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center h-screen p-5 text-center align-center">
      <h1 className="mb-10 text-5xl font-semibold mt-36 text-primary md:mt-64">
        דיווח על עדכון ושינוי שעות ההסעה
      </h1>
      <p className="mb-2 text-2xl">
        .אנא הקפידו על הכנסת שם מלא ופרטים מדויקים
      </p>
      <p className="text-2xl">
        .לחצו על הכפתור למטה או על הכפתור בתפריט למעבר לטופס הדיווח
      </p>
      <LinkButton text="דיווח שעות" href="#" chevron={true} />
    </div>
  )
}

export default Home
