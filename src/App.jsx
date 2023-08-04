import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'; 
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import { MultiSelect } from './components/MultiSelect';
import { services, countries } from '../constants';
import { movieQuery } from './utils/movieQuery';

function App() {
  const [step, setStep] = useState(0);

  const [movie, setMovie] = useState("");
  const [outputMovieName, setOutputMovieName] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [formData, setFormData] = useState({
    movie: "",
    services: [],
    countries: [],
  });

  const handleNext = () => {
    setStep(step + 1);
  }
  const handleBack = () => {
    setStep(step - 1);
  }

  const handleOnChange = (e) => {
    setMovie(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(movie, selectedServices, selectedCountries);

    let cleanSelectedServices = [];
    for (const service of selectedServices) cleanSelectedServices.push(service.value);

    let cleanSelectedCountries = [];
    for (const countries of selectedCountries) cleanSelectedCountries.push(countries.value);


    const [queryOutput, queryMovieName] = await movieQuery(movie, cleanSelectedServices, cleanSelectedCountries, selectedCountries);
    console.log("RECEIVED QUERY OUTPUT:", queryOutput);

    setTableData(queryOutput);
    setOutputMovieName(queryMovieName);

    setStep(0);
    setMovie("");
    setSelectedServices([]);
    setSelectedCountries([]);

    console.log("Exiting onSubmit, tableData is now:", tableData);
  }

  const colorStylesServices = {
    control: (styles) => ({...styles}),
    option: (styles, {data, isDisable, isFocused, isSelected}) => ({...styles, color: data.color}),
    multiValue: (styles, {data}) => ({...styles, backgroundColor: data.color}),
    multiValueLabel: (styles, {data}) => ({...styles, color: "#fff"}),
    multiValueRemove: (styles, {data}) => ({...styles, color: "#fff", cursor: "pointer", ':hover':{color: "#fff"}}),
  }

  const colorStylesCountries = {
    control: (styles) => ({...styles}),
    multiValue: (styles, {data}) => ({...styles, backgroundColor: data.color || "#6CA6E0"}),
    multiValueLabel: (styles, {data}) => ({...styles, color: data.text || "#fff"}),
    multiValueRemove: (styles, {data}) => ({...styles, color: data.text || "#fff", cursor: "pointer", ':hover':{color: "#fff"}}),
  }

  return (
    <div className='min-h-screen flex justify-center bg-cyan-100'>
        <div className='mt-40'>
            <h1 className='text-8xl font-source'>Movie Finder</h1>
            <div className='flex justify-center mt-4 text-lg'>
                <h2 className='text-2xl'>See which streaming services have your favorite movies!</h2>
            </div>
            <form onSubmit={handleSubmit} className='mt-10 flex justify-between gap-3'>
                <section className={step === 0 ? 'block w-full' : 'hidden'}>
                    <label className='text-lg'>Enter a movie name</label>
                    <input value={movie} className='w-full h-[40px] rounded-lg text-lg mt-2 p-2' onChange={handleOnChange} />
                </section>

                <section className={step === 1 ? `block w-full` : 'hidden'}>
                    <label className='text-lg'>Which services would you like to search?</label>
                    <MultiSelect options={services} value={selectedServices} onChange={setSelectedServices} selectAllLabel="All Streaming Services" styles={colorStylesServices} />
                </section>

                <section className={step === 2 ? `block w-full` : 'hidden'}>
                    <label className='text-lg'>Which countries would you like to search in?</label>
                    <MultiSelect options={countries} value={selectedCountries} onChange={setSelectedCountries} selectAllLabel="All Available Countries" styles={colorStylesCountries} />
                </section>
                
                <button type='button' onClick={handleBack} disabled={step==0} className='font-medium rounded-lg bg-rose-500	h-[40px] w-20 self-end p-2'>
                    Back
                </button>
                <button type='button' onClick={handleNext} className={`font-medium rounded-lg bg-sky-500 h-[40px] w-20 self-end ${step == 2 ? 'hidden' : 'block'} p-2`} >
                    Next
                </button>
                <button type='submit' className={`font-medium rounded-lg bg-emerald-600 h-[40px] w-20 self-end ${step == 2 ? 'block' : 'hidden'} p-2`}>
                    Search
                </button>
            </form>

            <div className='w-full bg-cyan-100 mt-4 text-center '>
                {outputMovieName && <h2 className='text-2xl'>Showing results for: {tableData.movie}</h2>}
                {tableData.map((data) => (
                    <DataTable key={data.country} header={data.country} value={data.data} className='mt-10'>
                        <Column field='service' header='Service' />
                        <Column field='streamingType' header='Streaming Type' />
                    </DataTable>
                    // <div>{data.country}</div>
                ))}
            </div>
            
        </div>
    </div>
  )
}

export default App
