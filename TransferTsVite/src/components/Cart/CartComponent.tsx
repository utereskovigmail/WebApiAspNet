import React from "react";
import APP_ENV from "../../env";
import { Button, Modal } from "antd";

interface CartItem {
    id: number;
    fromCityName: string;
    fromCountryName: string;
    toCityName: string;
    toCountryName: string;
    departureTime: string;
    arrivalTime: string;
    quantity: number;
}

const CartComponent: React.FC = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [data, setData] = React.useState<CartItem[]>([]);

    const fetchData = async (): Promise<void> => {
        try {
            setLoading(true);

            const res = await fetch(
                `${APP_ENV.API_BASE_URL}/api/Carts/GetList`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const result: CartItem[] = await res.json();
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const showCart = () => {
        setOpen(true);
        fetchData();
    };

    return (
        <>
            <Button type="primary" onClick={showCart}>
                Cart
            </Button>

            <Modal
                title="Cart"
                open={open}
                onCancel={() => setOpen(false)}
                onOk={() => setOpen(false)}
                confirmLoading={loading}
            >
                {data.length === 0 ? (
                    <p>No items</p>
                ) : (
                    data.map((cart) => (
                        <div
                            key={cart.id}
                            className="border rounded-2xl w-full p-3 mb-3"
                        >
                            <p>
                                {cart.fromCityName}, {cart.fromCountryName}
                                {" → "}
                                {cart.toCityName}, {cart.toCountryName}
                            </p>
                            <p>
                                {cart.departureTime} → {cart.arrivalTime}
                            </p>
                            <p>Quantity: {cart.quantity}</p>
                        </div>
                    ))
                )}
            </Modal>
        </>
    );
};

export default CartComponent;
