import CartView from "@/components/views/cart"
import productServices from "@/services/product"
import userServices from "@/services/user"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

type PropType = {
    setToaster: Dispatch<SetStateAction<{}>>
}
const CartPage = (props: PropType) => {
    const { setToaster } = props
    const session: any = useSession();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    const getAllProducts = async () => {
        const { data } = await productServices.getAllProducts();

        if (data) {
            setProducts(data.data);
        }
    };
    const getCart = async () => {
        const { data } = await userServices.getCart();
        if (data) {
            setCart(data.data);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    useEffect(() => {
        if (session.data?.accessToken) getCart();
    }, [session]);

    return (
        <>
            <Head>
                <title>Cart</title>
            </Head>
            {products &&
                <CartView setToaster={setToaster} cart={cart} products={products} />
            }
        </>
    )
}

export default CartPage