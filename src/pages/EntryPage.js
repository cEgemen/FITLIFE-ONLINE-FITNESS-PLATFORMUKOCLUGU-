import React,{Component} from "react";
import "../styles/EntryPage.css"
class EntryPage extends Component {



render()
{
   return  <div className="container">
          <div className="row">
             <div className="col">
                <h1 className="display-5 text-center page-title" >KOU SPOR SALONU</h1>
            </div>  
          </div>   
          <div className="row row1 justify-content-sm-start">
             <div className="col col-md-4  row-col1   border border-1 border-gray">
             “Fitness yalnızca sağlıklı bir vücudun en önemli anahtarı değildir. O aynı zamanda dinamik ve yaratıcı entelektüel aktivitenin de temelidir.”
            </div>  
            </div>  
            <div className="row row2 justify-content-center ">  
            <div className="col col-md-4 row-col2 border border-1 border-gray">
             “Eğer her zaman yaptığınız fiziksel veya başka türlü şeylere bir limit koyarsanız, bu o çalışmanıza ve tüm hayatınıza sıçrar. Limit yoktur. Onlar sadece eşiklerdir ve onlara takılıp kalmamalısınız, onları geçmelisiniz.”
            </div>  
            </div>  
            <div className="row  row3 justify-content-end ">  
            <div className="col col-md-4 row-col3  border border-1 border-gray" >
             “Sağlığınız ile banka hesabınız aynı şey değildir. Ne kadar fazla yüklerseniz, o kadar fazla da çekebilirsiniz. Egzersiz kral, beslenme ise kraliçedir. Birlikte bir krallığınız olabilir.”
            </div>  
          </div> 
        </div>

}

}

export default EntryPage