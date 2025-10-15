/* 
productId ,
    name,
    altName ,
    price,
    labeledPrice ,
    description,
    images ,
    stock 

*/

export default function AddProductForm(){
    return(
        <div className="w-full h-full rounded-lg  flex justify-center items-center">
          <div className="w-[500px] h-[600px] bg-white rounded-lg shadow-lg flex flex-col items-center">
             <h1 className="text-3x1 font-bold text-gray-700 m-[10px]">Add Product</h1>
                 <input 
                 className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]" 
                 placeholder="product ID" 
                 />

                  <input 
                 className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]" 
                 placeholder="product Name" 
                 />

                  <input 
                 className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]" 
                 placeholder="Alternative Names" 
                 />

                  <input 
                 className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]" 
                 placeholder="Price" 
                 />

                  <input 
                 className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]" 
                 placeholder="Labelled Price" 
                 />

                  <textarea 
                 className="w-[400px] h-[100px] border border-gray-500 rounded-xl text-center m-[5px]" 
                 placeholder="Description" 
                 />
                 <input
                 className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]" 
                 placeholder="Labelled Price" 
                 />

                 
                  <input 
                 className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]" 
                 placeholder="Stock" 
                 />
          </div>
        </div>
    )
}  

