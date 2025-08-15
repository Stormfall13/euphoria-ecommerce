import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import GlobalSearchProduct from "./components/GlobalSearchProduct";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const UserPage = lazy(() => import("./pages/UserPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const BasketPage = lazy(() => import("./pages/BasketPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const AdmimAllUsersPage = lazy(() => import("./pages/AdminAllUsersPage"));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage"));
const Favorites = lazy(() => import("./pages/Favorites"));
const AllCategoryPage = lazy(() => import("./pages/AllCategoryPage"));

const AppRouter = () => {

    return (
        <Router>
            <Suspense fallback={<div>Загрузка...</div>}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/category/:id" element={<CategoryPage />} />
                    <Route path="/basket" element={<BasketPage/>} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/allcategory" element={<AllCategoryPage />} />


                    
                    {/* 🔐 Защищенные маршруты (только для user и admin) */}
                    <Route path="/" element={ <ProtectedRoute allowedRoles={["user", "admin"]}> <Home /> </ProtectedRoute> } />
                    <Route path="/user" element={ <ProtectedRoute allowedRoles={["user", "admin"]}> <UserPage /> </ProtectedRoute> } />
                    <Route path="/all-users" element={<ProtectedRoute allowedRoles={["admin"]}><AdmimAllUsersPage /></ProtectedRoute>} />
                    <Route path="/admin" element={ <ProtectedRoute allowedRoles={["admin"]}> <AdminPage /> </ProtectedRoute> } />
                    <Route path="/gallery" element={ <ProtectedRoute allowedRoles={["admin"]}> <GalleryPage /> </ProtectedRoute> } />
                    <Route path="/category/:id" element={ <ProtectedRoute allowedRoles={["admin", "user"]}> <CategoryPage /> </ProtectedRoute> } />
                    <Route path="/basket" element={<ProtectedRoute allowedRoles={["user", "admin"]}> <BasketPage/> </ProtectedRoute>} />
                    <Route path="/product/:id" element={<ProtectedRoute allowedRoles={["admin", "user"]}> <ProductPage /> </ProtectedRoute> } />

                    {/* Если страница не найдена — редирект на `/` */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRouter;
