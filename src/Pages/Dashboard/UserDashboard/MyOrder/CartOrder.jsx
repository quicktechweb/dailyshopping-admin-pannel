import PropTypes from 'prop-types';

const CartOrder = ({ cart }) => {
    return (
        <div>
            {cart?.map((single) => (
                <div key={single._id} className="pb-3">
                    <div className=" max-w-md mx-auto shadow-lg rounded-lg">
                        <div className="grid grid-cols-12 gap-1">
                            <div className="col-span-6">
                                <img
                                    className="object-cover h-48 w-full rounded"
                                    src={single.img || single.images}
                                    alt="Product"
                                />
                            </div>
                            <div className="col-span-6 ms-2 p-3">
                                <h2 className="text-sm font-bold">Title: {single.title}</h2>
                                <p className="font-semibold">Price: {single.ProductPrice}</p>
                                <p className="font-semibold">Quantity: {single.quantity}</p>
                                {single.selectedSize && <p className="font-semibold">Size: {single.selectedSize}</p>}
                                {single.selectedColor && <p className="font-semibold">Color: {single.selectedColor}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

CartOrder.propTypes = {
    cart: PropTypes.array.isRequired,
};

export default CartOrder;
