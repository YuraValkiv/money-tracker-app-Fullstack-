import {RouterProvider} from "react-router-dom";
import {router} from "./router/router.tsx";
import {useAppDispatch} from "./store/hooks.ts";
import {getTokenFromLocalStorage} from "./helpers/localstorage.helper.ts";
import {AuthService} from "./services/auth.service.ts";
import {login, logout} from "./store/user/userSlice.ts";
import {useEffect} from "react";

function App() {
    const dispatch = useAppDispatch()

    const checkAuth = async () => {
        const token = getTokenFromLocalStorage()
        try {
            if (token) {
                const data = await AuthService.getProfile()

                if(data) {
                    dispatch(login(data))
                } else {
                    dispatch(logout())
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return <RouterProvider router={router}/>;
}
export default App
