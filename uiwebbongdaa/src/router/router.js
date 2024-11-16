import { Register } from '../Layout/RegisterLayout'
import { Logintong } from '../Layout/LoginLayout'
import { HomeAdmin } from '../Layout/HomeAdmin'
import { HomeNhanVien } from '../Layout/HomeNhanVien'
import { Login } from '../Layout/LoginLayout/Login'
import Calendar from '../Layout/CalendarLayout/Calendar'
import { ThongKeLayout } from '../Layout/ThongKeLayout'

const publicRoutes = [
  { path: '/', component: Logintong, layout: null },
  { path: '/admin', component: HomeAdmin, layout: null },
  { path: '/nhanvien', component: HomeNhanVien, layout: null },
  { path: '/register', component: Register, layout: null },
  { path: '/login', component: Login, layout: null },
  { path: '/calendar', component: Calendar, layout: null },
    { path: '/thongke', component: ThongKeLayout, layout: null }

]
const privateRoutes = []
export { publicRoutes, privateRoutes }
