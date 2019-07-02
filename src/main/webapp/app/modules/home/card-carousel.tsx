import React from 'react';
import Slider from 'react-slick';
import DatasetCard, { IDatasetCardProps } from 'app/modules/home/dataset-card';

export class CardCarousel extends React.Component<IDatasetCardProps> {
  render() {
    const { title, colorScheme, headerImg } = this.props;
    const settings = {
      dots: true,
      arrows: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <div>
        <Slider {...settings}>
          <div>
            <DatasetCard title={title} colorScheme={colorScheme} headerImg={headerImg}>
              {this.props.children}
            </DatasetCard>
          </div>
          <div>
            <DatasetCard title={title} colorScheme={colorScheme} headerImg={headerImg}>
              {this.props.children}
            </DatasetCard>
          </div>
          <div>
            <DatasetCard title={title} colorScheme={colorScheme} headerImg={headerImg}>
              {this.props.children}
            </DatasetCard>
          </div>
        </Slider>
        <br />
        <br />
      </div>
    );
  }
}

export default CardCarousel;
