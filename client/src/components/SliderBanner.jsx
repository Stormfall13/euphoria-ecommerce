import React, { useState } from 'react';
import carouselControlNext from '../assets/carousel-control-next.svg';
import carouselControlPrev from '../assets/carousel-control-prev.svg';

import slideBg from '../assets/slide-bg.webp';

const slides = [
    { id: 1, 
      img: slideBg, 
      alt: "Slide 1",
      textTop: 'T-Shirt / Tops',
      textTitle: 'Summer Value Pack',
      textBottom: 'cool / colorful / comfy',
      btnText: 'Shop Now',
      btnLink: '#',
    },
    { id: 2,
      img: slideBg, 
      alt: "Slide 2",
      textTop: 'T-Shirt / Tops',
      textTitle: 'Summer Value Pack',
      textBottom: 'cool / colorful / comfy',
      btnText: 'Shop Now',
      btnLink: '#',
    },
];

const SliderBanner = () => {

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="slider-banner">
    <div
      className="slider-banner__track"
      style={{ transform: `translateX(-${currentIndex * 100}%)` }}
    >
      {slides.map((slide) => (
        <div className="slider-banner__slide" key={slide.id}>
          <div className="slider__img">
            <img src={slide.img} alt={slide.alt} />
          </div>
          <div className="slide__text-wrapp">
            <p className='slide__text-top'>{slide.textTop}</p>
            <h2 className='slide__text-title'>{slide.textTitle}</h2>
            <p className='slide__text-bottom'>{slide.textBottom}</p>
            <a className='slide__link' href={slide.btnLink}>{slide.btnText}</a>
          </div>
        </div>
      ))}
    </div>

    {/* Кнопки */}
    <button className="slider-banner__btn prev" onClick={prevSlide}>
      <img src={carouselControlPrev} alt="Prev" />
    </button>
    <button className="slider-banner__btn next" onClick={nextSlide}>
      <img src={carouselControlNext} alt="Next" />
    </button>

    {/* Буллеты */}
    <div className="slider-banner__bullets">
      {slides.map((_, index) => (
        <span
          key={index}
          className={`bullet ${currentIndex === index ? "active" : ""}`}
          onClick={() => goToSlide(index)}
        ></span>
      ))}
    </div>
  </div>
  )
}

export default SliderBanner;
