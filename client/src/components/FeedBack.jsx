import React from 'react';

import starTrue from '../assets/star-true.svg';
import starFalse from '../assets/star-false.svg';

import feedback1 from '../assets/feedback1.png';
import feedback2 from '../assets/feedback2.png';
import feedback3 from '../assets/feedback3.png';

const feedbackControl = {
    hidden: false,
    title: 'Feedback'
}

const feedBackData = [
  {
      id: 1,
      author: "Floyd Miles",
      text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
      rating: 5,
      image: feedback1
  },
  {
      id: 2,
      author: "Savannah Nguyen",
      text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
      rating: 4,
      image: feedback2
  },
  {
      id: 3,
      author: "Ronald Richards ",
      text: "ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
      rating: 3,
      image: feedback3
  },
];

// 🔹 Компонент для отображения рейтинга звездами
const StarRating = ({ rating }) => {
  const totalStars = 5;
  
  return (
      <div className="star-rating">
          {[...Array(totalStars)].map((_, index) => (
              <img 
                  key={index}
                  src={index < rating ? starTrue : starFalse}
                  alt={index < rating ? "Filled star" : "Empty star"}
                  style={{ width: '20px', height: '20px' }}
              />
          ))}
      </div>
  );
};

const FeedBack = () => {
  return (
    <>
        {feedbackControl.hidden ? ('') : (
            <section className='feedback'>
                <p className='feedback__title'>{feedbackControl.title}</p>
                <div className="feedback__list">
                    {feedBackData.map((feedback) => (
                        <div key={feedback.id} className="feedback__item">
                            <div className="feedback__header">
                              <div className="feedback__img">
                                <img src={feedback.image} alt={feedback.author}/>
                              </div>
                              <StarRating rating={feedback.rating} />
                            </div>
                              <div className='feedback__body'>
                                <h4 className='feedback__author'>{feedback.author}</h4>
                                <p className="feedback__text">
                                    {feedback.text}
                                </p>
                              </div>
                        </div>
                    ))}
                </div>
            </section>
        )}
    </>
  );
}

export default FeedBack;
