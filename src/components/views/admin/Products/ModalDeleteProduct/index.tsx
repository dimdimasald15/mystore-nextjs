import styles from "./ModalDeleteProduct.module.scss";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import productServices from "@/services/product";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Product } from "@/types/product.type";
import { deleteFile } from "@/lib/firebase/service";

type PropTypes = {
    deletedProduct: Product | any;
    setDeletedProduct: Dispatch<SetStateAction<{}>>;
    setProductsData: Dispatch<SetStateAction<Product[]>>;
    setToaster: Dispatch<SetStateAction<{}>>;
};
const ModalDeleteProduct = (props: PropTypes) => {
    const {
        deletedProduct,
        setDeletedProduct,
        setProductsData,
        setToaster,
    } = props;
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteProduct = async () => {
        const result = await productServices.deleteProduct(deletedProduct.id);

        if (result.status === 200) {
            setIsLoading(false);
            deleteFile(
                `/images/products/${deletedProduct.id}/${deletedProduct.image.split("%2F")[3].split("?")[0]
                }`,
                async (status: boolean) => {
                    if (status) {
                        setToaster({
                            variant: "success",
                            message: `Success delete Product`,
                        });
                        setDeletedProduct({});
                        const { data } = await productServices.getAllProducts();
                        setProductsData(data.data);
                    }
                }
            );
        } else {
            setIsLoading(false);
            setToaster({
                variant: "danger",
                message: `Failed delete Product`,
            });
        }
    };
    return (
        <>
            <Modal onClose={() => setDeletedProduct({})}>
                <div className={styles.modalDelete__main}>
                    <h1 className={styles.modalDelete__main__title}>Are you sure?</h1>
                    <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleDeleteProduct()}
                        className={styles.modalDelete__main__button}
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default ModalDeleteProduct;
