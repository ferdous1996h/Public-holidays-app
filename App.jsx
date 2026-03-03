import { useEffect, useState } from 'react';
export default function App() {
  const [countryName, setCountryName] = useState([]);
  const [selectOne, setSelectOne] = useState('NL');
  const [hollyArray, setHollyArray] = useState([]);

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

  useEffect(() => {
    const date = new Date().getFullYear();

    let ignore = false;
    async function getHoli() {
      const res = await fetch(
        `https://openholidaysapi.org/PublicHolidays?countryIsoCode=${selectOne}&validFrom=${date}-01-01&validTo=${date}-12-31&languageIsoCode=en`,
      );
      const data = await res.json();
      console.log(data);
      if (!ignore) {
        setHollyArray(data);
      }
    }
    getHoli();
    return () => (ignore = true);
  }, [selectOne]);

  function punchData(e) {
    console.log(e.target.value);
    setSelectOne(e.target.value);
  }
  return (
    <main className="box">
      <h1>Public holidays app</h1>
      <form onChange={punchData}>
        <select name="holyInfo" id="holyInfoId">
          {/* <option value="test">Test</option> */}
          {/* <option value="">Select one</option> */}
          {countryName.map((ele, i) => {
            if (ele.iso === 'NL') {
             return (<option value={ele.iso} key={i} selected="selected">
                {ele.name}
              </option>);
            } else {
              return (
                <option value={ele.iso} key={i}>
                  {ele.name}
                </option>
              );
            }
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
