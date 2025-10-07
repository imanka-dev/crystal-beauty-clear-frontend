
export default function ProductCard(props){
    console.log(props)
    return(

        <div className="product-card">
            <h1>Product Name</h1>
            <p>Product Description</p>
            <p>product price</p>
            <button>add to cart</button>
        </div>

    )
}