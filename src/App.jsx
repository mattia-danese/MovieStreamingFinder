import { useState, Suspense } from 'react';
import { PulseLoader } from "react-spinners/PulseLoader";
import ClipLoader from "react-spinners/ClipLoader";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'; 
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import { MultiSelect } from './components/MultiSelect';
import { Button } from './components/Button';
import { services, countries } from '../constants';
import { movieQuery } from './utils/movieQuery';

function App() {
  const [step, setStep] = useState(0);

  const [mediaTitle, setMediaTitle] = useState("");
  const [outputMovieName, setOutputMovieName] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mediaType, setMediaType] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChooseMovieOrTV = (e) => {
    setStep(step + 1);
    setMediaType(e.target.name);
  }

  const handleNext = () => {
    setStep(step + 1);
  }
  const handleBack = () => {
    setStep(step - 1);
  }

  const handleOnChange = (e) => {
    setMediaTitle(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    let cleanSelectedServices = [];
    for (const service of selectedServices) cleanSelectedServices.push(service.value);

    let cleanSelectedCountries = [];
    for (const countries of selectedCountries) cleanSelectedCountries.push(countries.value);


    const [queryOutput, queryMovieName] = await movieQuery(mediaTitle, mediaType, cleanSelectedServices, cleanSelectedCountries, selectedCountries);

    setTableData(queryOutput);
    setOutputMovieName(queryMovieName);

    setStep(0);
    setMediaTitle("");
    setSelectedServices([]);
    setSelectedCountries([]);
    setIsSubmitted(false);
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
    <div className='min-h-screen flex justify-center bg-cyan-100 '>
        <div className='mt-40'>
            <h1 className='text-8xl font-source'>Where To Watch</h1>
            <div className='flex justify-center mt-4 text-lg'>
                <h2 className='text-2xl'>See which streaming services have your favorite movies and TV shows!</h2>
            </div>
            <form onSubmit={handleSubmit} className='mt-10 '>
                <section className={step === 0 ? 'block w-full text-center' : 'hidden'}>
                    <div className='text-lg'>Are you looking for a movie or TV show?</div>
                
                    <div className='flex gap-3 justify-center'>
                        <Button type="button" message="Movie" name="movie" handleOnClick={handleChooseMovieOrTV} styles={`bg-white mt-4 self-end font-medium rounded-lg h-[40px] w-20 p-2`} />
                        <Button type='button' message="TV Show" name="series" handleOnClick={handleChooseMovieOrTV}  styles={`bg-white self-end font-medium rounded-lg h-[40px] w-24 p-2`} />
                    </div>
                </section>
                
                <section className={step === 1 ? 'block w-full flex justify-between gap-3' : 'hidden'}>
                    <div className='w-full'>
                        <label className='text-lg'>Enter a {mediaType === 'movie' ? 'Movie' : 'TV Show'} name</label>
                        <input value={mediaTitle} className='w-full h-[40px] rounded-lg text-lg mt-2 p-2' onChange={handleOnChange} />
                    </div>
            
                    <div className='flex gap-3'>
                        <Button type="button" message="Back" handleOnClick={handleBack} styles={`self-end font-medium rounded-lg bg-rose-500 h-[40px] w-20 p-2`} />
                        <Button type='button' message="Next" handleOnClick={handleNext} disabled={!mediaTitle}  styles={`self-end font-medium rounded-lg ${!mediaTitle ? 'bg-gray-300' : 'bg-sky-500'} h-[40px] w-20 p-2`} />
                    </div>
                </section>

                <section className={step === 2 ? `block w-full flex justify-between gap-3` : 'hidden'}>
                    <div className='w-full'>
                        <label className='text-lg'>Which services would you like to search?</label>
                        <MultiSelect options={services} value={selectedServices} onChange={setSelectedServices} selectAllLabel="All Streaming Services" styles={colorStylesServices} />    
                    </div>

                    <div className='flex gap-3'>
                        <Button type="button" message="Back" handleOnClick={handleBack} styles='self-end font-medium rounded-lg bg-rose-500 h-[40px] w-20 p-2' />
                        <Button type='button' message="Next" handleOnClick={handleNext} disabled={selectedServices.length === 0} styles={`self-end font-medium rounded-lg ${selectedServices.length === 0 ? 'bg-gray-300' : 'bg-sky-500'} h-[40px] w-20 p-2`} />
                    </div>
                    
                </section>

                <section className={step === 3 ? `block w-full flex justify-between gap-3` : 'hidden'}>
                    <div className='w-full'>
                        <label className='text-lg'>Which countries would you like to search in?</label>
                        <MultiSelect options={countries} value={selectedCountries} onChange={setSelectedCountries} selectAllLabel="All Available Countries" styles={colorStylesCountries} />
                    </div>

                    <div className='flex gap-3'>
                        <Button type="button" message="Back" handleOnClick={handleBack} styles='self-end font-medium rounded-lg bg-rose-500 h-[40px] w-20 p-2' />
                        <button type='submit' disabled={selectedCountries.length === 0} className={`font-medium rounded-lg ${selectedCountries.length === 0 ? 'bg-gray-300' : 'bg-emerald-600'} h-[40px] w-20 self-end  p-2`}>
                            Search
                        </button>
                    </div>
                </section>
            </form>

            <div className='w-full bg-cyan-100 mt-8 text-center '>
                {outputMovieName ? <h2 className='text-2xl'>Showing results for: {outputMovieName}</h2> : isSubmitted ? <ClipLoader /> : ""}
                {tableData.map((data, i) => (
                    <DataTable key={data.country} header={data.country} value={data.data} className={`mt-4 ${i === tableData.length-1 ? 'mb-10' : ''}`}>
                        <Column field='service' header='Service' />
                        <Column field='streamingType' header='Streaming Type' />
                    </DataTable>
                ))}
            </div>
            
        </div>
    </div>
  )
}

export default App
