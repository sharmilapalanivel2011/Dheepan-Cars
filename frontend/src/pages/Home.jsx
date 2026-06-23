import { API_URL } from "../config"
import { useNavigate, Link } from "react-router-dom"

import AOS from 'aos'
import ProductCard from "../components/ProductCard"
import Categories from "../components/Categories"
import FeaturedProducts from "../components/FeaturedProducts"
import WhyChoose from "../components/WhyChoose"
import "./Home.css"
import { useEffect, useState } from "react"
import axios from "axios"


function Home(){

const navigate = useNavigate()

// ✅ new state
const [products, setProducts] = useState([])


// ✅ fetch products from backend


useEffect(() => {
  axios.get(`${API_URL}/products`)
    .then(res => setProducts(res.data))
    .catch(err => console.log(err))
}, [])

// ✅ show only first 4 products
const featured = products.slice(0, 4)

return(

<div>



<section className="hero">

<div className="hero-content">

<h3 className="welcome">WELCOME TO</h3>

<h1 className="brand">DHEEPAN CARS</h1>

<h2 className="tagline">MINIATURE AND REMOTE VEHICLES</h2>

<p className="description">
Premium scale-model vehicles engineered for collectors and enthusiasts.
Experience the art of miniature automotive excellence.
</p>

<div className="hero-buttons">

<button 
className="explore-btn"
onClick={()=>navigate("/products")}
>
Explore
</button>

<button 
className="shop-btn"
onClick={()=>navigate("/products")}
>
Shop Now
</button>

</div>

</div>

</section>

<Categories/>

{/* 🔥 NEW: Dynamic Featured Products */}


{/* Existing components (unchanged) */}
<FeaturedProducts/>
<WhyChoose/>



</div>

)

}

export default Home