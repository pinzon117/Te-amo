import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom"
import LoginPage from "../pages/login"
import LetterPage from "../pages/LetterPage"
import PrivateRoute from "../context/PrivateRoute"
import { AuthProvider } from "../context/AuthContext"

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/carta",
        element: <PrivateRoute><LetterPage /></PrivateRoute>,
    },
    {
        path: "/",
        element: <PrivateRoute><LetterPage /></PrivateRoute>
    }
]);

export const AppRouter = () => {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    )
}