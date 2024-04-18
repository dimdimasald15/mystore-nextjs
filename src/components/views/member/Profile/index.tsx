import MemberLayout from "@/components/layouts/MemberLayout";
import styles from "./Profile.module.scss";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { uploadFile } from "@/lib/firebase/service";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import userServices from "@/services/user";
import { type } from "os";
import { User } from "@/types/user.type";

type PropTypes = {
    profile: User | any;
    setProfile: Dispatch<SetStateAction<{}>>;
    session: any;
    setToaster: Dispatch<SetStateAction<{}>>;
};

const ProfileMemberView = (props: PropTypes) => {
    const { profile, setProfile, session, setToaster } = props;
    const [isLoading, setIsLoading] = useState("");
    const [changeImage, setChangeImage] = useState<File | any>({});

    const handleChangeProfile = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading("profile");

        const form = e.target as HTMLFormElement;
        const data = {
            fullname: form.fullname.value,
            phone: form.phone.value,
        };

        const result = await userServices.updateProfile(
            data,
            session.data?.accessToken
        );

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
            const result = await userServices.updateProfile(
                data,
                session.data?.accessToken
            );

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
        if (file) {
            uploadFile(
                profile.id,
                file,
                async (status: boolean, newImageURL: string) => {
                    if (status) {
                        const data = {
                            image: newImageURL,
                        };
                        const result = await userServices.updateProfile(
                            data,
                            session.data?.accessToken
                        );

                        if (result.status === 200) {
                            setIsLoading("");
                            setProfile({ ...profile, image: newImageURL });
                            setChangeImage({});
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
                        setChangeImage({});
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
                                    width={200}
                                    height={200}
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
                                    {changeImage.name ? (
                                        <p>{changeImage.name}</p>
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
                                        setChangeImage(e.currentTarget.files[0]);
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
                                    type="text"
                                    label="Fullname"
                                    name="fullname"
                                    defaultValue={profile.fullname}
                                />
                                <Input
                                    type="number"
                                    label="Phone"
                                    name="phone"
                                    placeholder="Input your phone number"
                                    defaultValue={profile.phone}
                                />
                                <Input
                                    type="email"
                                    label="Email"
                                    name="email"
                                    defaultValue={profile.email}
                                    disabled
                                />
                                <Input
                                    type="text"
                                    label="Role"
                                    name="role"
                                    defaultValue={profile.role}
                                    disabled
                                />
                                <Button type="submit" variant="primary">
                                    {isLoading === "profile" ? "Loading..." : "Update Profile"}
                                </Button>
                            </form>
                        </div>
                        <div className={styles.profile__main__row__password}>
                            <h2>Change Password</h2>
                            <form onSubmit={handleChangePassword}>
                                <Input
                                    label="Old Password"
                                    name="old-password"
                                    type="password"
                                    disabled={profile.type === "google"}
                                    placeholder="Enter your old password"
                                />
                                <Input
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
