import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoAttachOutline, IoSaveOutline, IoTrashOutline, IoCloudDownloadOutline, IoArrowUndoOutline, IoReorderFourOutline, IoAddCircleOutline, IoRemoveCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import DownloadFiles from '../Components/DownloadFiles';
import GlobalApi from '../Services/GlobalApi';

function Home() {
    const {register, reset, formState:{errors}, handleSubmit} = useForm()
    const [urlFiles, setUrlFiles] = useState([])
    const [showShowDownloads, setShowDownloads] = useState(false)
    const [complete, setComplete] = useState(true)
    const [limitFilesUser, setLimitFilesUser] = useState(5)
    const [limitFiles, setLimitFiles] = useState(5)

    const addUrl = (data) => {
        if (!data.url) {
            return 
        }
        const newFiles = urlFiles.concat([data.url])
        setUrlFiles(newFiles)
        reset()
    }

    const deleteUrl = (index) => {
        let newFiles = [...urlFiles];
        newFiles.splice(index, 1);
        console.log(newFiles);
        setUrlFiles(newFiles);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            console.log("Send submit")
            handleSubmit(addUrl)
        }
    }

    const changeLimit = () => {
        setLimitFiles(limitFilesUser);
    }

    const cleanQueue = () => {
        setShowDownloads(false);
        setComplete(true);
        GlobalApi.axiosGet('queue/clean').then((res) => {
            console.log('res', res)
        })
    }

    return (
        <div>
            { !showShowDownloads ? <form className='mt-5' onSubmit={handleSubmit(addUrl)}>
                <h3 className=' text-[20px] font-bold mt-3'>1. Ingresar URL <small>(enter para guardar)</small></h3>
                <div  className='flex flex-row'>
                    <div className='flex w-full'>
                        <div className='flex bg-white shadow-lg p-3 rounded-lg mt-5 w-full'>
                            <IoAttachOutline className='text-[20px] mt-2 text-gray-400'/>
                            <input 
                            className='outline-none ml-2 w-full border-none focus:border-none' 
                            type="text"
                            readOnly={!complete}
                            style={{"--tw-ring-shadow": 'none'}}
                            placeholder='Url' 
                            {...register("url", {
                                required: {
                                    value: true,
                                    message: "Este campo es requerido"
                                },
                                pattern: {
                                    value: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
                                    message: "La URL no es válida"
                                }
                            })} 
                            onKeyDown={handleKeyDown}/>
                        </div>
                        <div>
                            {errors.url &&( <p className='text-red-500'>💩 {errors.url.message}</p> )}
                        </div>
                    </div>
                    <button type="submit" className='bg-teal-400 rounded-full text-white ml-5 mt-5 flex items-center' disabled={!complete}>
                        <IoSaveOutline className='mr-3 text-[20px]'/> Guardar
                    </button>
                </div>
            </form> : null }

            {urlFiles.length > 0 && !showShowDownloads ?<table className='mt-5 w-full'>
                <thead>
                    <tr>
                        <td colSpan={2}><p className='text-[20px] flex font-bold mt-5'>Listado de URLs</p></td>
                    </tr>
                </thead>
                <tbody >
                    {urlFiles.map((item, index)=>(
                        <tr key={index}>
                            <td>
                                <div className='shadow-lg rounded-lg mt-2'>
                                    <div className='p-2 border-none'> {(index + 1) + " - " + item}</div>
                                </div>
                            </td>
                            <td>
                                <button 
                                type="button" 
                                className='bg-red-500 rounded-full text-white ml-5 mt-5 flex items-center' 
                                disabled={!complete}
                                onClick={(e) => {e.preventDefault(); deleteUrl(index)}} >
                                    <IoTrashOutline className='text-[20px]'/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> : null}

            <p className='mt-5 text-[20px] font-bold'>2. Límite de concurrencias: {limitFiles}</p>
            <div className='flex flex-row mt-1 w-full gap-5 items-center'>
                <button className='bg-green-400 rounded-full text-white mr-5 mt-2 flex items-center' onClick={() => {setLimitFilesUser(limitFilesUser - 1)}}>
                    <IoRemoveCircleOutline className='text-[20px]'/>
                </button>
                <div className='flex bg-white shadow-lg rounded-lg p-2'>
                    <IoReorderFourOutline className='text-[20px] mt-3 text-gray-400'/>
                    <input 
                    className='outline-none text-[18px] ml-2 w-full border-none focus:border-none' 
                    type="number"
                    value={limitFilesUser}
                    step={1}
                    readOnly
                    style={{"--tw-ring-shadow": 'none'}}
                    placeholder='Limite de descargas'/>
                </div>
                <button className='bg-green-400 rounded-full text-white ml-5 mt-2 flex items-center' onClick={() => {setLimitFilesUser(limitFilesUser  + 1)}}>
                    <IoAddCircleOutline className='text-[20px]'/>
                </button>
                <button className='bg-teal-400 rounded-full text-white ml-5 mt-2 flex items-center' onClick={()=>{changeLimit()}}>
                    <IoSaveOutline className='text-[20px] mr-5'/>
                    Cambiar Limite
                </button>
                {urlFiles.length > 0 && !showShowDownloads ? 
                <button className='bg-blue-600 rounded-full text-white ml-5 mt-2 flex items-center' onClick={()=>{setComplete(false); setShowDownloads(true);}}>
                    <IoCloudDownloadOutline className='text-[20px] mr-5'/>
                    Iniciar descarga
                </button> : null }
            </div>

            {urlFiles.length > 0 && showShowDownloads ? <div className='flex mt-5'>
                <h2 className='text-[20px] flex font-bold mt-5'>Descargando URLs <small className='ml-3 mt-1'>(Limite de descargas: {limitFiles})</small></h2>
                { <button className='bg-green-600 rounded-full text-white ml-5 mt-2 flex items-center' onClick={()=>{cleanQueue();}}>
                    <IoArrowUndoOutline className='text-[20px] mr-5'/>
                    Cancelar todo y regresar al listado
                </button>}
                {/* { !complete && <button className='bg-green-600 rounded-full text-white ml-5 mt-2 flex items-center' onClick={()=>{cleanQueue();}}>
                    <IoCloseCircleOutline className='text-[20px] mr-5'/>
                    Editar listado
                </button>} */}
            </div> : null }

            {urlFiles.length > 0 && showShowDownloads ? <DownloadFiles files={urlFiles} limit={limitFiles} isCompleted={()=> {console.log("Complete;", showShowDownloads); setComplete(true); }}></DownloadFiles> :  null}

        </div>
    )
}

export default Home