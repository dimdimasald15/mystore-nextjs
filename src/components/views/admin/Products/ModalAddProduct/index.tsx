import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import styles from "./ModalAddProduct.module.scss";
import { Product } from "@/types/product.type";
import InputFile from "@/components/ui/InputFile";
import productServices from "@/services/product";
import { uploadFile } from "@/lib/firebase/service";
import Image from "next/image";

type PropTypes = {
    setProductsData: Dispatch<SetStateAction<Product[]>>;
    setAddProduct: Dispatch<SetStateAction<boolean>>;
    setToaster: Dispatch<SetStateAction<{}>>;
};

const ModalAddProduct = (props: PropTypes) => {
    const { setToaster, setAddProduct, setProductsData } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [stockCount, setStockCount] = useState([{ size: "", qty: 0 }]);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);

    const handleStock = (e: any, i: number, type: string) => {
        const newStockCount: any = [...stockCount];
        newStockCount[i][type] = e.target.value;
        setStockCount(newStockCount);
    };

    const uploadImage = (id: string, form: any) => {
        const file = form.image.files[0];
        const newName = "main." + file.name.split(".")[1];

        if (file) {
            uploadFile(
                id,
                file,
                newName,
                "products",
                async (status: boolean, newImageURL: string) => {
                    if (status) {
                        const data = {
                            image: newImageURL,
                        };
                        const result = await productServices.updateProduct(
                            id,
                            data
                        );

                        if (result.status === 200) {
                            setIsLoading(false);
                            setUploadedImage(null);
                            form.reset();
                            setAddProduct(false);
                            const { data } = await productServices.getAllProducts();
                            setProductsData(data.data);
                            setToaster({
                                variant: "success",
                                message: "New product has been added",
                            });
                        } else {
                            setToaster({
                                variant: "danger",
                                message: "Failed to add new product",
                            });
                        }
                    } else {
                        setToaster({
                            variant: "danger",
                            message: "Failed to add new product",
                        });
                    }
                }
            );
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const form: any = e.target as HTMLFormElement;
        const data = {
            name: form.name.value,
            price: form.price.value,
            description: form.description.value,
            category: form.category.value,
            status: form.status.value,
            stock: stockCount,
            image: "",
        };

        const result = await productServices.addProduct(data);

        if (result.status === 200) {
            uploadImage(result.data.data.id, form);
        }
    };

    return (
        <>
            <Modal onClose={() => setAddProduct(false)}>
                <h1>Add Product</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        className={styles.form__input}
                        label="Name"
                        type="name"
                        name="name"
                        placeholder="Insert product name"
                    />
                    <Input
                        className={styles.form__input}
                        label="Price"
                        type="number"
                        name="price"
                        placeholder="Insert product price"
                    />
                    <Input
                        className={styles.form__input}
                        label="Description"
                        type="text"
                        name="description"
                        placeholder="Insert product description"
                    />
                    <Select
                        className={styles.form__select}
                        label="Category"
                        name="category"
                        options={[
                            { label: "Men", value: "men" },
                            { label: "Women", value: "women" },
                        ]}
                    />
                    <Select
                        className={styles.form__select}
                        label="Status"
                        name="status"
                        options={[
                            { label: "Released", value: "true" },
                            { label: "Not Released", value: "false" },
                        ]}
                    />
                    <label htmlFor="image">Image</label>
                    <div className={styles.form__image}>
                        {uploadedImage ? (
                            <Image
                                width={200}
                                height={200}
                                src={URL.createObjectURL(uploadedImage)}
                                alt="image"
                                className={styles.form__image__preview}
                            />
                        ) : (
                            <div className={styles.form__image__placeholder}>No Image</div>
                        )}
                        <InputFile
                            uploadedImage={uploadedImage}
                            setUploadedImage={setUploadedImage}
                            name="image"
                        />
                    </div>
                    <label className={styles.form__label} htmlFor="stock">
                        Stock
                    </label>
                    {stockCount.map((item: { size: string; qty: number }, i) => (
                        <div className={styles.form__stock} key={i}>
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
                        {isLoading ? "Loading..." : "Add Product"}
                    </Button>
                </form>
            </Modal>
        </>
    );
};

export default ModalAddProduct;
