import RegisterView from "@/components/views/auth/Register";
import { type } from "os";
import { Dispatch, SetStateAction } from "react";

type Propstypes = {
    setToaster: Dispatch<SetStateAction<{}>>
};
const registerPage = ({ setToaster }: Propstypes) => {
    return (<div>
        <RegisterView setToaster={setToaster} />
    </div>);
};
export default registerPage;