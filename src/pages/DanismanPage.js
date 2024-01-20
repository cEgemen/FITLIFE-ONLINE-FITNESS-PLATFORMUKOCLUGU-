import  React,{useContext} from 'react';
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from '@mui/x-charts/BarChart';
import { IlerlemeContext } from '../context/IlerlemeContext';


export default function DanismanPage() {
    const ilerleme = useContext(IlerlemeContext);
    if(ilerleme.loading === false)
    {    
  
    const handeleData = (datas) => {
      let data= [];
       if(datas.length !== 0)
      {   for(let i= 0;i<datas.length;i++)
      {
        data.push(Number.parseInt(datas[i]));
      }    
          return data;
    }    
    return  [0]; 
    }
    
    const handelDay = (datas) => {
      let day= [];
      if(datas.length !== 0) 
      { for(let i= 0;i<datas.length;i++)
      {
        day.push(i+1);
      }      
       return day;
    } 
    return [0];
    }
  return <div className="container-fluid " style={{backgroundColor:"rgba(256,256,256,0.5)"}}>
        <div className='row justify-content-center'>
              <div className='col-6'>
                       <h3 className='text-center '>DANISMAN PAGE</h3>
              </div>
        </div>
        <div className="row mt-4">
            <div className="col-4">
              <h5 className='text-center'>Kilo Ilerleme Verisi</h5>
              <BarChart
          xAxis={[{ scaleType: 'band', data: ['kilo'] }]}
          series={ilerleme.ilerleme.kilo.map(b => { return {data:[b]}})}
          width={400}
          height={250}
    />
            </div>
            <div className="col-4">
            <h5 className='text-center'>Kas Kütle Ilerleme Verisi</h5>
            <LineChart
      xAxis={[{ data: handelDay(ilerleme.ilerleme.kas) }]}
      series={[
        {
          data: handeleData(ilerleme.ilerleme.kas),
        },
      ]}
      width={400}
      height={250}
    />
            </div>
            <div className="col-4">
            <h5 className='text-center'>Boy Ilerleme Verisi</h5>
            <BarChart
          xAxis={[{ scaleType: 'band', data: ['boy'] }]}
          series={ilerleme.ilerleme.boy.map(b => { return {data:[b]}})}
          width={400}
          height={250}
    />
            </div>
        </div>
        <div className="row mt-5">
            <div className="col-4">
            <h5 className='text-center'>Kalori Ilerleme Verisi</h5>
            <LineChart
      xAxis={[{ data: handelDay(ilerleme.ilerleme.kalori) }]}
      series={[
        {
          data: handeleData(ilerleme.ilerleme.kalori),
        },
      ]}
      width={400}
      height={250}
    />
            </div>
            <div className="col-4">
            <h5 className='text-center'>Yag Oranı Ilerleme Veri</h5>
            <BarChart
          xAxis={[{ scaleType: 'band', data: ['yag'] }]}
          series={ilerleme.ilerleme.yag.map(b => { return {data:[b]}})}
          width={400}
          height={250}
    />
            </div>
            <div className="col-4">
            <h5 className='text-center'>Kütle Indeks Ilerleme Verisi</h5>
            <LineChart
      xAxis={[{ data: handelDay(ilerleme.ilerleme.kütleIndex) }]}
      series={[
        {
          data: handeleData(ilerleme.ilerleme.kütleIndex),
        },
      ]}
      width={400}
      height={250}
    />
           </div>
        </div>
    </div>
}
  else{
    return <>
           <div > 
            <div className='container' style={{
            marginTop:"15%" , marginLeft:"25%"}}>
                  <div className='row justify-content-center'>
                        <div className='col-6'>
                 <h4 style={{display:"inline",color:"white"}}>LOADING</h4>
                 <div className="spinner-grow spinner-grow-sm" style={{color:"white"}} role="status">
                <span className="visually-hidden">Loading...</span>
               </div>    
               <div className="spinner-grow spinner-grow-sm " style={{color:"white"}} role="status">
                <span className="visually-hidden">Loading...</span>
               </div>    
               <div className="spinner-grow spinner-grow-sm "  style={{color:"white"}} role="status">
                <span className="visually-hidden">Loading...</span>
               </div>    
                        </div>
                  </div>
            </div>
           </div>
     </>
  }
}