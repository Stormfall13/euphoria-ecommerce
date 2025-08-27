import React from 'react';

const tableData = [
    {
        id: 1,
        tableText: 'Pick Any 4- Womens Plain T-shirt Combo',
        tablePrice: '1099',
    },
    {
        id: 2,
        tableText: 'Pick Any 4- Plain Womens Boxer Combo',
        tablePrice: '1099',
    },
    {
        id: 3,
        tableText: 'Pick Any 4 - Women Plain Full Sleeve T-shirt Combo',
        tablePrice: '1399',
    },
    {
        id: 4,
        tableText: 'Multicolor Checkered Long Casual Shirts for Women',
        tablePrice: '499',
    },
    {
        id: 5,
        tableText: 'Pick Any 2: Plain Boxy Casual Shirts for Women Combo',
        tablePrice: '799',
    },
    {
        id: 6,
        tableText: 'Blue Floral Anarkali Kurti',
        tablePrice: '599',
    },
    {
        id: 7,
        tableText: 'Jade Black Narrow Cut Flexible Women Jeggings',
        tablePrice: '998',
    },
    {
        id: 8,
        tableText: 'Mustard-yellow Solid Straight-Fit Women Pant',
        tablePrice: '499',
    },
    {
        id: 9,
        tableText: 'Women Pants Combo - Pick Any 2',
        tablePrice: '800',
    },
    {
        id: 10,
        tableText: 'Pista Green Solid Boxy Casual Shirts for Women',
        tablePrice: '499',
    },
    {
        id: 11,
        tableText: 'Plain Burgundy Womens Boxer',
        tablePrice: '349',
    },
    {
        id: 12,
        tableText: 'Striped Front Tie Casual Shirts for Women',
        tablePrice: '449',
    },
]

const CategoryPageContent = () => {
  return (
    <div className='category__content'>
      <div className="content__wrapp-text">
            <p className='content__title'>Clothing for Women Online in India</p>
            <div className="content__text">
            Reexplore Women's Clothing Collection Online at Euphoria

            Women's Clothing – Are you searching for the best website to 
            buy Clothing for Women online in India? Well, your search for
            the coolest and most stylish womens clothing ends here. 
            From trendy Casual Womens Wear Online shopping to premium 
            quality cotton women's apparel, Euphoria has closet of 
            Women Collection covered with the latest and best designs 
            of Women's Clothing Online.

            Our collection of clothes for women will make you the trendsetter with an iconic resemblance of choice in Womens Wear. 
            
            One-Stop Destination to Shop Every Clothing for Women: Euphoria

            Today, Clothing for Women is gaining more popularity above all. 
            This is because gone are the days when women were used to 
            carrying uncomfortable fashion. Today, a lady looks 
            prettier when she is in Casual Womens Wear which is a 
            comfortable outfit. Concerning this, Euphoria has a big fat 
            range of Stylish Women's Clothing that would make her the winner 
            wherever she goes. 

            Our collection of clothes for women will make you the 
            trendsetter with an iconic resemblance of choice in Womens
            Wear. It is quite evident to say that there are very few 
            Womens Clothing online stores where you can buy Western Wear
            for Women comprising the premium material and elegant design 
            that you are always seeking for. Basically, 

            See More
            </div>
      </div>
      <div className="content__table">
        <p className="table__title">Buy Women's Clothing at Best Price</p>
        <div className="table">
            {/* Заголовок таблицы */}
            <div className="table__header">
                <div className="table-cell header__cell">Women's Clothing</div>
                <div className="table-cell header__cell">Best Price</div>
            </div>
            
            {/* Строки таблицы */}
            {tableData.map((items) => (
                <div className="table__row" key={items.id}>
                    <div className="table__cell">{items.tableText}</div>
                    <div className="table__cell">${items.tablePrice}</div>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryPageContent;
