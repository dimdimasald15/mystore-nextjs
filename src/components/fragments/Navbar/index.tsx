import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./Navbar.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { useState } from "react";

const NavItems = [
    {
        title: "Home",
        url: "/",
    },
    {
        title: "Products",
        url: "/products",
    },
];

const Navbar = () => {
    const { data }: any = useSession();
    const { pathname, push } = useRouter();
    const [dropdownUser, setDropdownUser] = useState(false);

    return (
        <div className={styles.navbar}>
            <h1 className={styles.navbar__title}>DimStore</h1>
            <div className={styles.navbar__nav}>
                {NavItems.map((item, index) => (
                    <Link
                        className={`${styles.navbar__nav__item} ${pathname === item.url && styles["navbar__nav__item--active"]
                            }`}
                        href={item.url}
                        key={index}
                    >
                        {item.title}
                    </Link>
                ))}
            </div>
            {data ? (<div className={styles.navbar__user}>
                <div className={styles.navbar__user__cart}>
                    <Link href={"/cart"}>
                        <i className="bx bx-cart-alt" />
                    </Link>
                </div>
                <div className={styles.navbar__user__profile}>
                    {data?.user?.image ? (
                        <Image
                            src={data?.user?.image}
                            alt="profile"
                            width={40}
                            height={40}
                            className={styles.navbar__user__profile__image}
                            onMouseOver={() => setDropdownUser(!dropdownUser)}
                        />
                    ) : (
                        <i className={`bx bx-user`}
                            onMouseOver={() => setDropdownUser(!dropdownUser)}
                        ></i>
                    )}
                    <div
                        className={`${styles.navbar__user__profile__dropdown} ${dropdownUser &&
                            styles["navbar__user__profile__dropdown--active"]
                            }`}
                    >
                        <button
                            className={styles.navbar__user__profile__dropdown__item}
                            onClick={() => push("/member/profile")}
                        >
                            Profile
                        </button>
                        <button
                            className={styles.navbar__user__profile__dropdown__item}
                            onClick={() => signOut()}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>) :
                <Button
                    type="button"
                    className={styles.navbar__button}
                    onClick={() => signIn()}
                >
                    Login
                </Button>}
        </div>
    );
};

export default Navbar;
