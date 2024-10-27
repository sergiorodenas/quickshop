import stockData from '../data/stockStatus.json';
import getProducts from '../data/getProducts.json';
import getProductsCategories from '../data/getProductsCategories.json';
import getCart from '../data/getCart.json';
import getAllTerms from '../data/getAllTerms.json';
import addToCart from '../data/addToCart.json';
import updateCartQuantity from '../data/updateCartQuantity.json';
import emptyCart from '../data/emptyCart.json';

export default defineNuxtPlugin(() => {
    return {
        provide: {
            useGql2: (methodName: string, params: any) => {
                console.log('useGql2:', params, methodName);
                switch (methodName) {
                    case 'getProduct':
                        let product = getProducts.data.value.products.nodes.find((product) => product.slug === params.slug);
                        return {
                            "data": {
                                "value": {
                                    "product": product
                                }
                            }                      
                        };

                    case 'getProducts':
                        return getProducts;

                    case 'getStockStatus':
                        return stockData;

                    case 'getProductCategories':
                        return getProductsCategories;

                    case 'getCart':
                        return getCart;

                    case 'getAllTerms':
                        return getAllTerms;

                    case 'addToCart':
                        console.log('addTocart', params);
                        return addToCart;
                        
                    case 'updateCartQuantity':
                        console.log('updateCartQuantity', params);
                        return updateCartQuantity;

                    case 'emptyCart':
                        console.log('Empty cart');
                        return emptyCart;
                    
                    default:
                        return console.log('Method not found');
                }
            }
        }
    }
})
