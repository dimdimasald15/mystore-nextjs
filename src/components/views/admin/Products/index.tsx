import Button from "@/components/ui/Button";
import styles from "./Products.module.scss";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product.type";
import { convertIDR } from "@/utils/currency";
import ModalAddProduct from "./ModalAddProduct";
import { useSession } from "next-auth/react";
import ModalUpdateProduct from "./ModalUpdateProduct";
import ModalDeleteProduct from "./ModalDeleteProduct";

type PropTypes = {
    products: Product[];
    setToaster: Dispatch<SetStateAction<{}>>;
};

const ProductsAdminView = (props: PropTypes) => {
    const { products, setToaster } = props;
    const [productsData, setProductsData] = useState<Product[]>([]);
    const [addProduct, setAddProduct] = useState(false);
    const [updatedProduct, setUpdatedProduct] = useState<Product | {}>({});
    const [deletedProduct, setDeletedProduct] = useState<Product | {}>({});
    const session: any = useSession();

    useEffect(() => {
        setProductsData(products);
    }, [products]);

    return (
        <div>
            <AdminLayout>
                <div className={styles.products}>
                    <h1>Products Management</h1>
                    <Button
                        type="button"
                        variant="primary"
                        className={styles.products__btnAdd}
                        onClick={() => setAddProduct(true)}
                    >
                        <i className="bx bx-plus" /> Add Product
                    </Button>
                    <table className={styles.products__table}>
                        <thead>
                            <tr>
                                <th rowSpan={2}>#</th>
                                <th rowSpan={2}>Image</th>
                                <th rowSpan={2}>Name</th>
                                <th rowSpan={2}>Category</th>
                                <th rowSpan={2}>Price</th>
                                <th colSpan={2}>Stock</th>
                                <th rowSpan={2}>Action</th>
                            </tr>
                            <tr>
                                <th>Size</th>
                                <th>Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productsData.map((product, index) => (
                                <>
                                    <tr key={product.id}>
                                        <td rowSpan={Object.keys(product.stock).length}>{index + 1}</td>
                                        <td rowSpan={Object.keys(product.stock).length}>
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={100}
                                                height={100}
                                                className={styles.products__image}
                                            />
                                        </td>
                                        <td rowSpan={Object.keys(product.stock).length}>{product.name}</td>
                                        <td rowSpan={Object.keys(product.stock).length}>{product.category}</td>
                                        <td rowSpan={Object.keys(product.stock).length}>{convertIDR(product.price)}</td>
                                        <td>{product.stock[0].size}</td>
                                        <td>{product.stock[0].qty}</td>
                                        <td rowSpan={Object.keys(product.stock).length}>
                                            <div className={styles.products__table__action}>
                                                <Button
                                                    type="button"
                                                    variant="warning"
                                                    onClick={() => setUpdatedProduct(product)}
                                                    className={styles.products__table__action__button}
                                                >
                                                    <i className="bx bx-edit"></i>
                                                </Button>
                                                <Button type="button" variant="danger"
                                                    className={styles.products__table__action__button}
                                                    onClick={() => setDeletedProduct(product)}
                                                >
                                                    <i className="bx bx-trash"></i>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                    {product.stock.map((stock: { size: string, qty: number }, index: number) => (
                                        <>
                                            {index > 0 && (
                                                < tr key={stock.size}>
                                                    <td>{stock.size}</td>
                                                    <td>{stock.qty}</td>
                                                </ tr >
                                            )}
                                        </>
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AdminLayout >
            {addProduct &&
                <ModalAddProduct
                    setProductsData={setProductsData}
                    setAddProduct={setAddProduct}
                    setToaster={setToaster}
                    session={session}
                />
            }
            {Object.keys(updatedProduct).length && (
                <ModalUpdateProduct
                    updatedProduct={updatedProduct}
                    setUpdatedProduct={setUpdatedProduct}
                    setProductsData={setProductsData}
                    setToaster={setToaster}
                    session={session}
                />
            )}
            {Object.keys(deletedProduct).length && (
                <ModalDeleteProduct
                    deletedProduct={deletedProduct}
                    setDeletedProduct={setDeletedProduct}
                    setProductsData={setProductsData}
                    setToaster={setToaster}
                    session={session}
                />
            )}
        </div >
    );
};

export default ProductsAdminView;
