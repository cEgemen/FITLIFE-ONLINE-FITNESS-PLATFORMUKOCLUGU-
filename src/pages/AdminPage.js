import { useContext } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { SistemKullanicilarContext } from '../context/SistemKullanicilarContext';


export default function AdminPage()
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
    const sistemKullanici = useContext(SistemKullanicilarContext);
     console.log("sistemKullanici",sistemKullanici.sistemKullanicilar)
     if(sistemKullanici.loading === false) 
   {   
    return  <div  className="container-fluid "  style={{backgroundColor:"rgba(256,256,256,0.25)" , height:"94.5%" ,width:"100%"}} >
      <div className='row justify-content-center'>
            <div className='col-6'>
                      <h3 className='text-center'>ADMIN PAGE</h3>
            </div>
      </div>
    <div className="row " >
    <div className="col-6" style={{marginTop:"15%"}}>
       <h4 style={{color:"black"}}>Sistemdeki Kullanici Sayisi</h4> 
              <PieChart
      series={[
        {
          data: [
            { id: 0, value: sistemKullanici.sistemKullanicilar.adminler.length, label: 'Admin' },
            { id: 1, value: sistemKullanici.sistemKullanicilar.danismanlar.length, label: 'Danismanlar' },
            { id: 2, value: sistemKullanici.sistemKullanicilar.antrenorlar.length, label: 'Antrenorler' },
          ],
        },
      ]}
      width={500}
      height={300}
    />
            </div>
        <div className='col-6' style={{marginTop:"15%"}}>
        <h4 style={{color:"black"}}>Sistemdeki Gecmis Kullanici Sayisi</h4>
        <LineChart
      xAxis={[{ data:handelDay(sistemKullanici.sistemKullanicilar.kullaniciHistoryCount) }]}
      series={[
        {
          data: handeleData(sistemKullanici.sistemKullanicilar.kullaniciHistoryCount),
        },
      ]}
      width={500}
      height={300}
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
                     <h4 style={{display:"inline",color:"black"}}>LOADING</h4>
                     <div className="spinner-grow spinner-grow-sm" style={{color:"black"}} role="status">
                    <span className="visually-hidden">Loading...</span>
                   </div>    
                   <div className="spinner-grow spinner-grow-sm " style={{color:"black"}} role="status">
                    <span className="visually-hidden">Loading...</span>
                   </div>    
                   <div className="spinner-grow spinner-grow-sm "  style={{color:"black"}} role="status">
                    <span className="visually-hidden">Loading...</span>
                   </div>    
                            </div>
                      </div>
                </div>
               </div>
         </>
      }

}