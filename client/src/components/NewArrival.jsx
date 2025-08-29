import React from 'react';

import arrival1 from '../assets/arrival1.png';
import arrival2 from '../assets/arrival2.webp';
import arrival3 from '../assets/arrival3.webp';
import arrival4 from '../assets/arrival4.webp';

import '../scss/newArrival.css';

const newArrivalData = [
  {
    id: 1,
    img: arrival1,
    arrivalName: 'Knitted Joggers',
    arrivalLink: '#',
  },
  {
    id: 2,
    img: arrival2,
    arrivalName: 'Full Sleeve',
    arrivalLink: '#',
  },
  {
    id: 3,
    img: arrival3,
    arrivalName: 'Active T-Shirts',
    arrivalLink: '#',
  },
  {
    id: 4,
    img: arrival4,
    arrivalName: 'Urban Shirts',
    arrivalLink: '#',
  },
]

const NewArrival = () => {

  return (
    <section className='new__arrival'>
      <p className='new__arrival-title'>New Arrival</p>
      <div className="arrival__wrapper">
        {newArrivalData.map(items => (
            <div className="arrival__wrapp" key={items.id}>
              <a className="arrival__link" href={items.arrivalLink}>
                <div className="arrival__img">
                  <img src={items.img} alt="arrival img" />
                </div>
                <p className="arrival__name">{items.arrivalName}</p>
              </a>
            </div>
        ))}
      </div>
    </section>
  )
}

export default NewArrival;
