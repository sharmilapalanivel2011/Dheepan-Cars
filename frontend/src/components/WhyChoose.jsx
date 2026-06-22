import "./WhyChoose.css"
import { FaCar, FaLock, FaShippingFast, FaStar } from "react-icons/fa"

function WhyChoose(){

const features = [
{
icon:<FaCar/>,
title:"Premium Models",
desc:"High-quality miniature and remote vehicles built for collectors."
},
{
icon:<FaLock/>,
title:"Secure Payment",
desc:"Safe and secure payment system for all purchases."
},
{
icon:<FaShippingFast/>,
title:"Fast Delivery",
desc:"Quick and reliable shipping across the country."
},
{
icon:<FaStar/>,
title:"Collector Grade",
desc:"Exclusive scale models for enthusiasts and collectors."
}
]

return(

<section className="why" data-aos="fade-up">

<h2 className="section-title">Why Choose Dheepan Cars</h2>

<div className="why-grid">

{features.map((item,index)=>(
<div className="why-card" key={index}>

<div className="why-icon">{item.icon}</div>

<h3>{item.title}</h3>

<p>{item.desc}</p>

</div>
))}

</div>

</section>

)

}

export default WhyChoose