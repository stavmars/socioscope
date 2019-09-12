import React from 'react';
import Slider from 'react-slick';

export interface ICardCarouselProp {
  colorScheme: string;
}

export class CardCarousel extends React.Component<ICardCarouselProp> {
  render() {
    const settings = {
      dots: true,
      arrows: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      useCSS: true
    };

    return (
      <div>
        <Slider {...settings} className="slider" dotsClass={`slick-dots ${this.props.colorScheme}`}>
          {this.props.children}
        </Slider>
        <br />
        <br />
      </div>
    );
  }
}

export default CardCarousel;
