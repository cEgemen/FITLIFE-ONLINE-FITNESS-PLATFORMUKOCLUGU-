import error from "../images/error.jpg";
import "../styles/EntryPage.css"

export default function ErrorPage()
{
  return <div className="body" style={{background:`url(${error})`, backgroundRepeat:"no-repeat" ,backgroundSize:"100% 100%"}}>
         <div className="container">
                <div className="row justify-content-center"> 
                   <div className="col-6"> 
                     <h2 className="display-5 text-center">404 NOT FOUND</h2>
                   </div>
                </div>
         </div>
  </div>

}