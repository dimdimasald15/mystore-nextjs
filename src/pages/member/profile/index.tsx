import ProfileMemberView from "@/components/views/member/Profile";
import userServices from "@/services/user";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "@/types/user.type";

type Proptypes = {
    setToaster: Dispatch<SetStateAction<{}>>;
}

const ProfilePage = ({ setToaster }: Proptypes) => {
    const [profile, setProfile] = useState<User | {}>([]);
    const session: any = useSession();
    useEffect(() => {
        if (session.data?.accessToken && Object.keys(profile).length === 0) {
            const getProfile = async () => {
                const { data } = await userServices.getProfile(
                    session.data?.accessToken
                );
                setProfile(data.data);
            };
            getProfile();
        }
    }, [profile, session]);
    return (
        <>
            <ProfileMemberView
                profile={profile}
                setProfile={setProfile}
                session={session}
                setToaster={setToaster}
            />
        </>
    );
};

export default ProfilePage;
