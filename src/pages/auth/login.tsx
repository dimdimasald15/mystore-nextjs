import LoginView from "@/components/views/auth/Login";
import { Dispatch, SetStateAction } from "react";

type Propstypes = {
    setToaster: Dispatch<SetStateAction<{}>>
}
const LoginPage = ({ setToaster }: Propstypes) => {
    return <>
        <LoginView setToaster={setToaster} />
    </>
}

export default LoginPage;