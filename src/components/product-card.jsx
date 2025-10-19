import { Link } from "react-router-dom"

export default function ProductCard(props){
    const product = props.product
    return(

        <Link className="w-[250px] m-4 h-[350px]  border shadow-2xl  ">
                <img className="w-full h-[220px] object-cover"src={product.images[0]} />
                <div className="h-[110px] w-full flex flex-col justify-center items-center">
                    <p>{product.productId}</p>
                    <p className="">{product.name}</p>
                    <p>{product.price.toFixed(2)} <span className="line-through">{product.price<product.labeledPrice&&product.labeledPrice.toFixed(2)}</span></p>
                </div>
        </Link>

    )
}