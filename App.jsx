import { useEffect, useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
const queryClient = new QueryClient();

function HolyDayApp() {
  const [countryName, setCountryName] = useState([]);
  const [selectOne, setSelectOne] = useState('NL');

  useEffect(() => {
    async function allCountry() {
      const res = await fetch(
        `https://openholidaysapi.org/Countries?languageIsoCode=en`,
      );
      const data = await res.json();
      setCountryName(
        data.map(ele => {
          const name = ele.name[0].text;
          const iso = ele.isoCode;
          return { name, iso };
        }),
      );
    }
    console.log(countryName);
    allCountry();
  }, []);
// React Query
  const {
    isLoading,
    error,
    data = [],
  } = useQuery({
    queryKey: ['hollyInfoApi', selectOne],
    queryFn: async () => {
      const date = new Date().getFullYear();
      const res = await fetch(
        `https://openholidaysapi.org/PublicHolidays?countryIsoCode=${selectOne}&validFrom=${date}-01-01&validTo=${date}-12-31&languageIsoCode=en`,
      );
      return await res.json();
    },
  });

  const hollyArray = data;

  function punchData(e) {
    console.log(e.target.value);
    setSelectOne(e.target.value);
  }
  return (
    <main className="box">
      <h1>Public holidays app</h1>
      {isLoading && <p>Loading... ...</p>}
      {error && <p>{error.message}</p>}
      <form>
        <select
          value={selectOne}
          name="holyInfo"
          id="holyInfoId"
          onChange={punchData}
        >
          {/* <option value="">Select one</option> */}
          {countryName.map((ele, i) => {
            return (
              <option value={ele.iso} key={i}>
                {ele.name}
              </option>
            );
          })}
        </select>
      </form>
      <section className="holydayInfo">
        {hollyArray.map(day => {
          const date = new Date(day.startDate);
          const month = date.toLocaleDateString('default', { month: 'long' });
          const tarikh = date.getDate();
          return (
            <p key={day.id}>
              {' '}
              -{`${tarikh} ${month}`}-{day.name[0].text}
            </p>
          );
        })}
      </section>
    </main>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HolyDayApp />
    </QueryClientProvider>
  );
}
