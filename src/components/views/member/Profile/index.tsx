import MemberLayout from "@/components/layouts/MemberLayout";
import styles from "./Profile.module.scss";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { uploadFile } from "@/lib/firebase/service";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import userServices from "@/services/user";
import { User } from "@/types/user.type";

type PropTypes = {
    setToaster: Dispatch<SetStateAction<{}>>;
};

const ProfileMemberView = (props: PropTypes) => {
    const { setToaster } = props;
    const [isLoading, setIsLoading] = useState("");
    const [uploadedImage, setUploadedImage] = useState<File | any>({});
    const [profile, setProfile] = useState<User | any>([]);
    const getProfile = async () => {
        const { data } = await userServices.getProfile();
        setProfile(data.data);
    };

    useEffect(() => {
        getProfile();
    }, []);

    const handleChangeProfile = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading("profile");

        const form = e.target as HTMLFormElement;
        const data = {
            fullname: form.fullname.value,
            phone: form.phone.value,
        };

        const result = await userServices.updateProfile(data);

        if (result.status === 200) {
            setIsLoading("");
            setProfile({ ...profile, fullname: data.fullname, phone: data.phone });
            form.reset();
            setToaster({
                variant: "success",
                message: "Profile has been updated",
            });
        } else {
            setIsLoading("");
        }
    };

    const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading("password");
        const form = e.target as HTMLFormElement;
        const data = {
            password: form["new-password"].value,
            oldPassword: form["old-password"].value,
            encryptedPassword: profile.password,
        };

        try {
            const result = await userServices.updateProfile(data);

            if (result.status === 200) {
                setIsLoading("");
                form.reset();
                setToaster({
                    variant: "success",
                    message: "Password has been changed",
                });
            }
        } catch (error) {
            setIsLoading("");
            setToaster({
                variant: "danger",
                message: "Failed change password",
            });
        }
    };

    const handleChangeProfilePicture = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading("picture");
        const form = e.target as HTMLFormElement;
        const file = form.image.files[0];
        const newName = "profile." + file.name.split(".")[1];
        if (file) {
            uploadFile(
                profile.id,
                file,
                newName,
                "users",
                async (status: boolean, newImageURL: string) => {
                    if (status) {
                        const data = {
                            image: newImageURL,
                        };
                        const result = await userServices.updateProfile(data);

                        if (result.status === 200) {
                            setIsLoading("");
                            setProfile({ ...profile, image: newImageURL });
                            setUploadedImage({});
                            form.reset();
                            setToaster({
                                variant: "success",
                                message: "Avatar has been changed",
                            });
                        } else {
                            setIsLoading("");
                        }
                    } else {
                        setIsLoading("");
                        setUploadedImage({});
                        setToaster({
                            variant: "danger",
                            message: "Failed change avatar",
                        });
                    }
                }
            );
        }
    };
    return (
        <div>
            <MemberLayout>
                <h1 className={styles.profile__title}>Profile Page</h1>
                <div className={styles.profile__main}>
                    <div className={styles.profile__main__row}>
                        <div className={styles.profile__main__row__avatar}>
                            <h2 className={styles.profile__main__row__avatar__title}>
                                Avatar
                            </h2>
                            {profile.image ? (
                                <Image
                                    src={profile.image}
                                    alt="profile image"
                                    width={150}
                                    height={150}
                                    className={styles.profile__main__row__avatar__image}
                                />
                            ) : (
                                <div className={styles.profile__main__row__avatar__image}>
                                    {profile.fullname?.charAt(0)}
                                </div>
                            )}
                            <form onSubmit={handleChangeProfilePicture}>
                                <label
                                    className={styles.profile__main__row__avatar__label}
                                    htmlFor="uploadImage"
                                >
                                    {uploadedImage.name ? (
                                        <p>{uploadedImage.name}</p>
                                    ) : (
                                        <>
                                            <p>
                                                Upload a new avatar, larger image will be resize
                                                automatically
                                            </p>
                                            <p>
                                                Maximum upload size is <b>1MB</b>
                                            </p>
                                        </>
                                    )}
                                </label>
                                <input
                                    className={styles.profile__main__row__avatar__input}
                                    type="file"
                                    name="image"
                                    id="uploadImage"
                                    onChange={(e: any) => {
                                        e.preventDefault();
                                        setUploadedImage(e.currentTarget.files[0]);
                                    }}
                                />
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className={styles.profile__main__row__avatar__button}
                                >
                                    {isLoading === "picture" ? "Uploading..." : "Change Picture"}
                                </Button>
                            </form>
                        </div>
                        <div className={styles.profile__main__row__profile}>
                            <h2 className={styles.profile__main__row__profile__title}>
                                Profile
                            </h2>
                            <form onSubmit={handleChangeProfile}>
                                <Input
                                    className={styles.profile__main__row__profile__input}
                                    type="text"
                                    label="Fullname"
                                    name="fullname"
                                    defaultValue={profile.fullname}
                                />
                                <Input
                                    className={styles.profile__main__row__profile__input}
                                    type="number"
                                    label="Phone"
                                    name="phone"
                                    placeholder="Input your phone number"
                                    defaultValue={profile.phone}
                                />
                                <Input
                                    className={styles.profile__main__row__profile__input}
                                    type="email"
                                    label="Email"
                                    name="email"
                                    defaultValue={profile.email}
                                    disabled
                                />
                                <Input
                                    className={styles.profile__main__row__profile__input}
                                    type="text"
                                    label="Role"
                                    name="role"
                                    defaultValue={profile.role}
                                    disabled
                                />
                                <Button type="submit" className={styles.profile__main__row__profile__button}>
                                    {isLoading === "profile" ? "Loading..." : "Update Profile"}
                                </Button>
                            </form>
                        </div>
                        <div className={styles.profile__main__row__password}>
                            <h2 className={styles.profile__main__row__password__title}>Change Password</h2>
                            <form onSubmit={handleChangePassword}>
                                <Input
                                    className={styles.profile__main__row__password__input}
                                    label="Old Password"
                                    name="old-password"
                                    type="password"
                                    disabled={profile.type === "google"}
                                    placeholder="Enter your old password"
                                />
                                <Input
                                    className={styles.profile__main__row__password__input}
                                    label="New Password"
                                    name="new-password"
                                    type="password"
                                    placeholder="Enter your new password"
                                    disabled={profile.type === "google"}
                                />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className={styles.profile__main__row__password__button}
                                    disabled={isLoading === "password" || profile.type === "google"}
                                >
                                    {isLoading === "password" ? "Loading..." : "Update Password"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </MemberLayout>
        </div>
    );
};

export default ProfileMemberView;
