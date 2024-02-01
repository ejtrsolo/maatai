import React, { useEffect, useRef, useState } from 'react'
import GlobalApi from '../Services/GlobalApi'
import Utils from '../Utils/Utils'

function DownloadFiles({files, limit, isCompleted}) {
    const [progressFiles, setProgressFiles] = useState([])
    const [currentF, setCurrentF] = useState([])
    const isFirstRun = useRef(true);
    const isFirstRun2 = useRef(true);
    useEffect(() => {
        if (isFirstRun.current) {
            const newData = files.map((item, index) => ({ index: index, url: item, message: "", progress: 0, status: "pending", total: 0 }))
            setLocal('progressFiles', newData)
            setProgressFiles(newData)
            setLocal('currentFiles', [])
            setLocal('currentLimit', limit, false)
            setCurrentF([])

            // Primero correr las descargas
            console.log("first use")
            addMoreUrls(true, limit)
            // Pasados 2 segundos, correr el intervalo que checará cada 2 segundos el status de los archivos.
            const interval = setInterval(() => {
                updateStatusFiles()
            }, 2 * 1000);
            setLocal('interval', interval, false);
            isFirstRun.current = false;
        }
        
        // Clearing the interval
        return () => clearInterval(getLocal('interval', false));
    }, [])

    useEffect(() => {
        if (!isFirstRun2.current) {
            setLocal('currentLimit', limit, false)
            console.log("limit use")
            addMoreUrls(false, limit)
        } else {
            isFirstRun2.current = false;
        } 
    }, [limit])

    const setLocal = (variable, value, isJson = true) => {
        localStorage.setItem(variable, isJson ? JSON.stringify(value) : value)
    } 
    const getLocal = (variable, isJson = true) => {
        const val = localStorage.getItem(variable)
        return isJson ?  JSON.parse(val) : val
    }

    const countActives = () => {
        return getLocal('progressFiles').filter((item) => Utils.fileStatusActive.includes(item.status)).length
    }

    const addMoreUrls = (isFirst, limit) => {
        const actives = countActives()
        const currentFiles = getLocal('currentFiles')
        if(actives < limit && files.length > currentFiles.length) {
            const countNewElements = limit - actives
            let newItems = []
            for( let i = 0; i < countNewElements; i++) {
                const index = i + currentFiles.length
                if(index < files.length){
                    const element = { index: index, url: files[index], message: "", progress: 0, status: "pending", total: 0 }
                    newItems.push(element)
                }
            }
            const newItemsSend = newItems.map(item => item.url)
            const newData = [...currentFiles, ...newItems];
            setLocal('currentFiles', newData)
            setCurrentF(newData);
            executeDownloadFiles(isFirst, newItemsSend)
        }
    }

    const executeDownloadFiles = (isFirst, items) => {
        const params = {urls: items}
        
        GlobalApi.axiosPost(isFirst ? 'download' : 'download/add', params).then(() => {
            console.log('res download')
        })
    }

    const updateStatusFiles = () => {
        const equivMB = 1024*1024;
        GlobalApi.axiosGet('status').then((res) => {
            // Buscar progresos y actualizarlos
            const withoutUrl = res.data.data?.filter(item => !item.downloadId)
            if (withoutUrl.length > 0) {
                return;
            }
            const result = files.map((item, index) => {
                let itemFind = res.data.data?.find((resultItem) => item == resultItem.downloadId)
                const num = itemFind ? itemFind.totalSize / equivMB : 0

                return {
                    index: index,
                    url: item,
                    message: itemFind ? itemFind.message : "",
                    progress: itemFind && itemFind.progress > 0 ? itemFind.progress : 0,
                    status: itemFind ? itemFind.status : "pending",
                    total: Math.round(num * 100) / 100
                };
            })
            if(result.length > 0){
                setLocal('progressFiles', result)
                setProgressFiles(result)
            }
            let completed = 0
            let actives = 0;
            // Validar si todos los archivos ya terminaron
            res.data.data?.forEach(item => {
                if (Utils.fileStatusCompleted.includes(item.status)) {
                    completed++;
                }
                if (Utils.fileStatusActive.includes(item.status)) {
                    actives++;
                }
            });
            const currentLimit = getLocal('currentLimit', false)
            if(actives < currentLimit ) {
                addMoreUrls(false, currentLimit);
            }
            if (completed >= files.length) {
                const inter = getLocal('interval', false)
                console.log("limpiando interval: ", inter)
                clearInterval(inter);
                isCompleted()
            }
        })
    }

    return (
        <div className="flex flex-col gap-2 w-full mt-6">
            {progressFiles.map((item) => (
                <div key={item.index}>
                    <div className={"mb-1 text-base font-medium dark:text-white"}>{item.index + " - " + item.url}</div>
                    { item.index < currentF.length && <div className={"w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700"}>
                        <div className={"bg-green-600 text-xs font-medium text-green-100 text-center p-0.5 leading-none rounded-full transition-all ease-in-out duration-500"} style={{width: (item.progress > 0 ? item.progress : 0) + "%"}}>
                            {(item.progress > 0 ? item.progress : 0) + "%"}
                        </div>
                    </div> }
                </div>
                
            ))}
        </div>
    )
}

export default DownloadFiles