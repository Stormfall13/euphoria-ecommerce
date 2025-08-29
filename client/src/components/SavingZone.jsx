import React from 'react';

import arrowDownBrown from '../assets/arrow-down-brown.svg';
import arrowDownWhite from '../assets/arrow-down-white.svg';
import bsaving1 from '../assets/bsaving1.png';
import bsaving2 from '../assets/bsaving2.png';
import bsaving3 from '../assets/bsaving3.png';
import bsaving4 from '../assets/bsaving4.png';
import bsaving5 from '../assets/bsaving5.png';

import '../scss/savingZone.css';

const saveZoneData = [
  {
    id: 1,
    flagsName: '',
    title: 'Hawaiian Shirts',
    description: 'Dress up in summer vibe',
    img: bsaving1,
    discount: 'UPTO 50% OFF',
    arrow: true,
    link: '#',
    linkName: 'SHOP NOW',
    positionContentLeft: false,
    classStyleContent: true,
  },
  {
    id: 2,
    flagsName: 'Limited Stock',
    title: 'Printed T-Shirt',
    description: 'New Designs Every Week',
    img: bsaving2,
    discount: 'UPTO 40% OFF ',
    arrow: true,
    link: '#',
    linkName: 'SHOP NOW',
    positionContentLeft: true,
    classStyleContent: true,
  },
  {
    id: 3,
    flagsName: '',
    title: 'Cargo Joggers',
    description: 'Move with style & comfort',
    img: bsaving3,
    discount: 'UPTO 50% OFF',
    arrow: false,
    link: '#',
    linkName: 'SHOP NOW',
    positionContentLeft: true,
    classStyleContent: false,
  },
  {
    id: 4,
    flagsName: '',
    title: 'Urban Shirts',
    description: 'Live In Confort',
    img: bsaving4,
    discount: 'FLAT 60% OFF',
    arrow: false,
    link: '#',
    linkName: 'SHOP NOW',
    positionContentLeft: true,
    classStyleContent: false,
  },
  {
    id: 5,
    flagsName: '',
    title: 'Oversized T-Shirt',
    description: 'Street Style Icon',
    img: bsaving5,
    discount: 'FLAT 60% OFF',
    arrow: false,
    link: '#',
    linkName: 'SHOP NOW',
    positionContentLeft: true,
    classStyleContent: false,
  },
]

const SavingZone = () => {
  return (
    <section className='saving__zone'>
      <p className='saving__zone-title'>Big Saving Zone</p>
      <div className="wrapp__saving">
        {saveZoneData.map(items => (
          <div className="wrapper__saving" key={items.id}>
              <div className="saving__img">
                <img src={items.img} alt="saving img" />
              </div>
              <div className={`saving__content ${items.positionContentLeft ? '' : 'right'}`}>
                {items.flagsName.length > 0 ? (
                  <div className="saving__flag">
                    {items.flagsName}
                  </div>
                ) : (
                  ''
                )}
                <p className={`saving__title ${items.classStyleContent ? '' : 'black'}`}>
                  {items.title}
                </p>
                <p className={`saving__description ${items.classStyleContent ? '' : 'black'}`}>
                  {items.description}
                </p>
                <p className={`saving__discount ${items.classStyleContent ? '' : 'black'}`}>
                  {items.discount}
                </p>
                <div className="saving__arrow-wrapp">
                  <div className="saving__arrow">
                    <img src={items.arrow ? arrowDownWhite : arrowDownBrown} alt="arrow" />
                  </div>
                </div>
                <a href={items.link} className={`saving__link ${items.classStyleContent ? '' : 'black__link'}`}>
                  {items.linkName}
                </a>
              </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SavingZone;
