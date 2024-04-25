import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import styles from "./ModalUpdateProduct.module.scss";
import { Product } from "@/types/product.type";
import InputFile from "@/components/ui/InputFile";
import productServices from "@/services/product";
import { uploadFile } from "@/lib/firebase/service";
import Image from "next/image";

type PropTypes = {
    updatedProduct: Product | any;
    setProductsData: Dispatch<SetStateAction<Product[]>>;
    setUpdatedProduct: Dispatch<SetStateAction<boolean>>;
    setToaster: Dispatch<SetStateAction<{}>>;
};

const ModalUpdateProduct = (props: PropTypes) => {
    const {
        setToaster,
        setUpdatedProduct,
        setProductsData,
        updatedProduct,
    } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [stockCount, setStockCount] = useState(updatedProduct.stock);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);

    const handleStock = (e: any, i: number, type: string) => {
        const newStockCount: any = [...stockCount];
        newStockCount[i][type] = e.target.value;
        setStockCount(newStockCount);
    };

    const updateProduct = async (
        form: any,
        newImageURL: string = updatedProduct.image
    ) => {
        const data = {
            image: newImageURL,
            name: form.name.value,
            price: form.price.value,
            description: form.description.value,
            category: form.category.value,
            status: form.status.value,
            stock: stockCount,
        };
        const result = await productServices.updateProduct(
            updatedProduct.id,
            data
        );
        if (result.status === 200) {
            setIsLoading(false);
            setUploadedImage(null);
            form.reset();
            setUpdatedProduct(false);
            const { data } = await productServices.getAllProducts();
            setProductsData(data.data);
            setToaster({
                variant: "success",
                message: `Product ${updatedProduct.name} has been updated`,
            });
        } else {
            setToaster({
                variant: "danger",
                message: "Failed to update product",
            });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const form: any = e.target as HTMLFormElement;
        const file = form.image.files[0];

        if (file) {
            const newName = "main." + file.name.split(".")[1];
            uploadFile(
                updatedProduct.id,
                file,
                newName,
                "products",
                async (status: boolean, newImageURL: string) => {
                    if (status) {
                        updateProduct(form, newImageURL);
                    } else {
                        setToaster({
                            variant: "danger",
                            message: "Failed to update",
                        });
                    }
                }
            );
        } else {
            updateProduct(form);
        }
    };

    return (
        <>
            <Modal onClose={() => setUpdatedProduct(false)}>
                <h1>Update Product</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        className={styles.form__input}
                        label="Name"
                        type="name"
                        name="name"
                        placeholder="Insert product name"
                        defaultValue={updatedProduct.name}
                    />
                    <Input
                        className={styles.form__input}
                        label="Price"
                        type="number"
                        name="price"
                        placeholder="Insert product price"
                        defaultValue={updatedProduct.price}
                    />
                    <Input
                        className={styles.form__input}
                        label="Description"
                        type="text"
                        name="description"
                        placeholder="Insert product description"
                        defaultValue={updatedProduct.description}
                    />
                    <Select
                        className={styles.form__select}
                        label="Category"
                        name="category"
                        options={[
                            { label: "Men", value: "men" },
                            { label: "Women", value: "women" },
                        ]}
                        defaultValue={updatedProduct.category}
                    />
                    <Select
                        className={styles.form__select}
                        label="Status"
                        name="status"
                        options={[
                            { label: "Released", value: "true" },
                            { label: "Not Released", value: "false" },
                        ]}
                        defaultValue={updatedProduct.status}
                    />
                    <label htmlFor="image">Image</label>
                    <div className={styles.form__image}>
                        <Image
                            width={200}
                            height={200}
                            src={
                                uploadedImage
                                    ? URL.createObjectURL(uploadedImage)
                                    : updatedProduct.image
                            }
                            alt="image"
                            className={styles.form__image__preview}
                        />
                        <InputFile
                            uploadedImage={uploadedImage}
                            setUploadedImage={setUploadedImage}
                            name="image"
                        />
                    </div>
                    <label className={styles.form__label} htmlFor="stock">
                        Stock
                    </label>
                    {stockCount.map((item: { size: string; qty: number }, i: number) => (
                        <div className={styles.form__stock} key={i} >
                            <div className={styles.form__stock__item}>
                                <Input
                                    className={styles.form__input}
                                    label="Size"
                                    name="size"
                                    type="text"
                                    placeholder="Insert product size"
                                    onChange={(e) => {
                                        handleStock(e, i, "size");
                                    }}
                                    defaultValue={item.size}
                                />
                            </div>
                            <div className={styles.form__stock__item}>
                                <Input
                                    className={styles.form__input}
                                    label="Qty"
                                    name="qty"
                                    type="text"
                                    placeholder="Insert qty"
                                    onChange={(e) => {
                                        handleStock(e, i, "qty");
                                    }}
                                    defaultValue={item.qty}
                                />
                            </div>
                        </div>
                    ))}
                    <Button
                        type="button"
                        className={styles.form__stock__button}
                        onClick={() => setStockCount([...stockCount, { size: "", qty: 0 }])}
                    >
                        Add New Stock
                    </Button>
                    <Button type="submit" variant="primary" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Update Product"}
                    </Button>
                </form>
            </Modal >
        </>
    );
};

export default ModalUpdateProduct;
