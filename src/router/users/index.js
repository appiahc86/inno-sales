import LoginView from "@/views/LoginView";
import NewPasswordView from "@/views/users/NewPasswordView";
import AddUserView from "@/views/users/AddUserView";
import EditUserView from "@/views/users/EditUserView";
import UsersIndexView from "@/views/users/UsersIndexView";
import InactiveUsersView from "@/views/users/InactiveUsersView";
import ResetPasswordView from "@/views/users/ResetPasswordView";

const userRouter = [
    {
        path: '/users/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/users/new-password/:data',
        name: 'new-password',
        component: NewPasswordView
    },
    {
        path: '/users/add-user',
        name: 'add-user',
        component: AddUserView
    },
    {
        path: '/users/edit-user/:data',
        name: 'edit-user',
        component: EditUserView
    },
    {
        path: '/users/index',
        name: 'users',
        component: UsersIndexView
    },
    {
        path: '/users/inactive-users',
        name: 'inactive-users',
        component: InactiveUsersView
    },
    {
        path: '/users/reset-password',
        name: 'reset-password',
        component: ResetPasswordView
    }

]

export default userRouter;


