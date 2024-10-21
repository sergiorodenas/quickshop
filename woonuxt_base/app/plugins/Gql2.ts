import dataJson from '../data/product.json';
import stockData from '../data/stockStatus.json';
import getProducts from '../data/getProducts.json';
import getProductsCategories from '../data/getProductsCategories.json';
import getCart from '../data/getCart.json';
import getAllTerms from '../data/getAllTerms.json';
import addToCart from '../data/addToCart.json';


export default defineNuxtPlugin(() => {
    return {
        provide: {
            useGql2: (methodName: string, params: any) => {
                console.log('useGql2:', params, methodName);
                switch (methodName) {
                    
                    case 'getProduct':
                    // return getProducts.data.value.products.nodes.find((product) => product.slug === params.slug);
                    return dataJson;
                    
                    case 'getProducts':
                    return getProducts;
                    
                    case 'getStockStatus':
                    return stockData;
            
                    case 'getProductCategories':
                    return getProducts;
                    
                    case 'getCart':
                    return getCart;
                        
                    case 'getAllTerms':
                            
                    return getAllTerms;
            
                    case 'addToCart':
                    console.log('addTocart');
                    return addToCart;
                                  
                    default:
                    return console.log('Method not found');
                }
            }
        }
    }
})
