import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../Shared/Context/CartContext';

const CartCalculation = () => {
    const [cartProducts] = useContext(CartContext);
    const [shippingCost, setShippingCost] = useState(0);

    let totalQuantity = 0;
    let total = 0;
    let totalIncome = 0;

    useEffect(() => {
        // Retrieve shipping cost from local storage
        const shippingData = JSON.parse(localStorage.getItem("shippingOption"));
        if (shippingData) {
            setShippingCost(shippingData.cost || 0);
        }
    }, []);

    for (const product of cartProducts) {
        if (!product.quantity) {
            product.quantity = 1;
        }
        const productPrice = Number(product.ProductPrice) || 0;
        total += productPrice * product.quantity;
        totalQuantity += product.quantity;
        totalIncome += Number(product.totalIncome) || 0;
    }

    // Reset shipping cost and tax if the cart is empty
    const shipping = total > 0 ? shippingCost : 0;
    const tax = 0;
    const grandtotal = total + shipping + tax;

    // Handle coupon or discount logic here if needed
    const model = 0; // Placeholder for discount logic

    return {
        shipping,
        tax,
        cartProducts,
        totalQuantity,
        total,
        grandtotal,
        totalIncome,
        model,
        handleSearchs: () => {}, // Add your handler functions
        handleValues: () => {},
        searchValues: '',
    };
};

export default CartCalculation;