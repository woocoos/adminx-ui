import { ForgetPwdBeginRes } from "@/services/basis";
import Authentication from "./components/authentication";
import PasswordStep from "./components/passwordStep";
import styles from "./index.module.css";
import { useState } from "react";

export default () => {

    const [token, setToken] = useState<ForgetPwdBeginRes>()

    return <div className={styles.container}>
        <div className="container-item">
            {token ?
                <PasswordStep
                    token={token}
                />
                : <Authentication
                    x-else
                    onSuccess={(result) => {
                        setToken(result)
                    }}
                />
            }
        </div>
    </div>
}