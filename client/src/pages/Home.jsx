import React from "react";

import SliderBanner from "../components/SliderBanner";
import Discount from "../components/Discount";
import NewArrival from "../components/NewArrival";
import SavingZone from "../components/SavingZone";
import MadeBanner from "../components/MadeBanner";
import ForMen from "../components/ForMen";
import ForWomen from "../components/ForWomen";
import Brands from "../components/Brands";
import HeaderMain from "../components/HeaderMain";



const Home = () => {




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
        </>
    );
};

export default Home;
