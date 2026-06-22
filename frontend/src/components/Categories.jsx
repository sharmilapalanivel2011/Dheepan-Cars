import "./Categories.css"

function Categories(){

const categories = [
{
name:"RC Cars",
image:"/images/rc-car.png"
},
{
name:"Diecast Models",
image:"/images/diecast.jpeg"
},
{
name:"Miniature Bikes",
image:"/images/bike.png"
},
{
name:"Trucks",
image:"/images/truck.jpeg"
}
]

return(

<section className="categories" data-aos="fade-up">

<h2 className="section-title">Browse Categories</h2>

<div className="category-grid">

{categories.map((cat,index)=>(
<div className="category-card" key={index}>

<img src={cat.image} alt={cat.name}/>

<h3>{cat.name}</h3>

</div>
))}

</div>

</section>

)

}

export default Categories