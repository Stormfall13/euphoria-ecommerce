import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchFavorites } from "../store/slices/favoriteSlice";

import SliderBanner from "../components/SliderBanner";
import Discount from "../components/Discount";
import NewArrival from "../components/NewArrival";
import SavingZone from "../components/SavingZone";
import MadeBanner from "../components/MadeBanner";
import ForMen from "../components/ForMen";
import ForWomen from "../components/ForWomen";
import Brands from "../components/Brands";
import HeaderMain from "../components/HeaderMain";
import Limelight from "../components/Limelight";
import FeedBack from "../components/FeedBack";
import Footer from "../components/Footer";


const Home = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            dispatch(fetchFavorites());
        }
    }, [dispatch]);
    return (
        <>
            <HeaderMain />
            <SliderBanner />
            <Discount />
            <NewArrival />
            <SavingZone />
            <MadeBanner />
            <ForMen />
            <ForWomen />
            <Brands />
            <Limelight />
            <FeedBack />
            <Footer />
        </>
    );
};

export default Home;
